"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
}

export const CopyButton = ({ value, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-[#00d4aa] px-3 py-1.5 text-sm font-medium text-[#0f1117] hover:bg-[#00b38f] transition-all active:scale-95",
        className
      )}
    >
      {copied ? (
        <>
          <Check size={16} />
          Copiado!
        </>
      ) : (
        <>
          <Copy size={16} />
          Copiar
        </>
      )}
    </button>
  );
};
