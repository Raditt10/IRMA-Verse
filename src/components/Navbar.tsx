import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRealtimeAnnouncements } from "@/hooks/useRealtimeAnnouncements";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Enable realtime announcements
  useRealtimeAnnouncements(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();
    setIsAdmin(!!data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navLinks = user
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Pengumuman", path: "/announcements" },
        { name: "Jadwal", path: "/schedule" },
        { name: "Materi", path: "/materials" },
        { name: "Prestasi", path: "/achievements" },
        { name: "Quiz", path: "/quiz" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "Badges", path: "/badges" },
        { name: "Chat", path: "/chat-rooms" },
        { name: "Profil", path: "/profile" },
        { name: "Aktivitas", path: "/activity-history" },
        { name: "Galeri", path: "/gallery" },
        ...(isAdmin ? [
          { name: "Admin Absensi", path: "/admin/absensi" },
          { name: "Analytics", path: "/analytics" },
          { name: "Reports", path: "/reports" }
        ] : []),
      ]
    : [
        { name: "Beranda", path: "/" },
        { name: "Struktur", path: "/structure" },
        { name: "Galeri", path: "/gallery" },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="IRMA" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-foreground">IRMAVerse</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user && <div data-tour="notifications"><NotificationBell userId={user.id} /></div>}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2" data-tour="profile">
                    <Avatar className="h-8 w-8">
                      {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {profile?.full_name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{profile?.full_name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="default">Masuk</Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <ThemeToggle />
                {user && <NotificationBell userId={user.id} />}
                {user ? (
                  <Button variant="ghost" onClick={handleSignOut} className="flex-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                    <Button variant="default" className="w-full">Masuk</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
