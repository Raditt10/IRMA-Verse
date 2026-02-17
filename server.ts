import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store online users: { userId: { socketId, role, name } }
const onlineUsers = new Map<
  string,
  { socketId: string; role: string; name: string }
>();
// Store typing status: { conversationId: userId[] }
const typingUsers = new Map<string, Set<string>>();

// Global reference to io for internal notification pushes
let ioInstance: SocketIOServer | null = null;

/** Push a notification to a specific user via their personal socket room */
export function pushNotificationToUser(userId: string, notification: any) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit("notification:new", notification);
  }
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req?.url || "", true);

    // Internal endpoint for pushing notifications from API routes
    if (
      parsedUrl.pathname === "/__internal/push-notification" &&
      req.method === "POST"
    ) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const { userId, notification } = JSON.parse(body);
          if (userId && notification && ioInstance) {
            ioInstance
              .to(`user:${userId}`)
              .emit("notification:new", notification);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        } catch {
          res.writeHead(400);
          res.end("Bad request");
        }
      });
      return;
    }

    // Skip Next.js handler for socket.io requests
    if (parsedUrl.pathname?.startsWith("/socket.io")) {
      return;
    }

    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Store global reference
  ioInstance = io;

  io.on("connection", (socket: import("socket.io").Socket) => {
    console.log("User connected:", socket.id);

    // User joins with their info
    socket.on(
      "user:join",
      (userData: { userId: string; role: string; name: string }) => {
        onlineUsers.set(userData.userId, {
          socketId: socket.id,
          role: userData.role,
          name: userData.name,
        });

        // Join personal room
        socket.join(`user:${userData.userId}`);

        // Broadcast online status
        io.emit("presence:update", {
          userId: userData.userId,
          status: "online",
          name: userData.name,
        });

        // Send current online users to the newly connected user
        const onlineUsersList = Array.from(onlineUsers.entries()).map(
          ([id, data]) => ({
            userId: id,
            ...data,
            status: "online",
          }),
        );
        socket.emit("presence:list", onlineUsersList);

        console.log(`User ${userData.name} (${userData.userId}) joined`);
      },
    );

    // Join a conversation room
    socket.on("conversation:join", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle new message
    socket.on(
      "message:send",
      (data: {
        conversationId: string;
        senderId: string;
        recipientId: string;
        content: string;
        messageId: string;
        senderName: string;
        createdAt: string;
      }) => {
        // Broadcast to conversation room
        io.to(`conversation:${data.conversationId}`).emit(
          "message:receive",
          data,
        );

        // Also notify recipient directly if they're online
        const recipientData = onlineUsers.get(data.recipientId);
        if (recipientData) {
          io.to(`user:${data.recipientId}`).emit("message:notification", {
            conversationId: data.conversationId,
            senderId: data.senderId,
            senderName: data.senderName,
            preview: data.content.substring(0, 50),
          });
        }
      },
    );

    // Handle typing indicator
    socket.on(
      "typing:start",
      (data: { conversationId: string; userId: string; userName: string }) => {
        if (!typingUsers.has(data.conversationId)) {
          typingUsers.set(data.conversationId, new Set());
        }
        typingUsers.get(data.conversationId)!.add(data.userId);

        socket.to(`conversation:${data.conversationId}`).emit("typing:update", {
          conversationId: data.conversationId,
          userId: data.userId,
          userName: data.userName,
          isTyping: true,
        });
      },
    );

    socket.on(
      "typing:stop",
      (data: { conversationId: string; userId: string }) => {
        if (typingUsers.has(data.conversationId)) {
          typingUsers.get(data.conversationId)!.delete(data.userId);
        }

        socket.to(`conversation:${data.conversationId}`).emit("typing:update", {
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: false,
        });
      },
    );

    // Handle message read
    socket.on(
      "message:read",
      (data: {
        conversationId: string;
        userId: string;
        messageIds: string[];
      }) => {
        io.to(`conversation:${data.conversationId}`).emit(
          "message:read:update",
          data,
        );
      },
    );

    // Handle message edit
    socket.on(
      "message:edit",
      (data: {
        messageId: string;
        conversationId: string;
        newContent: string;
        editedAt: string;
      }) => {
        io.to(`conversation:${data.conversationId}`).emit(
          "message:edited",
          data,
        );
      },
    );

    // Handle message delete
    socket.on(
      "message:delete",
      (data: {
        messageId: string;
        conversationId: string;
        deletedAt: string;
      }) => {
        io.to(`conversation:${data.conversationId}`).emit(
          "message:deleted",
          data,
        );
      },
    );

    // Handle last seen update
    socket.on("user:update-last-seen", async (userId: string) => {
      // Broadcast to all connected clients
      io.emit("user:last-seen-updated", {
        userId,
        lastSeen: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Find and remove the disconnected user
      for (const [userId, userData] of onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          onlineUsers.delete(userId);

          // Broadcast offline status
          io.emit("presence:update", {
            userId,
            status: "offline",
            name: userData.name,
          });

          console.log(`User ${userData.name} (${userId}) disconnected`);
          break;
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log("> Socket.IO server is running");
  });
});
