import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { ScheduleForm } from "@/components/admin/ScheduleForm";
import { MaterialForm } from "@/components/admin/MaterialForm";
import { AchievementForm } from "@/components/admin/AchievementForm";

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (error || !roles) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses admin",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    const [announcementsData, schedulesData, materialsData, achievementsData] = await Promise.all([
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("jadwal_kajian").select("*").order("date", { ascending: false }),
      supabase.from("materi_kajian").select("*").order("date", { ascending: false }),
      supabase.from("prestasi").select("*").order("date", { ascending: false }),
    ]);

    if (announcementsData.data) setAnnouncements(announcementsData.data);
    if (schedulesData.data) setSchedules(schedulesData.data);
    if (materialsData.data) setMaterials(materialsData.data);
    if (achievementsData.data) setAchievements(achievementsData.data);
  };

  const handleDelete = async (table: "announcements" | "jadwal_kajian" | "materi_kajian" | "prestasi", id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Berhasil dihapus" });
      fetchAllData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground">
            Kelola semua aspek IRMAVerse
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link to="/quiz-builder">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Quiz Baru
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline">
              Export Laporan
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="announcements">Pengumuman</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal</TabsTrigger>
            <TabsTrigger value="materials">Materi</TabsTrigger>
            <TabsTrigger value="achievements">Prestasi</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <div className="space-y-4">
              <Button onClick={() => { setShowForm("announcement"); setEditingItem(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengumuman
              </Button>
              
              {showForm === "announcement" && (
                <AnnouncementForm
                  announcement={editingItem}
                  onSuccess={() => {
                    setShowForm(null);
                    setEditingItem(null);
                    fetchAllData();
                  }}
                />
              )}

              <div className="grid gap-4">
                {announcements.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setEditingItem(item); setShowForm("announcement"); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete("announcements", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-4">
              <Button onClick={() => { setShowForm("schedule"); setEditingItem(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Jadwal
              </Button>
              
              {showForm === "schedule" && (
                <ScheduleForm
                  schedule={editingItem}
                  onSuccess={() => {
                    setShowForm(null);
                    setEditingItem(null);
                    fetchAllData();
                  }}
                />
              )}

              <div className="grid gap-4">
                {schedules.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>
                            {new Date(item.date).toLocaleDateString("id-ID")} - {item.pemateri}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setEditingItem(item); setShowForm("schedule"); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete("jadwal_kajian", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="space-y-4">
              <Button onClick={() => { setShowForm("material"); setEditingItem(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Materi
              </Button>
              
              {showForm === "material" && (
                <MaterialForm
                  material={editingItem}
                  onSuccess={() => {
                    setShowForm(null);
                    setEditingItem(null);
                    fetchAllData();
                  }}
                />
              )}

              <div className="grid gap-4">
                {materials.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.summary}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setEditingItem(item); setShowForm("material"); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete("materi_kajian", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-4">
              <Button onClick={() => { setShowForm("achievement"); setEditingItem(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Prestasi
              </Button>
              
              {showForm === "achievement" && (
                <AchievementForm
                  achievement={editingItem}
                  onSuccess={() => {
                    setShowForm(null);
                    setEditingItem(null);
                    fetchAllData();
                  }}
                />
              )}

              <div className="grid gap-4">
                {achievements.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setEditingItem(item); setShowForm("achievement"); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete("prestasi", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
