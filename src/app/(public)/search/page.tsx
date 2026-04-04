import prisma from "@/lib/prisma";
import { CommandCard } from "@/components/public/CommandCard";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: { q?: string } 
}) {
  const query = searchParams.q || "";

  const commands = await prisma.command.findMany({
    where: {
      active: true,
      OR: [
        { title: { contains: query, mode: "insensitive" as any } },
        { description: { contains: query, mode: "insensitive" as any } },
        { tags: { hasSome: [query] } },
        { code: { contains: query, mode: "insensitive" as any } },
      ]
    },
    include: {
      category: {
        include: {
          manufacturer: {
            include: {
              section: true
            }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="py-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#00d4aa]/10 rounded-full text-[#00d4aa]">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Resultados da busca</h1>
          <p className="text-gray-400">
            {commands.length} resultados encontrados para <span className="text-[#00d4aa] font-semibold">&quot;{query}&quot;</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {commands.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500">Nenhum comando encontrado para sua busca.</p>
            <p className="text-sm text-gray-600 mt-2">Tente termos mais genéricos ou verifique a ortografia.</p>
          </div>
        ) : (
          commands.map((command) => (
            <div key={command.id} className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 px-1">
                <span>{command.category.manufacturer.section.name}</span>
                <span>/</span>
                <span>{command.category.manufacturer.name}</span>
                <span>/</span>
                <span className="text-[#00d4aa]">{command.category.name}</span>
              </div>
              <CommandCard command={command} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
