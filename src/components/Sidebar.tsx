import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Kajian", path: "/materials" },
    { icon: Calendar, label: "Event", path: "/schedule" },
    { icon: Users, label: "Daftar Instruktur", path: "/instructors" },
    { icon: GraduationCap, label: "Program Kurikulum", path: "/programs" },
    { icon: Trophy, label: "Info Perlombaan", path: "/competitions" },
    { icon: Users, label: "Daftar Anggota", path: "/members" },
    { icon: Newspaper, label: "Berita IRMA", path: "/news" },
  ];

  return (
    <div className={`hidden lg:block flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)] px-6 py-8 overflow-y-auto transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title={isExpanded ? "Persempit Sidebar" : "Perlebar Sidebar"}
        >
          {isExpanded ? (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span className="text-sm font-semibold">Perkecil</span>
            </>
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>
        {menuItems.map((item, idx) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left transform ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                  : "text-slate-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-teal-50 hover:to-cyan-100 hover:text-emerald-700 hover:shadow-md hover:scale-105 hover:-translate-x-1"
              } ${!isExpanded && 'justify-center'}`}
              title={!isExpanded ? item.label : ''}
            >
              <IconComponent className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${!isActive && "group-hover:rotate-12 group-hover:scale-110"}`} />
              {isExpanded && <span className="text-sm font-semibold">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
