import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, QrCode, Calendar, MapPin, User } from "lucide-react";
import { CardSkeleton } from "@/components/LoadingSkeletons";
import QRCode from "qrcode";

const Absensi = () => {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJadwal, setSelectedJadwal] = useState<string>("");
  const [pin, setPin] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchJadwal();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
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

  const generateQRCode = async (jadwalId: string) => {
    try {
      const qrData = JSON.stringify({ jadwalId, timestamp: Date.now() });
      const url = await QRCode.toDataURL(qrData);
      setQrCodeUrl(url);
      
      await supabase.from("absensi_settings").insert({
        jadwal_id: jadwalId,
        qr_code: qrData,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });

      toast({
        title: "QR Code Generated",
        description: "QR Code berlaku selama 15 menit",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const submitAbsensi = async (jadwalId: string, metode: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("absensi").insert({
        jadwal_id: jadwalId,
        user_id: session.user.id,
        metode: metode,
        status: "hadir",
      });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Absensi berhasil dicatat",
      });

      setPin("");
      setSelectedJadwal("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePinAbsensi = async () => {
    if (!pin || !selectedJadwal) {
      toast({
        title: "Error",
        description: "Pilih jadwal dan masukkan PIN",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: settings, error: settingsError } = await supabase
        .from("absensi_settings")
        .select("*")
        .eq("jadwal_id", selectedJadwal)
        .eq("pin", pin)
        .eq("is_active", true)
        .single();

      if (settingsError || !settings) {
        toast({
          title: "Error",
          description: "PIN tidak valid",
          variant: "destructive",
        });
        return;
      }

      await submitAbsensi(selectedJadwal, "pin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4 p-4 bg-gradient-card rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Absensi Kajian
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Catat kehadiran Anda dengan mudah menggunakan PIN atau QR Code
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : jadwal.length === 0 ? (
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">Belum ada jadwal kajian yang akan datang</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="pin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 h-auto">
              <TabsTrigger value="pin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white py-3">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                PIN Absensi
              </TabsTrigger>
              <TabsTrigger value="qr" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3">
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pin" className="space-y-4">
              <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <ClipboardCheck className="h-5 w-5 text-white" />
                    </div>
                    Absensi dengan PIN
                  </CardTitle>
                  <CardDescription className="text-base">Pilih kajian dan masukkan PIN yang diberikan pemateri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Available Kajian Cards */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Jadwal Kajian Tersedia:</label>
                    <div className="grid gap-3">
                      {jadwal.map((j) => (
                        <div
                          key={j.id}
                          onClick={() => setSelectedJadwal(j.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedJadwal === j.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border/50 hover:border-primary/50 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                {j.title}
                                {selectedJadwal === j.id && (
                                  <Badge className="bg-primary">Dipilih</Badge>
                                )}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(j.date).toLocaleDateString("id-ID", { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </div>
                                {j.pemateri && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {j.pemateri}
                                  </div>
                                )}
                                {j.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {j.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">PIN Absensi</label>
                    <Input
                      type="text"
                      placeholder="Masukkan 6 digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      className="text-center text-2xl font-mono tracking-widest h-14"
                    />
                    <p className="text-xs text-muted-foreground">Minta PIN kepada pemateri atau admin</p>
                  </div>

                  <Button 
                    onClick={handlePinAbsensi} 
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all"
                    disabled={!selectedJadwal || pin.length !== 6}
                  >
                    <ClipboardCheck className="mr-2 h-5 w-5" />
                    Submit Absensi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qr">
              <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-white" />
                    </div>
                    Generate QR Code
                  </CardTitle>
                  <CardDescription className="text-base">Generate QR code untuk absensi (Khusus Admin/Pemateri)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Pilih Jadwal Kajian:</label>
                    <select
                      className="w-full p-3 border-2 rounded-xl bg-background hover:border-primary/50 transition-colors text-base"
                      value={selectedJadwal}
                      onChange={(e) => setSelectedJadwal(e.target.value)}
                    >
                      <option value="">-- Pilih Jadwal --</option>
                      {jadwal.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} - {new Date(j.date).toLocaleDateString("id-ID")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={() => selectedJadwal && generateQRCode(selectedJadwal)}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg transition-all"
                    disabled={!selectedJadwal}
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Generate QR Code
                  </Button>

                  {qrCodeUrl && (
                    <div className="mt-6 p-6 bg-white dark:bg-muted rounded-2xl text-center space-y-4 animate-fade-in">
                      <Badge className="bg-blue-500 text-white">QR Code Aktif</Badge>
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="mx-auto w-64 h-64 border-4 border-border rounded-2xl p-4 shadow-xl bg-white" 
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">QR Code siap digunakan!</p>
                        <p className="text-xs text-muted-foreground">Berlaku selama 15 menit</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Absensi;
