import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trophy, Award, Calendar, Target, TrendingUp, Edit2, Save, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LevelDisplay from "@/components/LevelDisplay";

interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  totalAttendance: number;
  totalBadges: number;
  totalPoints: number;
}

interface BadgeData {
  id: string;
  name: string;
  icon: string;
  points: number;
  earned_at: string;
}

interface AttendanceRecord {
  id: string;
  waktu_absen: string;
  status: string;
  jadwal: {
    title: string;
    date: string;
  };
}

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalAttendance: 0,
    totalBadges: 0,
    totalPoints: 0,
  });
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", bio: "" });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchProfileData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchProfileData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);
      setEditForm({
        full_name: profileData?.full_name || "",
        bio: profileData?.bio || "",
      });

      // Fetch quiz stats
      const { data: quizAttempts } = await supabase
        .from("quiz_attempts")
        .select("score")
        .eq("user_id", session.user.id);

      const totalQuizzes = quizAttempts?.length || 0;
      const averageScore = totalQuizzes > 0
        ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
        : 0;
      const bestScore = totalQuizzes > 0
        ? Math.max(...quizAttempts.map(a => a.score))
        : 0;

      // Fetch attendance
      const { data: attendanceData } = await supabase
        .from("absensi")
        .select(`
          id,
          waktu_absen,
          status,
          jadwal_id
        `)
        .eq("user_id", session.user.id)
        .order("waktu_absen", { ascending: false })
        .limit(10);

      // Fetch jadwal details for each attendance
      const attendanceWithDetails = await Promise.all(
        (attendanceData || []).map(async (record) => {
          const { data: jadwalData } = await supabase
            .from("jadwal_kajian")
            .select("title, date")
            .eq("id", record.jadwal_id)
            .single();

          return {
            ...record,
            jadwal: jadwalData || { title: "Unknown", date: "" },
          };
        })
      );

      setAttendance(attendanceWithDetails);

      // Fetch badges
      const { data: userBadgesData } = await supabase
        .from("user_badges")
        .select(`
          earned_at,
          badge_id
        `)
        .eq("user_id", session.user.id);

      const badgeDetails = await Promise.all(
        (userBadgesData || []).map(async (ub) => {
          const { data: badgeData } = await supabase
            .from("badges")
            .select("id, name, icon, points")
            .eq("id", ub.badge_id)
            .single();

          return {
            ...badgeData,
            earned_at: ub.earned_at,
          };
        })
      );

      setBadges(badgeDetails);

      const totalPoints = badgeDetails.reduce((sum, b) => sum + (b.points || 0), 0);

      setStats({
        totalQuizzes,
        averageScore,
        bestScore,
        totalAttendance: attendanceData?.length || 0,
        totalBadges: badgeDetails.length,
        totalPoints,
      });

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Math.random()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: data.publicUrl });

      toast({
        title: "Foto profil diupdate",
        description: "Foto profil berhasil diperbarui",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        full_name: editForm.full_name,
        bio: editForm.bio,
      });
      setIsEditing(false);

      toast({
        title: "Profil diupdate",
        description: "Profil berhasil diperbarui",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat profil...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {profile?.full_name ? getInitials(profile.full_name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="full_name">Nama Lengkap</Label>
                          <Input
                            id="full_name"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            placeholder="Ceritakan sedikit tentang dirimu..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile} size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Simpan
                          </Button>
                          <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                            <X className="h-4 w-4 mr-2" />
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-3xl font-bold text-foreground">
                            {profile?.full_name || "User"}
                          </h1>
                          <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {profile?.bio && (
                          <p className="text-muted-foreground mb-4">{profile.bio}</p>
                        )}
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="font-semibold">{stats.totalPoints} Poin</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-blue-500" />
                            <span>{stats.totalBadges} Badge</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Display */}
            <LevelDisplay totalPoints={stats.totalPoints} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Total Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.totalQuizzes}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Rata-rata Skor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.averageScore}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Skor Terbaik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.bestScore}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Total Kehadiran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.totalAttendance}</div>
                </CardContent>
              </Card>
            </div>

            {/* Badges Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Badge yang Diraih
                </CardTitle>
                <CardDescription>
                  Koleksi badge dari pencapaianmu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada badge yang diraih
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                      >
                        <div className="text-4xl">{badge.icon}</div>
                        <p className="text-sm font-medium text-center">{badge.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          +{badge.points} poin
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(badge.earned_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Riwayat Kehadiran
                </CardTitle>
                <CardDescription>
                  10 kehadiran terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendance.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada riwayat kehadiran
                  </p>
                ) : (
                  <div className="space-y-4">
                    {attendance.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{record.jadwal.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.jadwal.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={record.status === "hadir" ? "default" : "secondary"}
                          >
                            {record.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(record.waktu_absen).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
