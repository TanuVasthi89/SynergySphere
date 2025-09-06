import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function Tag({ children, variant = "default", className }: TagProps) {
  const variants = {
    default: "bg-accent text-accent-foreground",
    secondary: "bg-secondary/20 text-secondary",
    outline: "border border-border text-muted-foreground bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}