"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { toast } from "sonner";

const sectionSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface SectionFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const SectionForm = ({ initialData, onSuccess }: SectionFormProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: initialData || {
      order: 0,
      active: true,
    },
  });

  const onSubmit = async (values: SectionFormValues) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/sections/${initialData.id}` : "/api/admin/sections";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erro ao salvar seção");

      toast.success(initialData ? "Seção atualizada!" : "Seção criada!");
      onSuccess();
    } catch (err) {
      toast.error("Erro ao salvar seção");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome" {...register("name")} error={errors.name?.message} />
        <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
      </div>
      <Input label="Descrição" {...register("description")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Ícone (Lucide name)" {...register("icon")} />
        <Input label="Ordem" type="number" {...register("order")} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} id="active" className="rounded border-gray-700 bg-[#1a1a2e] text-[#00d4aa] focus:ring-[#00d4aa]" />
        <label htmlFor="active" className="text-sm text-gray-300">Ativo</label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={loading}>
          {initialData ? "Salvar Alterações" : "Criar Seção"}
        </Button>
      </div>
    </form>
  );
};
