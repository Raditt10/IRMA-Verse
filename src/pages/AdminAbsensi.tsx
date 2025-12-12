import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, QrCode, Hash, Users, Calendar, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { CardSkeleton } from "@/components/LoadingSkeletons";
import QRCode from "qrcode";

interface JadwalKajian {
  id: string;
  title: string;
  date: string;
  location: string;
  pemateri: string;
}

interface AbsensiSettings {
  id: string;
  jadwal_id: string;
  pin: string;
  qr_code: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

interface AbsensiRecord {
  id: string;
  user_id: string;
  jadwal_id: string;
  status: string;
  waktu_absen: string;
  metode: string;
  profiles?: {
    full_name: string;
  } | null;
}

const AdminAbsensi = () => {
  const [jadwal, setJadwal] = useState<JadwalKajian[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<string>("");
  const [activeSettings, setActiveSettings] = useState<AbsensiSettings | null>(null);
  const [absensiRecords, setAbsensiRecords] = useState<AbsensiRecord[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchJadwal();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedJadwal) {
      fetchActiveSettings();
      fetchAbsensiRecords();
      subscribeToAbsensi();
    }

    return () => {
      supabase.removeAllChannels();
    };
  }, [selectedJadwal]);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["admin", "pemateri"])
        .single();

      if (!data) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses ke halaman ini",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    }
  };

  const fetchJadwal = async () => {
    try {
      const { data, error } = await supabase
        .from("jadwal_kajian")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true });

      if (error) throw error;
      setJadwal(data || []);
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

  const fetchActiveSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("absensi_settings")
        .select("*")
        .eq("jadwal_id", selectedJadwal)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setActiveSettings(data);
        // Generate QR code if exists
        if (data.qr_code) {
          const url = await QRCode.toDataURL(data.qr_code);
          setQrCodeUrl(url);
        }
      } else {
        setActiveSettings(null);
        setQrCodeUrl("");
      }
    } catch (error: any) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchAbsensiRecords = async () => {
    try {
      // First get absensi records
      const { data: absensiData, error: absensiError } = await supabase
        .from("absensi")
        .select("*")
        .eq("jadwal_id", selectedJadwal)
        .order("waktu_absen", { ascending: false });

      if (absensiError) throw absensiError;

      if (!absensiData || absensiData.length === 0) {
        setAbsensiRecords([]);
        return;
      }

      // Then get user profiles
      const userIds = absensiData.map(a => a.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const records = absensiData.map(a => ({
        ...a,
        profiles: profilesMap.get(a.user_id) || null
      }));

      setAbsensiRecords(records as AbsensiRecord[]);
    } catch (error: any) {
      console.error("Error fetching absensi records:", error);
    }
  };

  const subscribeToAbsensi = () => {
    const channel = supabase
      .channel('absensi-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'absensi',
          filter: `jadwal_id=eq.${selectedJadwal}`
        },
        (payload) => {
          console.log('Absensi update:', payload);
          fetchAbsensiRecords();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Absensi Baru! 🎉",
              description: "Peserta baru melakukan absensi",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateNewSession = async () => {
    if (!selectedJadwal) {
      toast({
        title: "Error",
        description: "Pilih jadwal terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      // Deactivate old sessions
      await supabase
        .from("absensi_settings")
        .update({ is_active: false })
        .eq("jadwal_id", selectedJadwal);

      // Generate new PIN and QR
      const newPin = generatePin();
      const qrData = JSON.stringify({ 
        jadwal_id: selectedJadwal, 
        pin: newPin,
        timestamp: Date.now() 
      });

      const { error } = await supabase
        .from("absensi_settings")
        .insert({
          jadwal_id: selectedJadwal,
          pin: newPin,
          qr_code: qrData,
          is_active: true,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        });

      if (error) throw error;

      toast({
        title: "Sesi Baru Dibuat! ✅",
        description: `PIN: ${newPin} (berlaku 1 jam)`,
      });

      await fetchActiveSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deactivateSession = async () => {
    if (!activeSettings) return;

    try {
      const { error } = await supabase
        .from("absensi_settings")
        .update({ is_active: false })
        .eq("id", activeSettings.id);

      if (error) throw error;

      toast({
        title: "Sesi Dinonaktifkan",
        description: "Absensi ditutup untuk sesi ini",
      });

      setActiveSettings(null);
      setQrCodeUrl("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4 p-4 bg-gradient-card rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Admin Absensi Panel
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Kelola PIN, QR Code, dan monitor kehadiran real-time
          </p>
        </div>

        {/* Jadwal Selection */}
        <Card className="mb-6 bg-gradient-card backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Pilih Jadwal Kajian
            </CardTitle>
            <CardDescription>Pilih kajian untuk mengelola absensi</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-3 border-2 rounded-xl bg-background hover:border-primary/50 transition-colors text-base"
              value={selectedJadwal}
              onChange={(e) => setSelectedJadwal(e.target.value)}
            >
              <option value="">-- Pilih Jadwal --</option>
              {jadwal.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} - {new Date(j.date).toLocaleDateString("id-ID", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {selectedJadwal && (
          <>
            {/* PIN & QR Management */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* PIN Section */}
              <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-green-500" />
                    PIN Absensi
                  </CardTitle>
                  <CardDescription>Generate dan kelola PIN untuk absensi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeSettings ? (
                    <>
                      <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 rounded-xl text-center">
                        <Badge className="mb-3 bg-green-500">Sesi Aktif</Badge>
                        <div className="text-5xl font-mono font-bold text-foreground mb-2 tracking-wider">
                          {activeSettings.pin}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline h-4 w-4 mr-1" />
                          Berlaku hingga: {new Date(activeSettings.expires_at).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          onClick={generateNewSession}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </Button>
                        <Button 
                          onClick={deactivateSession}
                          variant="destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Nonaktifkan
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="text-muted-foreground">Belum ada sesi aktif</div>
                      <Button 
                        onClick={generateNewSession}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
                      >
                        <Hash className="mr-2 h-5 w-5" />
                        Generate PIN Baru
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QR Code Section */}
              <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-blue-500" />
                    QR Code
                  </CardTitle>
                  <CardDescription>QR Code untuk absensi cepat</CardDescription>
                </CardHeader>
                <CardContent>
                  {qrCodeUrl ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-muted rounded-2xl text-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="mx-auto w-48 h-48 border-4 border-border rounded-xl p-2" 
                        />
                      </div>
                      <Badge className="w-full justify-center bg-blue-500">QR Code Aktif</Badge>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      Generate PIN untuk membuat QR Code
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Real-time Attendance Monitor */}
            <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Monitor Kehadiran Real-Time
                  <Badge className="ml-auto bg-purple-500">{absensiRecords.length} Peserta</Badge>
                </CardTitle>
                <CardDescription>Daftar peserta yang telah melakukan absensi</CardDescription>
              </CardHeader>
              <CardContent>
                {absensiRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Belum ada peserta yang absen
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {absensiRecords.map((record) => (
                      <div 
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.status === 'hadir' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {record.status === 'hadir' ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {record.profiles?.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(record.waktu_absen).toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {record.metode}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAbsensi;
