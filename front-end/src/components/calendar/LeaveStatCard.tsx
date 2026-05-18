import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";

interface LeaveStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "error" | "neutral";
}

export const LeaveStatCard: React.FC<LeaveStatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "primary",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "text-secondary bg-secondary/10 border-secondary/20";
      case "error":
        return "text-error bg-error/10 border-error/20";
      case "neutral":
        return "text-on-surface-variant bg-surface-container-high border-outline-variant";
      default:
        return "text-primary bg-primary/10 border-primary/20";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "secondary":
        return "text-secondary";
      case "error":
        return "text-error";
      case "neutral":
        return "text-on-surface-variant";
      default:
        return "text-primary";
    }
  };

  return (
    <GlassCard className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            getVariantStyles().split(" ").slice(1).join(" "),
          )}
        >
          <Icon className={cn("w-5 h-5", getIconColor())} />
        </div>
        {description && (
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {description}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-mono font-bold text-on-surface">
          {value}
        </h3>
      </div>
    </GlassCard>
  );
};
