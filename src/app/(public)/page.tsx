import prisma from "@/lib/prisma";
import Link from "next/link";
import { Globe, Server, Layers, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sections = await prisma.section.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { manufacturers: true }
      }
    }
  });

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "redes": return <Globe size={40} className="text-[#00d4aa]" />;
      case "server": return <Server size={40} className="text-[#00d4aa]" />;
      default: return <Layers size={40} className="text-[#00d4aa]" />;
    }
  };

  return (
    <div className="space-y-10 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Bem-vindo ao <span className="text-[#00d4aa]">NOCPedia</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Sua base de conhecimento centralizada para comandos de rede, servidores e infraestrutura. 
          Rápido, eficiente e feito para o time NOC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/${section.slug}`}
            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a2e] p-8 transition-all hover:border-[#00d4aa]/50 hover:shadow-2xl hover:shadow-[#00d4aa]/5"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="p-3 bg-[#00d4aa]/10 rounded-lg w-fit">
                  {getIcon(section.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#00d4aa] transition-colors">
                    {section.name}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {section.description || `Explore comandos de ${section.name.toLowerCase()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-gray-300">{section._count.manufacturers}</span> Fabricantes disponíveis
                </div>
              </div>
              <ChevronRight className="text-gray-700 group-hover:text-[#00d4aa] group-hover:translate-x-1 transition-all" size={32} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f1117] border border-gray-800 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Busca Inteligente</h3>
        <p className="text-gray-400 mb-6">Use a barra de busca acima para encontrar comandos por título, fabricante ou tags.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["bgp", "ospf", "vlan", "interface", "linux", "huawei", "cisco"].map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs border border-gray-700">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
