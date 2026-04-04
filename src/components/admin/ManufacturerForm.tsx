"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const manufacturerSchema = z.object({
  sectionId: z.string().min(1, "Seção é obrigatória"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type ManufacturerFormValues = z.infer<typeof manufacturerSchema>;

interface ManufacturerFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const ManufacturerForm = ({ initialData, onSuccess }: ManufacturerFormProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManufacturerFormValues>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: initialData || {
      order: 0,
      active: true,
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      setSections(data);
    };
    fetchSections();
  }, []);

  const onSubmit = async (values: ManufacturerFormValues) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/manufacturers/${initialData.id}` : "/api/admin/manufacturers";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erro ao salvar fabricante");

      toast.success(initialData ? "Fabricante atualizado!" : "Fabricante criado!");
      onSuccess();
    } catch (err) {
      toast.error("Erro ao salvar fabricante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">Seção</label>
        <select
          {...register("sectionId")}
          className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1a1a2e] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
        >
          <option value="">Selecione...</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.sectionId && <p className="text-xs text-red-500">{errors.sectionId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome" {...register("name")} error={errors.name?.message} />
        <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
      </div>
      <Input label="Descrição" {...register("description")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Logo URL" {...register("logoUrl")} />
        <Input label="Ordem" type="number" {...register("order")} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} id="active" className="rounded border-gray-700 bg-[#1a1a2e] text-[#00d4aa] focus:ring-[#00d4aa]" />
        <label htmlFor="active" className="text-sm text-gray-300">Ativo</label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={loading}>
          {initialData ? "Salvar Alterações" : "Criar Fabricante"}
        </Button>
      </div>
    </form>
  );
};
