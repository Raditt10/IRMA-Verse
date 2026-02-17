"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/socket";

// ==========================================
// Types
// ==========================================

export interface NotificationData {
  id: string;
  userId: string;
  type: "basic" | "invitation";
  status: "unread" | "read" | "accepted" | "rejected" | "expired";
  title: string;
  message: string;
  icon?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  actionUrl?: string | null;
  inviteToken?: string | null;
  senderId?: string | null;
  sender?: {
    id: string;
    name: string | null;
    email: string;
    avatar?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  /** Refresh notifications from server */
  refresh: () => Promise<void>;
  /** Mark a single notification as read */
  markAsRead: (id: string) => Promise<void>;
  /** Mark all notifications as read */
  markAllAsRead: () => Promise<void>;
  /** Respond to an invitation notification (accept/reject) */
  respondToInvitation: (
    id: string,
    action: "accepted" | "rejected",
  ) => Promise<void>;
  /** Remove a notification from local state (optimistic) */
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

// ==========================================
// Provider
// ==========================================

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------
  // Fetch all notifications on mount
  // ------------------------------------------
  const fetchNotifications = useCallback(async () => {
    if (sessionStatus !== "authenticated") return;

    try {
      const res = await fetch("/api/notifications?limit=100");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("[NotificationProvider] Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionStatus]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchNotifications();
    } else if (sessionStatus === "unauthenticated") {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [sessionStatus, fetchNotifications]);

  // ------------------------------------------
  // Listen for real-time notifications via WebSocket
  // ------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: NotificationData) => {
      console.log(
        "[NotificationProvider] New notification via socket:",
        notification,
      );
      setNotifications((prev) => [notification, ...prev]);
      if (notification.status === "unread") {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket]);

  // ------------------------------------------
  // Actions
  // ------------------------------------------
  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, status: "read" as const } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("[NotificationProvider] markAsRead error:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST", // mark-all-read
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.status === "unread" ? { ...n, status: "read" as const } : n,
          ),
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("[NotificationProvider] markAllAsRead error:", error);
    }
  }, []);

  const respondToInvitation = useCallback(
    async (id: string, action: "accepted" | "rejected") => {
      try {
        const res = await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: action }),
        });

        if (res.ok) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: action } : n)),
          );
          // If it was unread before, decrement
          const notif = notifications.find((n) => n.id === id);
          if (notif?.status === "unread") {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      } catch (error) {
        console.error(
          "[NotificationProvider] respondToInvitation error:",
          error,
        );
      }
    },
    [notifications],
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target?.status === "unread") {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead,
        respondToInvitation,
        dismiss,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
