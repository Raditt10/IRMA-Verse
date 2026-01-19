"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";

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

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    performSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case "news":
        router.push(`/news/${result.slug}`);
        break;
      case "user":
        router.push(`/members/${result.id}`);
        break;
      case "instructor":
        router.push(`/instructors`);
        break;
    }
    handleClear();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedResults = {
    berita: results.filter((r) => r.type === "news"),
    pengguna: results.filter((r) => r.type === "user"),
    instruktur: results.filter((r) => r.type === "instructor"),
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Cari kajian, event, berita Irma 13... "
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-md border border-slate-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-slate-500 text-sm">
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                Mencari...
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-center text-slate-500 text-sm">
              Tidak ada hasil untuk "{query}"
            </div>
          ) : (
            <div>
              {/* Berita Section */}
              {groupedResults.berita.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                    Berita
                  </div>
                  {groupedResults.berita.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        {result.image && (
                          <img
                            src={result.image}
                            alt={result.title}
                            className="h-12 w-12 rounded-md object-cover border border-slate-100 shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">
                            {result.title}
                          </div>
                          <div className="text-xs text-emerald-600 font-medium mt-1 uppercase tracking-wide">
                            {result.category || "Berita"}
                          </div>
                          {result.description && (
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Pengguna Section */}
              {groupedResults.pengguna.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                    Pengguna
                  </div>
                  {groupedResults.pengguna.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-2.5 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-b-0"
                    >
                      <div className="font-medium text-slate-900 text-sm">
                        {result.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {result.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Instruktur Section */}
              {groupedResults.instruktur.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                    Instruktur
                  </div>
                  {groupedResults.instruktur.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-2.5 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-b-0"
                    >
                      <div className="font-medium text-slate-900 text-sm">
                        {result.title}
                      </div>
                      {result.bidangKeahlian && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {result.bidangKeahlian}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
