"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Registrasi berhasil! Silakan login.");
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("full-name") as string;
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validation
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan saat registrasi");
        setIsLoading(false);
        return;
      }

      setSuccess("Registrasi berhasil! Silakan login.");
      // Reset form
      (e.target as HTMLFormElement).reset();
      
      // Switch to sign in tab after successful registration
      setTimeout(() => {
        const signinButton = document.querySelector('[value="signin"]') as HTMLElement;
        if (signinButton) {
          signinButton.click();
        }
      }, 500);
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setIsLoading(false);
      } else if (result?.ok) {
        setSuccess("Login berhasil! Mengalihkan...");
        
        // Fetch user data to get role
        const response = await fetch("/api/users/profile");
        const userData = await response.json();
        
        // Redirect based on role
        let redirectUrl = "/overview"; // default
        
        if (userData.role === "ADMIN") {
          redirectUrl = "/admin";
        } else if (userData.role === "INSTRUCTOR") {
          redirectUrl = "/instructor";
        } else if (userData.role === "USER") {
          redirectUrl = "/overview";
        }
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-center items-center overflow-hidden"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
     
      <div className="fixed inset-0 z-0 w-screen h-screen pointer-events-none select-none">
      
        <svg
          className="absolute inset-0 w-full h-full"
          width="100%"
          height="100%"
          viewBox="0 0 400 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ minWidth: '100vw', minHeight: '100vh', objectFit: 'cover' }}
        >
          <defs>
            <pattern id="ketupat-auth" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(45)">
              <rect x="0" y="0" width="60" height="60" fill="none" />
              <rect x="10" y="10" width="40" height="40" rx="8" fill="#d1fae5" fillOpacity="0.18" stroke="#10b981" strokeWidth="2" />
              <rect x="20" y="20" width="20" height="20" rx="4" fill="#34d399" fillOpacity="0.22" stroke="#059669" strokeWidth="1.5" />
              <line x1="30" y1="0" x2="30" y2="60" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="30" x2="60" y2="30" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ketupat-auth)" />
        </svg>

        <div className="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-100 via-white/90 to-emerald-200/80" />
        <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <circle cx="80" cy="120" r="60" fill="#a7f3d0" fillOpacity="0.18" />
          <circle cx="320" cy="200" r="40" fill="#6ee7b7" fillOpacity="0.13" />
          <circle cx="200" cy="600" r="90" fill="#d1fae5" fillOpacity="0.13" />
          <circle cx="350" cy="700" r="50" fill="#99f6e4" fillOpacity="0.10" />
        </svg>
      </div>
      <div className="flex flex-1 items-center justify-center px-2 py-8 relative z-10 w-full min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
    
          <div className="bg-white/95 rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col justify-center w-full max-w-md border border-emerald-100 backdrop-blur-md">
            <div className="flex flex-col items-center gap-2 mb-6">
              <img src="/logo.png" alt="IRMA Verse" className="h-8 w-8 object-contain" />
              <div className="text-center">
                <div className="font-black text-xl text-emerald-600">IRMA Verse</div>
                <div className="text-xs text-gray-400 font-medium">Platform Rohis Digital</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Selamat Datang Kembali!</h2>
            <p className="text-gray-500 mb-6">Masuk untuk melanjutkan perjalanan spiritualmu</p>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Masuk</TabsTrigger>
                <TabsTrigger value="signup">Daftar</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-700">Email</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <Input
                        id="signin-email"
                        name="signin-email"
                        type="email"
                        placeholder="nama@email.com"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-700">Kata Sandi</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 12V8a6 6 0 1112 0v4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="12" width="12" height="8" rx="2" stroke="#94a3b8" strokeWidth="2"/></svg>
                      </span>
                      <Input
                        id="signin-password"
                        name="signin-password"
                        type="password"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="remember" className="accent-emerald-500" />
                      <label htmlFor="remember" className="text-gray-700">Ingat saya</label>
                    </div>
                    <a href="#" className="text-emerald-500 hover:underline">Lupa kata sandi?</a>
                  </div>
                  <Button type="submit" className="w-full rounded-xl py-2.5 text-base font-semibold bg-linear-to-r from-emerald-400 to-teal-400 shadow-lg" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Masuk"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-gray-700">Nama Lengkap</Label>
                    <Input
                      id="full-name"
                      name="full-name"
                      type="text"
                      placeholder="Nama Lengkap"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700">Email</Label>
                    <Input
                      id="signup-email"
                      name="signup-email"
                      type="email"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700">Kata Sandi</Label>
                    <Input
                      id="signup-password"
                      name="signup-password"
                      type="password"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700">Konfirmasi Kata Sandi</Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl py-2.5 text-base font-semibold bg-linear-to-r from-emerald-400 to-teal-400 shadow-lg" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Daftar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          <div className="hidden md:flex flex-col justify-center items-center text-center px-6">
            <div className="mb-8">
              <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="110" cy="90" rx="60" ry="30" fill="#14b8a6" fillOpacity="0.12" />
                <rect x="90" y="60" width="40" height="40" rx="8" fill="#14b8a6" fillOpacity="0.12" />
                <circle cx="110" cy="80" r="18" stroke="#14b8a6" strokeWidth="2" fill="none" />
                <ellipse cx="50" cy="80" rx="18" ry="8" fill="#14b8a6" fillOpacity="0.10" />
                <ellipse cx="170" cy="80" rx="18" ry="8" fill="#14b8a6" fillOpacity="0.10" />
                <circle cx="110" cy="40" r="6" fill="#14b8a6" fillOpacity="0.10" />
                <circle cx="60" cy="60" r="4" fill="#14b8a6" fillOpacity="0.10" />
                <circle cx="160" cy="60" r="4" fill="#14b8a6" fillOpacity="0.10" />
              </svg>
            </div>
            <div>
              <h3 className="text-emerald-500 font-semibold text-lg mb-2">Bergabunglah dalam Komunitas Islami</h3>
              <p className="text-gray-500 text-base max-w-xs mx-auto">Platform digital untuk mengelola aktivitas rohani Islam sekolah dengan modern dan efisien</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <Auth />
    </Suspense>
  );
}
