"use client";

import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { Terminal, Cpu, Tag } from "lucide-react";

interface CommandCardProps {
  command: {
    id: string;
    title: string;
    description?: string | null;
    code: string;
    platform?: string | null;
    version?: string | null;
    tags: string[];
    notes?: string | null;
  };
}

export const CommandCard = ({ command }: CommandCardProps) => {
  return (
    <div className="group overflow-hidden rounded-lg border border-gray-800 bg-[#1a1a2e] transition-all hover:border-[#00d4aa]/50 shadow-lg">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white group-hover:text-[#00d4aa] transition-colors flex items-center gap-2">
              <Terminal size={18} className="text-[#00d4aa]" />
              {command.title}
            </h3>
            {command.description && (
              <p className="text-sm text-gray-400 leading-relaxed">
                {command.description}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <pre className="overflow-x-auto rounded-md bg-[#0d1117] p-4 font-mono text-sm text-gray-300 border border-gray-800 scrollbar-thin scrollbar-thumb-gray-700">
            <code>{command.code}</code>
          </pre>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton value={command.code} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {command.platform && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Cpu size={14} />
                <span>Platform: <span className="text-gray-300">{command.platform}</span></span>
              </div>
            )}
            {command.version && (
              <Badge variant="outline" className="text-[10px]">v{command.version}</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {command.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-1 text-[10px] text-[#00d4aa] bg-[#00d4aa]/5 px-2 py-0.5 rounded border border-[#00d4aa]/10">
                <Tag size={10} />
                {tag}
              </div>
            ))}
          </div>
        </div>

        {command.notes && (
          <div className="mt-2 rounded bg-yellow-500/5 p-3 border-l-2 border-yellow-500/50">
            <p className="text-xs text-yellow-500/80 italic">
              <strong>Nota:</strong> {command.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
