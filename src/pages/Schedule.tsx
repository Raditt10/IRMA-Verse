import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  pemateri: string | null;
}

const Schedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchSchedules();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("jadwal_kajian")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 relative overflow-hidden p-8 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-purple-500/15 border-2 border-purple-500/30 rounded-full backdrop-blur-md shadow-lg">
              <Calendar className="h-4 w-4 text-purple-500 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider">Kegiatan Mendatang</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Jadwal Kajian
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light">
              Jadwal kegiatan kajian IRMA Al-Hikmah ✨
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Memuat jadwal...</p>
            </div>
          </div>
        ) : schedules.length === 0 ? (
          <Card className="border-2 border-dashed border-border/50 bg-muted/20">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">Belum ada jadwal kajian</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const isUpcoming = new Date(schedule.date) > new Date();
              return (
                <Card 
                  key={schedule.id} 
                  className="group border-2 border-transparent hover:border-purple-500/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-card backdrop-blur-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          {isUpcoming && (
                            <Badge className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                              Mendatang
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {schedule.title}
                        </CardTitle>
                        {schedule.description && (
                          <CardDescription className="text-base leading-relaxed">
                            {schedule.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {new Date(schedule.date).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {schedule.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{schedule.location}</span>
                        </div>
                      )}
                      {schedule.pemateri && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{schedule.pemateri}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
