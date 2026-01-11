"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Check, ArrowLeft } from "lucide-react";

interface Student {
  id: string;
  name: string;
  kelas: string;
}

const mockStudents: Student[] = [
  { id: "s1", name: "Ahmad Fauzi", kelas: "10" },
  { id: "s2", name: "Siti Nurhaliza", kelas: "11" },
  { id: "s3", name: "Muhammad Ikhsan", kelas: "12" },
  { id: "s4", name: "Fatimah Azzahra", kelas: "10" },
  { id: "s5", name: "Rizki Ramadhan", kelas: "11" },
  { id: "s6", name: "Aisyah Putri", kelas: "12" },
];

const InvitePage = () => {
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setUser({
      id: "instructor-1",
      full_name: "Ustadz Ahmad Zaki",
      email: "ahmad.zaki@irmaverse.local",
      avatar: "AZ",
      role: "instructor",
    });
  }, []);

  const filtered = useMemo(() => {
    const key = search.toLowerCase();
    return mockStudents.filter(
      (s) => s.name.toLowerCase().includes(key) || s.kelas.includes(search)
    );
  }, [search]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSave = () => {
    setStatus(`Undangan tersimpan untuk ${selected.length} murid.`);
    setTimeout(() => setStatus(null), 2500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              {status && (
                <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg">
                  {status}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Users className="h-4 w-4" />
                Undang Murid ke Kajian
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 mb-1">Kelola Undangan Murid</h1>
                <p className="text-slate-600">Pilih murid yang akan diundang ke kajian ini.</p>
              </div>
            </div>

            <Card className="p-5 border-slate-200">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Total dipilih: <span className="font-bold text-emerald-700">{selected.length}</span>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari murid atau kelas"
                    className="pl-9"
                  />
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((s) => {
                const active = selected.includes(s.id);
                return (
                  <Card
                    key={s.id}
                    className={`border transition-all duration-150 ${
                      active ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500">Kelas {s.kelas}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(s.id)}
                        className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors ${
                          active
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {active ? <Check className="h-4 w-4" /> : "+"}
                      </button>
                    </div>
                  </Card>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-slate-500 py-12">
                  Tidak ada murid yang cocok.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
                onClick={handleSave}
              >
                Simpan Undangan
              </Button>
              <Button variant="outline" onClick={() => setSelected([])}>
                Reset
              </Button>
            </div>
          </div>
        </main>
      </div>

      <ChatbotButton />
    </div>
  );
};

export default InvitePage;
