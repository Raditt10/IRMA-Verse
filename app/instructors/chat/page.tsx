"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/socket";
import {
  formatRelativeTime,
  formatMessageDate,
  formatTimeOnly,
  canEditOrDelete,
  playNotificationSound,
  isImageFile,
  formatFileSize,
} from "@/lib/chat-utils";
import {
  MoreHorizontal,
  Paperclip,
  Send,
  Search,
  MessageCircle,
  UserPlus,
  ArrowLeft,
  Loader2,
  X,
  Edit2,
  Trash2,
  Check,
  CheckCheck,
  Image as ImageIcon,
  File,
} from "lucide-react";

interface Instructor {
  id: string;
  name: string;
  email: string;
  bidangKeahlian?: string;
  hasConversation?: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    email: string;
    bidangKeahlian?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  sender: {
    id: string;
    name: string;
  };
}

const ChatPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth");
    },
  });

  const { 
    socket, 
    isConnected, 
    onlineUsers, 
    typingUsers, 
    lastSeenMap,
    joinConversation, 
    leaveConversation,
    startTyping,
    stopTyping,
    updateLastSeen 
  } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileCaption, setFileCaption] = useState("");
  
  const messagesRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const searchParams = useSearchParams();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch instructors for new chat
  const fetchInstructors = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/instructors");
      if (res.ok) {
        const data = await res.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchConversations();
    fetchInstructors();
  }, [fetchConversations, fetchInstructors]);

  // Handle URL param for instructor
  useEffect(() => {
    const instructorId = searchParams.get("instructorId");
    if (instructorId && conversations.length > 0) {
      const existingConv = conversations.find(
        (c) => c.participant.id === instructorId
      );
      if (existingConv) {
        setSelectedConversationId(existingConv.id);
      }
    }
  }, [searchParams, conversations]);

  // Join/leave conversation rooms
  useEffect(() => {
    if (selectedConversationId) {
      joinConversation(selectedConversationId);
      fetchMessages(selectedConversationId);
      return () => {
        leaveConversation(selectedConversationId);
      };
    }
  }, [selectedConversationId, joinConversation, leaveConversation, fetchMessages]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      if (data.conversationId === selectedConversationId) {
        // Add message to current chat
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId,
            senderId: data.senderId,
            content: data.content,
            createdAt: data.createdAt,
            isRead: false,
            isEdited: false,
            isDeleted: false,
            attachmentUrl: data.attachmentUrl,
            attachmentType: data.attachmentType,
            sender: {
              id: data.senderId,
              name: data.senderName,
            },
          },
        ]);

        // Play notification sound if message from someone else
        if (data.senderId !== session?.user?.id) {
          playNotificationSound();
        }
      }
      
      // Update conversation list
      fetchConversations();
    };

    const handleMessageEdited = (data: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, content: data.newContent, isEdited: true, editedAt: data.editedAt }
            : msg
        )
      );
    };

    const handleMessageDeleted = (data: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, content: "Pesan telah dihapus", isDeleted: true, deletedAt: data.deletedAt }
            : msg
        )
      );
    };

    const handleMessageReadUpdate = (data: any) => {
      if (data.userId !== session?.user?.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            data.messageIds.includes(msg.id) ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
          )
        );
      }
    };

    socket.on("message:receive", handleNewMessage);
    socket.on("message:edited", handleMessageEdited);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("message:read:update", handleMessageReadUpdate);

    return () => {
      socket.off("message:receive", handleNewMessage);
      socket.off("message:edited", handleMessageEdited);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("message:read:update", handleMessageReadUpdate);
    };
  }, [socket, selectedConversationId, fetchConversations, session?.user?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto mark messages as read when visible
  useEffect(() => {
    if (!selectedConversationId || !session?.user?.id) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const unreadMessageIds = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.getAttribute("data-message-id"))
          .filter((id): id is string => {
            if (!id) return false;
            const message = messages.find((m) => m.id === id);
            return message ? !message.isRead && message.senderId !== session.user!.id : false;
          });

        if (unreadMessageIds.length > 0) {
          // Mark as read in database
          fetch("/api/chat/messages/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messageIds: unreadMessageIds }),
          }).catch(console.error);

          // Emit socket event
          socket?.emit("message:read", {
            conversationId: selectedConversationId,
            userId: session.user!.id,
            messageIds: unreadMessageIds,
          });

          // Update local state
          setMessages((prev) =>
            prev.map((msg) =>
              unreadMessageIds.includes(msg.id)
                ? { ...msg, isRead: true, readAt: new Date().toISOString() }
                : msg
            )
          );
        }
      },
      { threshold: 0.5 }
    );

    // Observe all message elements
    messageRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [messages, selectedConversationId, session?.user?.id, socket]);

  // Get selected conversation details
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    return conversations.filter((conv) =>
      conv.participant.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  // Check if participant is online
  const isParticipantOnline = useCallback(
    (participantId: string) => onlineUsers.has(participantId),
    [onlineUsers]
  );

  // Get typing indicator for current conversation
  const currentTypingUsers = useMemo(() => {
    if (!selectedConversationId) return [];
    return typingUsers.get(selectedConversationId) || [];
  }, [selectedConversationId, typingUsers]);

  // Handle typing
  const handleTyping = useCallback(() => {
    if (!selectedConversationId) return;
    
    startTyping(selectedConversationId);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedConversationId);
    }, 2000);
  }, [selectedConversationId, startTyping, stopTyping]);

  // File upload handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 10MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Set file and show preview
    setSelectedFile(file);
    setFilePreviewUrl(URL.createObjectURL(file));
    setFileCaption(messageDraft); // Use current draft as initial caption
    setShowFilePreview(true);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send file after preview confirmation
  const handleSendFile = async () => {
    if (!selectedFile || !selectedConversation || !session?.user) return;

    setUploadingFile(true);
    setShowFilePreview(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { url } = await uploadRes.json();

      // Send message with attachment
      const res = await fetch(
        `/api/chat/conversations/${selectedConversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: fileCaption.trim(),
            attachmentUrl: url,
            attachmentType: isImageFile(selectedFile.name) ? "image" : "file",
          }),
        }
      );

      if (res.ok) {
        const newMessage = await res.json();

        socket?.emit("message:send", {
          conversationId: selectedConversationId,
          senderId: session.user.id,
          recipientId: selectedConversation.participant.id,
          content: newMessage.content,
          messageId: newMessage.id,
          senderName: session.user.name,
          createdAt: newMessage.createdAt,
          attachmentUrl: url,
          attachmentType: newMessage.attachmentType,
        });

        setFileCaption("");
        setSelectedFile(null);
        setFilePreviewUrl(null);
        fetchConversations();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Gagal mengupload file");
    } finally {
      setUploadingFile(false);
    }
  };

  // Cancel file preview
  const handleCancelFilePreview = () => {
    setShowFilePreview(false);
    setSelectedFile(null);
    setFileCaption("");
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  // Edit message handler
  const handleEditMessage = async (messageId: string) => {
    if (!editingContent.trim()) return;

    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent.trim() }),
      });

      if (res.ok) {
        const updatedMessage = await res.json();

        socket?.emit("message:edit", {
          messageId,
          conversationId: selectedConversationId,
          newContent: updatedMessage.content,
          editedAt: updatedMessage.editedAt,
        });

        setEditingMessageId(null);
        setEditingContent("");
      } else {
        const error = await res.json();
        alert(error.error || "Gagal mengedit pesan");
      }
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Gagal mengedit pesan");
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Hapus pesan ini?")) return;

    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const deletedMessage = await res.json();

        socket?.emit("message:delete", {
          messageId,
          conversationId: selectedConversationId,
          deletedAt: deletedMessage.deletedAt,
        });
      } else {
        const error = await res.json();
        alert(error.error || "Gagal menghapus pesan");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Gagal menghapus pesan");
    }
  };

  // Send message
  const handleSendMessage = async () => {
    const content = messageDraft.trim();
    if (!content || !selectedConversation || !session?.user) return;

    // Stop typing indicator
    if (selectedConversationId) {
      stopTyping(selectedConversationId);
    }

    try {
      const res = await fetch(
        `/api/chat/conversations/${selectedConversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (res.ok) {
        const newMessage = await res.json();
        
        // Emit via socket for real-time
        socket?.emit("message:send", {
          conversationId: selectedConversationId,
          senderId: session.user.id,
          recipientId: selectedConversation.participant.id,
          content,
          messageId: newMessage.id,
          senderName: session.user.name,
          createdAt: newMessage.createdAt,
        });

        // Don't add to local state here - let socket event handle it
        // This prevents duplicate messages on sender side
        setMessageDraft("");
        fetchConversations();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Start new conversation with instructor
  const startConversation = async (instructorId: string) => {
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructorId }),
      });

      if (res.ok) {
        const conv = await res.json();
        await fetchConversations();
        setSelectedConversationId(conv.id);
        setShowNewChatModal(false);
        setIsMobileViewingChat(true);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                  Chat Instruktur
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Berkonsultasi langsung dengan instruktur pilihan Anda
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Terhubung
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-slate-400 rounded-full" />
                    Menghubungkan...
                  </span>
                )}
              </div>
            </div>

            {/* Chat Container */}
            <div className="rounded-2xl border bg-white shadow-lg overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
              {/* Sidebar - Conversation List */}
              <div
                className={`${
                  isMobileViewingChat ? "hidden" : "flex"
                } lg:flex flex-col w-full lg:w-80 xl:w-96 border-r border-slate-200`}
              >
                {/* Search & New Chat */}
                <div className="p-4 border-b border-slate-100 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cari percakapan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={() => setShowNewChatModal(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Chat Baru
                  </Button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <MessageCircle className="h-12 w-12 text-slate-300 mb-3" />
                      <p className="text-slate-500 text-sm">
                        Belum ada percakapan
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Mulai chat dengan instruktur
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setSelectedConversationId(conv.id);
                          setIsMobileViewingChat(true);
                        }}
                        className={`w-full flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
                          selectedConversationId === conv.id
                            ? "bg-emerald-50 border-l-4 border-l-emerald-500"
                            : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.participant.name}`}
                              alt={conv.participant.name || ""}
                            />
                            <AvatarFallback>
                              {conv.participant.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {isParticipantOnline(conv.participant.id) && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-800 truncate">
                              {conv.participant.name}
                            </p>
                            {conv.lastMessage && (
                              <span className="text-xs text-slate-400">
                                {formatRelativeTime(conv.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {conv.participant.bidangKeahlian || "Instruktur"}
                          </p>
                          {conv.lastMessage && (
                            <p className="text-sm text-slate-600 truncate mt-1">
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div
                className={`${
                  isMobileViewingChat ? "flex" : "hidden"
                } lg:flex flex-col flex-1`}
              >
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-white">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsMobileViewingChat(false)}
                          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.participant.name}`}
                              alt={selectedConversation.participant.name || ""}
                            />
                            <AvatarFallback>
                              {selectedConversation.participant.name
                                ?.slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {isParticipantOnline(selectedConversation.participant.id) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {selectedConversation.participant.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {isParticipantOnline(selectedConversation.participant.id) ? (
                              "Online"
                            ) : (
                              lastSeenMap.get(selectedConversation.participant.id) ? (
                                `Terakhir dilihat ${formatRelativeTime(lastSeenMap.get(selectedConversation.participant.id)!)}`
                              ) : (
                                "Offline"
                              )
                            )}
                            {currentTypingUsers.length > 0 && (
                              <span className="text-emerald-500 ml-1">
                                • Sedang mengetik...
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5 text-slate-500" />
                      </Button>
                    </div>

                    {/* Messages Area */}
                    <div
                      ref={messagesRef}
                      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white"
                    >
                      {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                          <MessageCircle className="h-12 w-12 text-slate-300 mb-3" />
                          <p className="text-slate-500">Belum ada pesan</p>
                          <p className="text-slate-400 text-sm mt-1">
                            Mulai percakapan dengan mengirim pesan
                          </p>
                        </div>
                      ) : (
                        <>
                          {messages.map((message, index) => {
                            const isCurrentUser = message.senderId === session?.user?.id;
                            const showDate =
                              index === 0 ||
                              new Date(message.createdAt).toDateString() !==
                                new Date(messages[index - 1].createdAt).toDateString();

                            return (
                              <React.Fragment key={message.id}>
                                {showDate && (
                                  <div className="flex items-center justify-center my-4">
                                    <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                                      {formatMessageDate(message.createdAt)}
                                    </span>
                                  </div>
                                )}
                                <div
                                  ref={(el) => {
                                    if (el) {
                                      messageRefs.current.set(message.id, el);
                                    } else {
                                      messageRefs.current.delete(message.id);
                                    }
                                  }}
                                  data-message-id={message.id}
                                  className={`flex ${
                                    isCurrentUser ? "justify-end" : "justify-start"
                                  } group`}
                                >
                                  <div className="flex items-end gap-2">
                                    {isCurrentUser && canEditOrDelete(message.createdAt) && !message.isDeleted && (
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7 text-slate-400 hover:text-emerald-600"
                                          onClick={() => {
                                            setEditingMessageId(message.id);
                                            setEditingContent(message.content);
                                          }}
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7 text-slate-400 hover:text-red-600"
                                          onClick={() => handleDeleteMessage(message.id)}
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    )}
                                    
                                    <div
                                      className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-3 ${
                                        isCurrentUser
                                          ? message.isDeleted
                                            ? "bg-slate-300 text-slate-600 italic"
                                            : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                                          : message.isDeleted
                                          ? "bg-slate-100 border border-slate-200 text-slate-500 italic"
                                          : "bg-white border border-slate-200 text-slate-800"
                                      }`}
                                    >
                                      {editingMessageId === message.id ? (
                                        <div className="space-y-2">
                                          <Textarea
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            className="text-sm bg-white/10 border-white/20"
                                            rows={2}
                                          />
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              onClick={() => handleEditMessage(message.id)}
                                              className="h-7 text-xs"
                                            >
                                              Simpan
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                setEditingMessageId(null);
                                                setEditingContent("");
                                              }}
                                              className="h-7 text-xs"
                                            >
                                              Batal
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          {message.attachmentUrl && (
                                            <div className="mb-2">
                                              {message.attachmentType === "image" ? (
                                                <img
                                                  src={message.attachmentUrl}
                                                  alt="Attachment"
                                                  className="rounded-lg max-w-full max-h-64 object-cover"
                                                />
                                              ) : (
                                                <a
                                                  href={message.attachmentUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-2 p-2 bg-white/10 rounded-lg hover:bg-white/20"
                                                >
                                                  <File className="h-4 w-4" />
                                                  <span className="text-sm">File attachment</span>
                                                </a>
                                              )}
                                            </div>
                                          )}
                                          {message.content && (
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                              {message.content}
                                            </p>
                                          )}
                                          <div className="flex items-center gap-2 mt-1">
                                            <p
                                              className={`text-[11px] ${
                                                isCurrentUser
                                                  ? "text-white/70"
                                                  : "text-slate-400"
                                              }`}
                                            >
                                              {formatTimeOnly(message.createdAt)}
                                              {message.isEdited && " (diedit)"}
                                            </p>
                                            {isCurrentUser && (
                                              <span className="text-white/70">
                                                {message.isRead ? (
                                                  <CheckCheck className="h-3.5 w-3.5" />
                                                ) : (
                                                  <Check className="h-3.5 w-3.5" />
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                          {currentTypingUsers.length > 0 && (
                            <div className="flex justify-start">
                              <div className="bg-slate-100 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                  <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  />
                                  <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-slate-200 p-4 bg-white">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                      />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                        className="flex items-end gap-2"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-slate-400 hover:text-slate-600"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                          {uploadingFile ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Paperclip className="h-5 w-5" />
                          )}
                        </Button>
                        <Textarea
                          placeholder="Tulis pesan..."
                          value={messageDraft}
                          onChange={(e) => {
                            setMessageDraft(e.target.value);
                            handleTyping();
                          }}
                          onKeyDown={handleKeyDown}
                          className="flex-1 min-h-[44px] max-h-32 resize-none rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                          rows={1}
                        />
                        <Button
                          type="submit"
                          disabled={!messageDraft.trim()}
                          className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 px-4"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">
                      Pilih Percakapan
                    </h2>
                    <p className="text-slate-500 text-sm max-w-sm">
                      Pilih percakapan di sebelah kiri atau mulai chat baru dengan
                      instruktur
                    </p>
                    <Button
                      onClick={() => setShowNewChatModal(true)}
                      className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Mulai Chat Baru
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* File Preview Modal */}
      {showFilePreview && selectedFile && filePreviewUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Preview File
              </h3>
              <button
                onClick={handleCancelFilePreview}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={uploadingFile}
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {isImageFile(selectedFile.name) ? (
                <img
                  src={filePreviewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
                  <File className="h-16 w-16 text-slate-400 mb-4" />
                  <p className="text-slate-700 font-medium">{selectedFile.name}</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200">
              <Textarea
                placeholder="Tambahkan caption (opsional)..."
                value={fileCaption}
                onChange={(e) => setFileCaption(e.target.value)}
                className="mb-3 rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                rows={2}
                disabled={uploadingFile}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSendFile}
                  disabled={uploadingFile}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelFilePreview}
                  disabled={uploadingFile}
                  variant="outline"
                  className="rounded-xl"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  Pilih Instruktur
                </h3>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              {instructors.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  Tidak ada instruktur tersedia
                </div>
              ) : (
                instructors.map((instructor) => (
                  <button
                    key={instructor.id}
                    onClick={() => startConversation(instructor.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`}
                          alt={instructor.name || ""}
                        />
                        <AvatarFallback>
                          {instructor.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isParticipantOnline(instructor.id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-800">
                        {instructor.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {instructor.bidangKeahlian || "Instruktur"}
                      </p>
                    </div>
                    {instructor.hasConversation && (
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Sudah chat
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ChatPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <ChatPage />
    </Suspense>
  );
}
