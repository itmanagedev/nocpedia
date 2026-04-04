"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"]),
  active: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const UserForm = ({ initialData, onSuccess }: UserFormProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ? {
      ...initialData,
      password: "",
    } : {
      role: "VIEWER",
      active: true,
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/users/${initialData.id}` : "/api/admin/users";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erro ao salvar usuário");

      toast.success(initialData ? "Usuário atualizado!" : "Usuário criado!");
      onSuccess();
    } catch (err) {
      toast.error("Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome" {...register("name")} error={errors.name?.message} />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input 
        label={initialData ? "Senha (deixe em branco para manter)" : "Senha"} 
        type="password" 
        {...register("password")} 
        error={errors.password?.message} 
      />
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">Role</label>
        <select
          {...register("role")}
          className="flex h-10 w-full rounded-md border border-gray-700 bg-[#1a1a2e] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
        >
          <option value="VIEWER">Viewer</option>
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} id="active" className="rounded border-gray-700 bg-[#1a1a2e] text-[#00d4aa] focus:ring-[#00d4aa]" />
        <label htmlFor="active" className="text-sm text-gray-300">Ativo</label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={loading}>
          {initialData ? "Salvar Alterações" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};
