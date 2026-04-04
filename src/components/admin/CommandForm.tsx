"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const commandSchema = z.object({
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  code: z.string().min(1, "Código é obrigatório"),
  language: z.string().default("bash"),
  platform: z.string().optional(),
  version: z.string().optional(),
  tags: z.string().transform(val => val.split(",").map(t => t.trim()).filter(Boolean)),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

type CommandFormValues = z.infer<typeof commandSchema>;

interface CommandFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const CommandForm = ({ initialData, onSuccess }: CommandFormProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CommandFormValues>({
    resolver: zodResolver(commandSchema),
    defaultValues: initialData ? {
      ...initialData,
      tags: initialData.tags.join(", "),
    } : {
      language: "bash",
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

  useEffect(() => {
    if (selectedSection) {
      const fetchManufacturers = async () => {
        const res = await fetch(`/api/admin/manufacturers?sectionId=${selectedSection}`);
        const data = await res.json();
        setManufacturers(data);
      };
      fetchManufacturers();
    } else {
      setManufacturers([]);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedManufacturer) {
      const fetchCategories = async () => {
        const res = await fetch(`/api/admin/categories?manufacturerId=${selectedManufacturer}`);
        const data = await res.json();
        setCategories(data);
      };
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [selectedManufacturer]);

  const onSubmit = async (values: CommandFormValues) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/commands/${initialData.id}` : "/api/admin/commands";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erro ao salvar comando");

      toast.success(initialData ? "Comando atualizado!" : "Comando criado!");
      onSuccess();
    } catch (err) {
      toast.error("Erro ao salvar comando");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Seção</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1a1a2e] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
          >
            <option value="">Selecione...</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Fabricante</label>
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            disabled={!selectedSection}
            className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1a1a2e] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa] disabled:opacity-50"
          >
            <option value="">Selecione...</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Categoria</label>
          <select
            {...register("categoryId")}
            disabled={!selectedManufacturer}
            className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1a1a2e] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa] disabled:opacity-50"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
        </div>
      </div>

      <Input label="Título" {...register("title")} error={errors.title?.message} />
      <Input label="Descrição" {...register("description")} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">Código</label>
        <textarea
          {...register("code")}
          className="flex min-h-[150px] w-full rounded-md border border-gray-700 bg-[#0d1117] px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
          placeholder="Digite o comando aqui..."
        />
        {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Linguagem" {...register("language")} />
        <Input label="Plataforma" {...register("platform")} />
        <Input label="Versão" {...register("version")} />
      </div>

      <Input label="Tags (separadas por vírgula)" {...register("tags")} />
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">Notas</label>
        <textarea
          {...register("notes")}
          className="flex min-h-[80px] w-full rounded-md border border-gray-700 bg-[#1a1a2e] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} id="active" className="rounded border-gray-700 bg-[#1a1a2e] text-[#00d4aa] focus:ring-[#00d4aa]" />
        <label htmlFor="active" className="text-sm text-gray-300">Ativo</label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={loading}>
          {initialData ? "Salvar Alterações" : "Criar Comando"}
        </Button>
      </div>
    </form>
  );
};
