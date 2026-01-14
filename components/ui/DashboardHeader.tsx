"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Settings, User as UserIcon, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardHeader() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/auth";
    }
  });
  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah";
  
  return (
    <div className="border-b border-slate-200 backdrop-blur-xl bg-white/80 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between gap-4 h-16">
        {/* Logo - Left (aligned with sidebar) */}
        <div className="flex items-center gap-3 shrink-0 pl-6 lg:pl-8">
          {/* Mobile burger button */}
          <button
            className="lg:hidden mr-1 inline-flex items-center justify-center h-10 w-10 rounded-md bg-emerald-500 text-white shadow-md hover:bg-emerald-600 active:scale-95 transition-transform"
            onClick={() => window.dispatchEvent(new Event('open-mobile-sidebar'))}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src="/logo.png" alt="IRMA Verse" className="h-10 w-10 object-contain" />
          <div className="block">
            <h2 className="text-base sm:text-lg font-black leading-tight text-white uppercase tracking-wide bg-linear-to-r from-teal-600 to-emerald-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg">
              IRMA VERSE
            </h2>
            <p className="block text-[10px] sm:text-xs text-slate-600 mt-0.5 sm:mt-1">Platform digital Irma 13</p>
          </div>
        </div>

        {/* Search Bar - Center on desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Cari kajian, event, atau berita..."
              className="w-full px-4 py-2 rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Icons & Profile */}
        <div className="flex items-center gap-4 shrink-0 pr-6 lg:pr-8">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 h-10 px-2 rounded-lg hover:bg-green-100 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={session?.user.name ?? session?.user.email} />
                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-cyan-500 text-white text-sm font-semibold">
                    {(session?.user.name ?? session?.user.email)?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-semibold text-slate-900">{session?.user.name ?? session?.user.email}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} alt={session?.user.name ?? session?.user.email} />
                    <AvatarFallback className="bg-linear-to-br from-emerald-500 to-cyan-500 text-white font-semibold">
                      {(session?.user.name ?? session?.user.email)?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{session?.user.name ?? session?.user.email}</span>
                    <span className="text-xs text-slate-500">{session?.user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut({ callbackUrl: "/auth" });
                }}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar - Below main header */}
      <div className="md:hidden px-4 pb-3 pt-1">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Cari kajian, event, atau berita..."
            className="w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};