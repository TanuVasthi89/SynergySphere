import { cn } from "@/lib/utils";

export type Priority = "low" | "medium" | "high";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig = {
  low: {
    label: "Low",
    className: "bg-priority-low text-white",
  },
  medium: {
    label: "Medium", 
    className: "bg-priority-medium text-white",
  },
  high: {
    label: "High",
    className: "bg-priority-high text-white",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}