"use client";

import { Search, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (pathname !== "/search") {
      router.push(`/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Busque por comandos, tags ou descrição..."
          className="w-full rounded-full bg-[#1a1a2e] border border-gray-700 py-2 pl-10 pr-10 text-sm text-gray-200 placeholder:text-gray-500 focus:border-[#00d4aa] focus:outline-none focus:ring-1 focus:ring-[#00d4aa] transition-all"
        />
        {localQuery && (
          <button
            type="button"
            onClick={() => {
              setLocalQuery("");
              setSearchQuery("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
};
