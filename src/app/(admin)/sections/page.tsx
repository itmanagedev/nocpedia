"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SectionForm } from "@/components/admin/SectionForm";
import { Plus, Edit, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";

export default function SectionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections");
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast.error("Erro ao carregar seções");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta seção? Todos os fabricantes, categorias e comandos vinculados serão excluídos.")) return;

    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Seção excluída com sucesso");
        fetchData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao excluir seção");
    }
  };

  const columns = [
    { header: "Nome", accessorKey: "name", cell: (item: any) => (
      <div className="flex items-center gap-2 font-medium text-white">
        <Globe size={16} className="text-[#00d4aa]" />
        {item.name}
      </div>
    )},
    { header: "Slug", accessorKey: "slug" },
    { header: "Ordem", accessorKey: "order" },
    { header: "Status", accessorKey: "active", cell: (item: any) => (
      <Badge variant={item.active ? "success" : "secondary"}>
        {item.active ? "Ativo" : "Inativo"}
      </Badge>
    )},
    { header: "Ações", accessorKey: "actions", cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setEditingItem(item);
            setIsModalOpen(true);
          }}
        >
          <Edit size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-400 hover:text-red-500"
          onClick={() => handleDelete(item.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Seções</h1>
          <p className="text-gray-400">Gerencie as seções principais do NOCPedia</p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}>
          <Plus size={18} className="mr-2" />
          Nova Seção
        </Button>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Editar Seção" : "Nova Seção"}
      >
        <SectionForm 
          initialData={editingItem} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }} 
        />
      </Modal>
    </div>
  );
}
