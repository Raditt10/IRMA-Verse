"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type MaterialDetail = {
  id: string;
  title: string;
  description: string;
  category: string;
  grade: string;
  date: string;
  startedAt?: string;
  instructor: {
    name: string;
    email: string;
  };
  isJoined: boolean;
};

export default function MaterialDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`/api/materials/${id}`);
      if (!res.ok) return setLoading(false);
      setMaterial(await res.json());
      setLoading(false);
    };
    fetchDetail();
  }, [id]);
  const { data: session } = useSession({
    required: false,
    onUnauthenticated() {
      window.location.href = "/auth";
    }
    });

  if (loading) return <p className="p-6">Loading...</p>;
  if (!material) return <p className="p-6">Materi tidak ditemukan</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{material.title}</h1>
      <p className="text-muted-foreground">{material.description}</p>

      <div className="text-sm space-y-1">
        <p><b>Kategori:</b> {material.category}</p>
        <p><b>Kelas:</b> {material.grade}</p>
        <p><b>Tanggal:</b> {new Date(material.date).toLocaleDateString("id-ID")}</p>
        {material.startedAt && <p><b>Jam:</b> {material.startedAt}</p>}
        <p><b>Pemateri:</b> {material.instructor.name}, Email: {material.instructor.email}</p>
      </div>

      <div className="flex gap-3 pt-4">
        {material.isJoined ? (
          <button
            onClick={() => router.push(`/rekapan/${material.id}`)}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Lihat Rekapan
          </button>
        ) : (
          <button
            onClick={() => router.push("/absensi")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Ikut Kajian
          </button>
        )}

        {(session?.user?.role === "admin" || session?.user?.role === "instruktur") && (
          <button
            onClick={() => router.push(`/materials/${material.id}/invite`)}
            className="px-4 py-2 border rounded-lg"
          >
            Invite Peserta
          </button>
        )}
      </div>
    </div>
  );
}
