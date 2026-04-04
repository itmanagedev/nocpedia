import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If it's the login page, don't show the sidebar
  // This is handled by checking the pathname in a client component or just letting the login page be full screen
  // But since this is a server layout, we can't check pathname easily here without headers
  // We'll assume the login page is a separate layout or handled within this layout

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {session ? (
        <div className="flex">
          <AdminSidebar user={session.user} />
          <main className="flex-1 ml-64 p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      )}
    </div>
  );
}
