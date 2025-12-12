import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { ScheduleForm } from "@/components/admin/ScheduleForm";
import { MaterialForm } from "@/components/admin/MaterialForm";
import { AchievementForm } from "@/components/admin/AchievementForm";

const PemateriDashboard = () => {
  const [isPemateri, setIsPemateri] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkPemateriAccess();
  }, []);

  const checkPemateriAccess = async () => {
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
        .in("role", ["admin", "pemateri"]);

      if (error || !roles || roles.length === 0) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses pemateri",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsPemateri(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!isPemateri) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard Pemateri
          </h1>
          <p className="text-muted-foreground">
            Kelola konten kajian dan informasi
          </p>
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
              <Button onClick={() => setShowForm("announcement")}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengumuman
              </Button>
              
              {showForm === "announcement" && (
                <AnnouncementForm
                  onSuccess={() => {
                    setShowForm(null);
                    toast({ title: "Pengumuman berhasil ditambahkan" });
                  }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-4">
              <Button onClick={() => setShowForm("schedule")}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Jadwal
              </Button>
              
              {showForm === "schedule" && (
                <ScheduleForm
                  onSuccess={() => {
                    setShowForm(null);
                    toast({ title: "Jadwal berhasil ditambahkan" });
                  }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="space-y-4">
              <Button onClick={() => setShowForm("material")}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Materi
              </Button>
              
              {showForm === "material" && (
                <MaterialForm
                  onSuccess={() => {
                    setShowForm(null);
                    toast({ title: "Materi berhasil ditambahkan" });
                  }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-4">
              <Button onClick={() => setShowForm("achievement")}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Prestasi
              </Button>
              
              {showForm === "achievement" && (
                <AchievementForm
                  onSuccess={() => {
                    setShowForm(null);
                    toast({ title: "Prestasi berhasil ditambahkan" });
                  }}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PemateriDashboard;
