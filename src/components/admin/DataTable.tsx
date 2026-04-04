"use client";

import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey: keyof T | string;
    cell?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  pagination,
  onSearch,
  searchPlaceholder = "Buscar...",
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}

      <div className="rounded-md border border-gray-800 bg-[#1a1a2e] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0f1117] text-gray-400 font-medium border-b border-gray-800">
            <tr>
              {columns.map((column, i) => (
                <th key={i} className="px-6 py-4">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-800 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  {columns.map((column, j) => (
                    <td key={j} className="px-6 py-4 text-gray-300">
                      {column.cell ? column.cell(item) : (item[column.accessorKey as keyof T] as any)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Total de {pagination.totalCount} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-gray-400 px-2">
              Página {pagination.page} de {Math.ceil(pagination.totalCount / pagination.pageSize)}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.totalCount / pagination.pageSize)}
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(Math.ceil(pagination.totalCount / pagination.pageSize))}
              disabled={pagination.page >= Math.ceil(pagination.totalCount / pagination.pageSize)}
            >
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
