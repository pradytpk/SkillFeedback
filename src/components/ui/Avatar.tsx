import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export default function Avatar({ name, color = "#6366f1", size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
