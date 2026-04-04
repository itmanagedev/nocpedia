"use client";

import { useState, useEffect } from "react";
import { 
  Keyboard, 
  Factory, 
  FolderTree, 
  Users, 
  TrendingUp,
  Clock,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: "Total de Comandos", value: stats?.commands || 0, icon: Keyboard, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Fabricantes", value: stats?.manufacturers || 0, icon: Factory, color: "text-[#00d4aa]", bg: "bg-[#00d4aa]/10" },
    { name: "Categorias", value: stats?.categories || 0, icon: FolderTree, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Usuários", value: stats?.users || 0, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Visão geral do sistema NOCPedia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-[#1a1a2e] border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-lg", card.bg, card.color)}>
                <card.icon size={24} />
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-gray-800 animate-pulse rounded" />
              ) : (
                <span className="text-3xl font-bold text-white">{card.value}</span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-400">{card.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-[#00d4aa]" />
              Atividade Recente
            </h2>
            <Link href="/admin/commands" className="text-xs text-[#00d4aa] hover:underline">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#0f1117] rounded-lg border border-gray-800">
              <div className="p-2 bg-[#00d4aa]/10 text-[#00d4aa] rounded">
                <Clock size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">Novos comandos adicionados este mês</p>
                <p className="text-xs text-gray-500">Total de {stats?.thisMonthCommands || 0} comandos</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">+{stats?.thisMonthCommands || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/commands" 
              className="flex items-center justify-between p-4 bg-[#0f1117] rounded-lg border border-gray-800 hover:border-[#00d4aa]/50 transition-all group"
            >
              <span className="text-sm text-gray-300 group-hover:text-[#00d4aa]">Novo Comando</span>
              <Plus size={18} className="text-gray-500" />
            </Link>
            <Link 
              href="/admin/categories" 
              className="flex items-center justify-between p-4 bg-[#0f1117] rounded-lg border border-gray-800 hover:border-[#00d4aa]/50 transition-all group"
            >
              <span className="text-sm text-gray-300 group-hover:text-[#00d4aa]">Nova Categoria</span>
              <Plus size={18} className="text-gray-500" />
            </Link>
            <Link 
              href="/admin/manufacturers" 
              className="flex items-center justify-between p-4 bg-[#0f1117] rounded-lg border border-gray-800 hover:border-[#00d4aa]/50 transition-all group"
            >
              <span className="text-sm text-gray-300 group-hover:text-[#00d4aa]">Novo Fabricante</span>
              <Plus size={18} className="text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
