"use client";

import { useState, useEffect } from "react";
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
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-100 flex flex-col" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
          {/* Card Form login */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col justify-center w-full max-w-md border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="IRMA Verse" className="h-8 w-8 object-contain" />
              <div>
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
                  <Button type="submit" className="w-full rounded-xl py-2.5 text-base font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg" disabled={isLoading}>
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
                  <Button type="submit" className="w-full rounded-xl py-2.5 text-base font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg" disabled={isLoading}>
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

export default Auth;
