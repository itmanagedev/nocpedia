import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BreadCrumb } from "@/components/public/BreadCrumb";
import { CommandCard } from "@/components/public/CommandCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ 
  params 
}: { 
  params: { section: string; manufacturer: string; category: string } 
}) {
  const category = await prisma.category.findFirst({
    where: { 
      slug: params.category,
      manufacturer: { 
        slug: params.manufacturer,
        section: { slug: params.section }
      }
    },
    include: {
      manufacturer: { include: { section: true } },
      commands: {
        where: { active: true },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!category) notFound();

  return (
    <div className="py-6">
      <BreadCrumb />
      
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded uppercase tracking-wider">
            {category.manufacturer.section.name}
          </span>
          <span className="text-[10px] font-bold text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {category.manufacturer.name}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
        <p className="text-gray-400">{category.description || `Lista de comandos para ${category.name}`}</p>
      </div>

      <div className="space-y-6">
        {category.commands.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500">Nenhum comando cadastrado nesta categoria ainda.</p>
          </div>
        ) : (
          category.commands.map((command) => (
            <CommandCard key={command.id} command={command} />
          ))
        )}
      </div>
    </div>
  );
}
