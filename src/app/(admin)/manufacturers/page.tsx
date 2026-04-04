"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ManufacturerForm } from "@/components/admin/ManufacturerForm";
import { Plus, Edit, Trash2, Factory } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";

export default function ManufacturersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manufacturers");
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast.error("Erro ao carregar fabricantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este fabricante?")) return;

    try {
      const res = await fetch(`/api/admin/manufacturers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Fabricante excluído com sucesso");
        fetchData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao excluir fabricante");
    }
  };

  const columns = [
    { header: "Nome", accessorKey: "name", cell: (item: any) => (
      <div className="flex items-center gap-2 font-medium text-white">
        <Factory size={16} className="text-[#00d4aa]" />
        {item.name}
      </div>
    )},
    { header: "Seção", accessorKey: "section", cell: (item: any) => (
      <Badge variant="outline">{item.section?.name}</Badge>
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
          <h1 className="text-3xl font-bold text-white">Fabricantes</h1>
          <p className="text-gray-400">Gerencie os fabricantes de cada seção</p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}>
          <Plus size={18} className="mr-2" />
          Novo Fabricante
        </Button>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Editar Fabricante" : "Novo Fabricante"}
      >
        <ManufacturerForm 
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
