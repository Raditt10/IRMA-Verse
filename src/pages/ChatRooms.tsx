import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ChatRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchRooms();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select(`
          *,
          materi_kajian(title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data || []);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Ruang Diskusi
            </h1>
          </div>
          <p className="text-muted-foreground">
            Diskusikan materi kajian dengan member lainnya
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat ruang diskusi...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada ruang diskusi</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        {room.name}
                      </CardTitle>
                      {room.materi_kajian && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Materi: {room.materi_kajian.title}
                        </p>
                      )}
                      {room.description && (
                        <CardDescription className="mt-2">
                          {room.description}
                        </CardDescription>
                      )}
                    </div>
                    <Link to={`/chat/${room.id}`}>
                      <Button>
                        <Users className="mr-2 h-4 w-4" />
                        Join
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRooms;
