"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Network, 
  Server, 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  Cpu, 
  Terminal,
  Layers
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  manufacturers: {
    id: string;
    name: string;
    slug: string;
    categories: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
}

export const Sidebar = () => {
  const pathname = usePathname();
  const [sections, setSections] = useState<NavItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedManufacturers, setExpandedManufacturers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch("/api/public/navigation");
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error("Failed to fetch navigation", err);
      }
    };
    fetchNav();
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleManufacturer = (id: string) => {
    setExpandedManufacturers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "redes": return <Globe size={18} />;
      case "server": return <Server size={18} />;
      default: return <Layers size={18} />;
    }
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#1a1a2e] border-r border-gray-800 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="space-y-1">
            <button
              onClick={() => toggleSection(section.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5",
                pathname.includes(`/${section.slug}`) ? "text-[#00d4aa]" : "text-gray-400"
              )}
            >
              <div className="flex items-center gap-3">
                {getIcon(section.name)}
                <span>{section.name}</span>
              </div>
              {expandedSections[section.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {expandedSections[section.id] && (
              <div className="ml-4 space-y-1 border-l border-gray-800 pl-2">
                {section.manufacturers.map((m) => (
                  <div key={m.id} className="space-y-1">
                    <button
                      onClick={() => toggleManufacturer(m.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5",
                        pathname.includes(`/${section.slug}/${m.slug}`) ? "text-[#00d4aa]" : "text-gray-500"
                      )}
                    >
                      <span>{m.name}</span>
                      {expandedManufacturers[m.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>

                    {expandedManufacturers[m.id] && (
                      <div className="ml-4 space-y-1 border-l border-gray-800 pl-2">
                        {m.categories.map((c) => (
                          <Link
                            key={c.id}
                            href={`/${section.slug}/${m.slug}/${c.slug}`}
                            className={cn(
                              "block rounded-md px-3 py-1 text-xs transition-colors hover:bg-white/5",
                              pathname === `/${section.slug}/${m.slug}/${c.slug}`
                                ? "text-[#00d4aa] font-semibold"
                                : "text-gray-600 hover:text-gray-400"
                            )}
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};
