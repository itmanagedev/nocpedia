import { Sidebar } from "@/components/public/Sidebar";
import { SearchBar } from "@/components/public/SearchBar";
import Link from "next/link";
import { Terminal } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#1a1a2e] border-b border-gray-800 z-40 flex items-center px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#00d4aa]">
          <Terminal size={24} />
          <span>NOCPedia</span>
        </Link>
        <div className="flex-1 flex justify-center px-4">
          <SearchBar />
        </div>
        <div className="w-32 flex justify-end">
          <Link 
            href="/admin/login" 
            className="text-xs text-gray-500 hover:text-[#00d4aa] transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
