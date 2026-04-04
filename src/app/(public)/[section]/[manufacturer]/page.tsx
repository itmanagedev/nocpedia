import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BreadCrumb } from "@/components/public/BreadCrumb";
import { ChevronRight, FolderTree } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManufacturerPage({ 
  params 
}: { 
  params: { section: string; manufacturer: string } 
}) {
  const manufacturer = await prisma.manufacturer.findFirst({
    where: { 
      slug: params.manufacturer,
      section: { slug: params.section }
    },
    include: {
      section: true,
      categories: {
        where: { active: true },
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { commands: true }
          }
        }
      }
    }
  });

  if (!manufacturer) notFound();

  return (
    <div className="py-6">
      <BreadCrumb />
      
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {manufacturer.section.name}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{manufacturer.name}</h1>
        <p className="text-gray-400">{manufacturer.description || `Categorias de comandos para ${manufacturer.name}`}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {manufacturer.categories.map((c) => (
          <Link
            key={c.id}
            href={`/${manufacturer.section.slug}/${manufacturer.slug}/${c.slug}`}
            className="group flex items-center justify-between rounded-lg border border-gray-800 bg-[#1a1a2e] p-5 transition-all hover:border-[#00d4aa]/50 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-800 rounded-md text-[#00d4aa]">
                <FolderTree size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white group-hover:text-[#00d4aa] transition-colors">
                  {c.name}
                </h2>
                <p className="text-xs text-gray-500">
                  {c._count.commands} comandos disponíveis
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-700 group-hover:text-[#00d4aa] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
