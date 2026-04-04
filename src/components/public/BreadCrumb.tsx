"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export const BreadCrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link href="/" className="hover:text-[#00d4aa] transition-colors flex items-center gap-1">
        <Home size={14} />
        <span>Home</span>
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight size={12} />
            {isLast ? (
              <span className="text-gray-300 font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-[#00d4aa] transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
