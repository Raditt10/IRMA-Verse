"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SearchResult {
  id: string;
  type: "news" | "user" | "instructor";
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  category?: string;
  email?: string;
  role?: string;
  bio?: string;
  bidangKeahlian?: string;
  pengalaman?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "news" | "user" | "instructor">("all");

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const filteredResults = results.filter((result) => {
    if (filter === "all") return true;
    return result.type === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Hasil Pencarian
          </h1>
          <p className="text-slate-600">
            Menampilkan hasil untuk: <span className="font-semibold">"{query}"</span>
          </p>
        </div>

        {/* Filter Tabs */}
        {results.length > 0 && (
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === "all"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({results.length})
            </button>
            <button
              onClick={() => setFilter("news")}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === "news"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Berita ({results.filter((r) => r.type === "news").length})
            </button>
            <button
              onClick={() => setFilter("user")}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === "user"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pengguna ({results.filter((r) => r.type === "user").length})
            </button>
            <button
              onClick={() => setFilter("instructor")}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === "instructor"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Instruktur ({results.filter((r) => r.type === "instructor").length})
            </button>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600">Mencari...</span>
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              Tidak ada hasil untuk "{query}"
            </p>
            <Link
              href="/"
              className="inline-block text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Kembali ke beranda
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {result.type === "news" && (
                  <Link href={`/news/${result.slug}`}>
                    <div className="flex gap-4 cursor-pointer">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="h-32 w-32 rounded object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {result.category}
                        </p>
                        <p className="text-slate-600 mt-2 line-clamp-2">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                {result.type === "user" && (
                  <Link href={`/members/${result.id}`}>
                    <div className="cursor-pointer">
                      <h3 className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{result.email}</p>
                      {result.bio && (
                        <p className="text-slate-600 mt-2 line-clamp-2">
                          {result.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                )}

                {result.type === "instructor" && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {result.title}
                    </h3>
                    {result.bidangKeahlian && (
                      <p className="text-slate-700 mt-1 font-medium">
                        {result.bidangKeahlian}
                      </p>
                    )}
                    {result.pengalaman && (
                      <p className="text-slate-600 mt-2">
                        {result.pengalaman}
                      </p>
                    )}
                    <Link
                      href="/instructors"
                      className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      Lihat profil instruktur →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
