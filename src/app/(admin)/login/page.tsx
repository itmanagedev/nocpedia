"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas ou usuário inativo.");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-[#1a1a2e] p-8 rounded-xl border border-gray-800 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-[#00d4aa]/10 rounded-lg text-[#00d4aa] mb-4">
          <Terminal size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white">NOCPedia Admin</h1>
        <p className="text-gray-400 text-sm">Entre com suas credenciais para acessar o painel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-[38px] -translate-y-1/2 text-gray-500" size={18} />
            <Input
              label="Email"
              type="email"
              placeholder="admin@nocpedia.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-[38px] -translate-y-1/2 text-gray-500" size={18} />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={loading}>
          Entrar no Painel
        </Button>
      </form>

      <div className="text-center">
        <button 
          onClick={() => router.push("/")}
          className="text-xs text-gray-500 hover:text-[#00d4aa] transition-colors"
        >
          Voltar para área pública
        </button>
      </div>
    </div>
  );
}
