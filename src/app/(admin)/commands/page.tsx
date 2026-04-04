"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CommandForm } from "@/components/admin/CommandForm";
import { Plus, Edit, Trash2, Keyboard, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";

export default function CommandsPage() {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/commands?page=${page}&search=${search}`);
      const json = await res.json();
      setData(json.commands);
      setTotalCount(json.totalCount);
    } catch (err) {
      toast.error("Erro ao carregar comandos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este comando?")) return;

    try {
      const res = await fetch(`/api/admin/commands/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Comando excluído com sucesso");
        fetchData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao excluir comando");
    }
  };

  const columns = [
    { header: "Título", accessorKey: "title", cell: (item: any) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="font-medium text-white truncate">{item.title}</span>
        <span className="text-xs text-gray-500 truncate">{item.description}</span>
      </div>
    )},
    { header: "Categoria", accessorKey: "category", cell: (item: any) => (
      <div className="flex flex-col">
        <span className="text-sm">{item.category?.name}</span>
        <span className="text-[10px] text-gray-500 uppercase">
          {item.category?.manufacturer?.name} / {item.category?.manufacturer?.section?.name}
        </span>
      </div>
    )},
    { header: "Tags", accessorKey: "tags", cell: (item: any) => (
      <div className="flex flex-wrap gap-1 max-w-[150px]">
        {item.tags.map((tag: string) => (
          <span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    )},
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
          <h1 className="text-3xl font-bold text-white">Comandos</h1>
          <p className="text-gray-400">Gerencie a base de comandos do NOCPedia</p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}>
          <Plus size={18} className="mr-2" />
          Novo Comando
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading}
        onSearch={setSearch}
        searchPlaceholder="Buscar por título, tags ou descrição..."
        pagination={{
          page,
          pageSize: 20,
          totalCount,
          onPageChange: setPage
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Editar Comando" : "Novo Comando"}
        className="max-w-4xl"
      >
        <CommandForm 
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
