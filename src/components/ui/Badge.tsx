import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "success" | "warning";
  className?: string;
}

export const Badge = ({ children, variant = "primary", className }: BadgeProps) => {
  const variants = {
    primary: "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/20",
    secondary: "bg-gray-700 text-gray-100 border-gray-600",
    outline: "bg-transparent text-gray-300 border-gray-700",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
