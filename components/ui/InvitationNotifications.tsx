"use client";

import { useEffect, useState } from "react";
import { Check, X, Bell, BookOpen, Calendar, Sparkles } from "lucide-react";
import { useSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

interface Material {
  id: string;
  title: string;
  date: string;
  instructorId: string;
}
interface Instructor {
  id: string;
  name: string;
  email: string;
}
interface Invitation {
  id: string;
  token: string;
  materialId: string;
  material: Material;
  instructor: Instructor;
  status: string;
  createdAt: string;
}

export default function InvitationNotifications() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const { socket } = useSocket();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only start polling if session is authenticated
    if (status !== "authenticated") {
      console.log("[InviteNotif] Session not authenticated, waiting...");
      return;
    }

    console.log(
      "[InviteNotif] Session authenticated, fetching initial invitations",
    );
    fetchInvitations();

    // Reduced polling interval to 30 seconds (only as fallback)
    // Main updates should come from socket events
    const interval = setInterval(fetchInvitations, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  // Separate effect for socket listener
  useEffect(() => {
    if (!socket) return;

    console.log("[InviteNotif] Setting up socket listener");
    socket.on("invitation:new", (data: any) => {
      console.log("[InviteNotif] Received new invitation via socket:", data);
      fetchInvitations();
    });

    return () => {
      socket.off("invitation:new");
    };
  }, [socket]);

  const fetchInvitations = async () => {
    // Skip if session not loaded yet
    if (status === "loading") {
      console.log("[InviteNotif] Session still loading, skipping fetch");
      return;
    }

    if (status === "unauthenticated") {
      console.log("[InviteNotif] Not authenticated, skipping fetch");
      return;
    }

    try {
      console.log("[InviteNotif] Starting fetch...");
      const res = await fetch("/api/materials/invitations");
      console.log("[InviteNotif] Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log(
          "[InviteNotif] Success! Got",
          data.invitations?.length || 0,
          "invitations",
        );
        console.log("[InviteNotif] Data:", data);
        setInvitations(data.invitations);

        if (typeof window !== "undefined") {
          (window as any).invitationCount = data.invitations.length;
          console.log(
            "[InviteNotif] Updating count to:",
            data.invitations.length,
          );
          window.dispatchEvent(new Event("invitationCountUpdate"));
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error(
          "[InviteNotif] API error - Status:",
          res.status,
          "Error:",
          errorData,
        );
        if (res.status !== 401) {
          setInvitations([]);
        }
      }
    } catch (error) {
      console.error("[InviteNotif] Fetch error:", error);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (
    token: string,
    status: "accepted" | "rejected",
  ) => {
    setResponding(token);
    try {
      const res = await fetch("/api/materials/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status }),
      });
      if (res.ok) {
        setInvitations(invitations.filter((inv) => inv.token !== token));
      }
    } catch (error) {
      console.error("Error responding:", error);
    } finally {
      setResponding(null);
    }
  };

  if (loading || invitations.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 space-y-4 max-w-[380px] z-[100]">
      {invitations.map((invitation) => (
        <div
          key={invitation.token}
          // UBAH DISINI: Border & Shadow jadi Hijau Gelap (Emerald-900/950)
          className="group bg-white rounded-[24px] border-[3px] border-emerald-900 shadow-[8px_8px_0px_0px_#064e3b] p-5 animate-bounce-in overflow-hidden relative"
        >
          {/* Decorative Sparkle (Hijau Muda) */}
          <Sparkles className="absolute -top-1 -right-1 h-12 w-12 text-emerald-100 opacity-50 rotate-12" />

          <div className="relative z-10">
            {/* Header Area */}
            <div className="flex items-center gap-3 mb-4">
              {/* Icon Lonceng (Hijau) */}
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center rotate-[-6deg] group-hover:rotate-0 transition-transform duration-300">
                <Bell className="h-6 w-6 text-emerald-600 animate-ring" />
              </div>
              <div>
                {/* Badge (Hijau) */}
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Undangan Baru
                </span>
                <h3 className="font-black text-emerald-950 text-base leading-tight mt-1">
                  Undangan Kajian
                </h3>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-emerald-50/50 rounded-2xl p-4 border-2 border-emerald-100 mb-5 group-hover:bg-white group-hover:border-emerald-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 bg-white rounded-lg border border-emerald-100">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-slate-700 text-sm font-bold leading-relaxed">
                  {invitation.instructor.name}{" "}
                  <span className="font-medium text-slate-500 italic">
                    mengajak anda ke
                  </span>{" "}
                  {invitation.material.title}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-emerald-100">
                  <Calendar className="h-3 w-3 text-emerald-500" />
                  {new Date(invitation.material.date).toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "short" },
                  )}
                </div>
              </div>
            </div>

            {/* Actions Area - 3D Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Tombol Terima (Hijau Kuat) */}
              <button
                onClick={() => handleResponse(invitation.token, "accepted")}
                disabled={responding === invitation.token}
                className="relative flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm border-b-[6px] border-emerald-800 active:border-b-0 active:translate-y-[4px] hover:bg-emerald-400 transition-all disabled:opacity-50 group/btn"
              >
                <Check className="h-5 w-5 group-hover/btn:scale-125 transition-transform" />
                Terima
              </button>

              {/* Tombol Nanti (Putih dengan Border Hijau Tipis) */}
              <button
                onClick={() => handleResponse(invitation.token, "rejected")}
                disabled={responding === invitation.token}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-slate-400 font-black text-sm border-2 border-slate-200 border-b-[6px] active:border-b-2 active:translate-y-[2px] hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                <X className="h-5 w-5" />
                Nanti
              </button>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes ring {
          0% {
            transform: rotate(0);
          }
          10% {
            transform: rotate(15deg);
          }
          20% {
            transform: rotate(-15deg);
          }
          30% {
            transform: rotate(10deg);
          }
          40% {
            transform: rotate(-10deg);
          }
          100% {
            transform: rotate(0);
          }
        }
        .animate-ring {
          animation: ring 1.5s ease-in-out infinite;
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
          }
          60% {
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
