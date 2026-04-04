import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BreadCrumb } from "@/components/public/BreadCrumb";
import { ChevronRight, Factory } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SectionPage({ params }: { params: { section: string } }) {
  const section = await prisma.section.findUnique({
    where: { slug: params.section },
    include: {
      manufacturers: {
        where: { active: true },
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { categories: true }
          }
        }
      }
    }
  });

  if (!section) notFound();

  return (
    <div className="py-6">
      <BreadCrumb />
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">{section.name}</h1>
        <p className="text-gray-400">{section.description || `Fabricantes disponíveis na seção ${section.name}`}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.manufacturers.map((m) => (
          <Link
            key={m.id}
            href={`/${section.slug}/${m.slug}`}
            className="group flex flex-col rounded-lg border border-gray-800 bg-[#1a1a2e] p-6 transition-all hover:border-[#00d4aa]/50 shadow-md"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-gray-800 rounded-md text-[#00d4aa]">
                <Factory size={24} />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-[#00d4aa] transition-colors">
                {m.name}
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              {m.description || `Comandos e categorias para ${m.name}`}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <span className="text-xs text-gray-500">
                <span className="text-gray-300 font-semibold">{m._count.categories}</span> Categorias
              </span>
              <ChevronRight size={16} className="text-gray-700 group-hover:text-[#00d4aa] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
