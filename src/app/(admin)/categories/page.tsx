"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";

export default function CategoriesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Categoria excluída com sucesso");
        fetchData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao excluir categoria");
    }
  };

  const columns = [
    { header: "Nome", accessorKey: "name", cell: (item: any) => (
      <div className="flex items-center gap-2 font-medium text-white">
        <FolderTree size={16} className="text-[#00d4aa]" />
        {item.name}
      </div>
    )},
    { header: "Fabricante", accessorKey: "manufacturer", cell: (item: any) => (
      <div className="flex flex-col">
        <span className="text-sm">{item.manufacturer?.name}</span>
        <span className="text-[10px] text-gray-500 uppercase">{item.manufacturer?.section?.name}</span>
      </div>
    )},
    { header: "Slug", accessorKey: "slug" },
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
          <h1 className="text-3xl font-bold text-white">Categorias</h1>
          <p className="text-gray-400">Gerencie as categorias de comandos</p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}>
          <Plus size={18} className="mr-2" />
          Nova Categoria
        </Button>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Editar Categoria" : "Nova Categoria"}
      >
        <CategoryForm 
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
