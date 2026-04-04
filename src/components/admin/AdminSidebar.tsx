"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Globe, 
  Factory, 
  FolderTree, 
  Keyboard, 
  Users, 
  LogOut,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Seções", href: "/admin/sections", icon: Globe },
  { name: "Fabricantes", href: "/admin/manufacturers", icon: Factory },
  { name: "Categorias", href: "/admin/categories", icon: FolderTree },
  { name: "Comandos", href: "/admin/commands", icon: Keyboard },
  { name: "Usuários", href: "/admin/users", icon: Users },
];

export const AdminSidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#1a1a2e] border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold text-[#00d4aa] flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00d4aa] rounded flex items-center justify-center text-[#0f1117]">N</div>
          NOCPedia Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
              pathname === item.href
                ? "bg-[#00d4aa] text-[#0f1117]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
            <UserIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};
