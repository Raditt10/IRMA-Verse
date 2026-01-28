"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutGrid,
  BookOpen,
  Calendar,
  Users,
  GraduationCap,
  Trophy,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  MessageCircle,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved) {
      setIsExpanded(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded));
    }
  }, [isExpanded, mounted]);

  // Listen for global events to open/close mobile sidebar (triggered from header)
  useEffect(() => {
    const openHandler = () => setIsMobileOpen(true);
    const closeHandler = () => setIsMobileOpen(false);
    window.addEventListener('open-mobile-sidebar', openHandler as EventListener);
    window.addEventListener('close-mobile-sidebar', closeHandler as EventListener);
    return () => {
      window.removeEventListener('open-mobile-sidebar', openHandler as EventListener);
      window.removeEventListener('close-mobile-sidebar', closeHandler as EventListener);
    };
  }, []);

  // Base menu items for all users
  const baseMenuItems = [
    { icon: LayoutGrid, label: "Dashboard", path: "/overview" },
    { icon: BookOpen, label: "Kajian Mingguanku", path: "/materials" },
    { icon: Calendar, label: "Event", path: "/schedule" },
    { icon: Users, label: "Daftar Instruktur", path: "/instructors" },
    { icon: GraduationCap, label: "Program Kurikulum", path: "/programs" },
    { icon: Trophy, label: "Info Perlombaan", path: "/competitions" },
    { icon: Users, label: "Daftar Anggota", path: "/members" },
    { icon: Newspaper, label: "Berita IRMA", path: "/news" },
  ];

  // Add chat menu item based on role
  const menuItems = session?.user?.role === "instruktur"
    ? [
        ...baseMenuItems.slice(0, 4),
        { icon: MessageCircle, label: "Pesan Masuk", path: "/overview/academy/chat" },
        ...baseMenuItems.slice(4),
      ]
    : [
        ...baseMenuItems.slice(0, 4),
        { icon: MessageCircle, label: "Chat Instruktur", path: "/instructors/chat" },
        ...baseMenuItems.slice(4),
      ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)] px-6 py-8 overflow-y-auto transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
        <div className="space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center p-2 text-slate-700 hover:text-slate-900 transition-colors duration-300 mb-4"
            title={isExpanded ? "Persempit Sidebar" : "Perlebar Sidebar"}
          >
            {isExpanded ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-left ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-teal-50 hover:to-cyan-100 hover:text-emerald-700 hover:shadow-md"
                } ${!isExpanded && 'justify-center'}`}
                title={!isExpanded ? item.label : ''}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-500 ease-in-out"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed z-50 top-0 left-0 h-screen w-3/4 bg-white dark:bg-white border-r border-slate-200 dark:border-slate-200 shadow-2xl animate-in slide-in-from-left duration-500 ease-out rounded-r-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-200">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="IRMA Verse" className="h-8 w-8 object-contain" />
                <div>
                  <h2 className="text-xs font-black leading-tight text-white uppercase tracking-wide bg-linear-to-r from-teal-600 to-emerald-600 px-2 py-0.5 rounded-lg">
                    IRMA VERSE
                  </h2><p className="text-[10px] text-slate-600 mt-0.5\">Platform Rohis Digital Irma 13</p>
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:text-slate-900 transition-colors duration-300"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Items */}
            <div className="px-4 py-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
              {menuItems.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.path;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsMobileOpen(false);
                      router.push(item.path);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${
                      isActive 
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-teal-50 hover:to-cyan-100 hover:text-emerald-700 dark:hover:text-emerald-700 hover:shadow-md"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;