"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { UserForm } from "@/components/admin/UserForm";
import { Plus, Edit, Trash2, User as UserIcon, Shield } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      toast.error("Erro ao carregar usuários ou sem permissão");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuário excluído com sucesso");
        fetchData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao excluir usuário");
    }
  };

  const columns = [
    { header: "Nome", accessorKey: "name", cell: (item: any) => (
      <div className="flex items-center gap-2 font-medium text-white">
        <UserIcon size={16} className="text-gray-400" />
        {item.name}
      </div>
    )},
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role", cell: (item: any) => (
      <div className="flex items-center gap-1.5">
        <Shield size={14} className={cn(
          item.role === "SUPER_ADMIN" ? "text-red-400" : 
          item.role === "ADMIN" ? "text-[#00d4aa]" : "text-gray-500"
        )} />
        <span className="text-xs font-semibold">{item.role}</span>
      </div>
    )},
    { header: "Criado em", accessorKey: "createdAt", cell: (item: any) => formatDate(item.createdAt) },
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
          <h1 className="text-3xl font-bold text-white">Usuários</h1>
          <p className="text-gray-400">Gerencie os acessos ao painel admin</p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}>
          <Plus size={18} className="mr-2" />
          Novo Usuário
        </Button>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Editar Usuário" : "Novo Usuário"}
      >
        <UserForm 
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

// Helper to use cn in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
