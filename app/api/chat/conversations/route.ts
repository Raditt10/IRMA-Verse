import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch conversations for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    let conversations;

    if (userRole === "instruktur") {
      // Instruktur: get all conversations where they are the instructor
      conversations = await prisma.chatConversation.findMany({
        where: { instructorId: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  senderId: { not: userId },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json(
        conversations.map((conv) => ({
          id: conv.id,
          participant: conv.user,
          lastMessage: conv.messages[0] || null,
          unreadCount: conv._count.messages,
          updatedAt: conv.updatedAt,
        }))
      );
    } else {
      // User: get all conversations where they are the user
      conversations = await prisma.chatConversation.findMany({
        where: { userId },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              bidangKeahlian: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  senderId: { not: userId },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json(
        conversations.map((conv) => ({
          id: conv.id,
          participant: conv.instructor,
          lastMessage: conv.messages[0] || null,
          unreadCount: conv._count.messages,
          updatedAt: conv.updatedAt,
        }))
      );
    }
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { instructorId } = body;

    if (!instructorId) {
      return NextResponse.json(
        { error: "Instructor ID is required" },
        { status: 400 }
      );
    }

    // Check if instructor exists and is actually an instructor
    const instructor = await prisma.user.findFirst({
      where: {
        id: instructorId,
        role: "instruktur",
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await prisma.chatConversation.findUnique({
      where: {
        userId_instructorId: {
          userId: session.user.id,
          instructorId,
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create new conversation
    const conversation = await prisma.chatConversation.create({
      data: {
        userId: session.user.id,
        instructorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            bidangKeahlian: true,
          },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
