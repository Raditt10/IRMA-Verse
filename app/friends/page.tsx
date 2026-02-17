"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic";

interface Friends {
  id: string;
  name: string;
  role: string;
  avatar: string;
  class: string;
  status: string;
}

function FriendsContent() {
  const [friends, setFriends] = useState<Friends[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchFriendRequests = async () => {
    try {
      const res = await fetch("/api/friends/request");
      if (!res.ok) throw new Error("Gagal mengambil request pertemanan");
      const data = await res.json();

      setFriends(data);
    } catch (error) {
      console.error("Error fetching friend requests: ", error);
    }
  };

  const { data: session } = useSession({
    required: false,
    onUnauthenticated() {
      window.location.href = "/auth";
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">Halaman pertemanan dalam pengembangan</p>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      }
    >
      <FriendsContent />
    </Suspense>
  );
}
