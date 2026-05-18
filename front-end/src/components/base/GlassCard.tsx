import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

/**
 * A reusable glassmorphism card component.
 * Uses the global .glass-card utility defined in index.css.
 */
export const GlassCard = ({
  children,
  className,
  hoverable = true,
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-card rounded",
        !hoverable &&
          "hover:border-outline-variant/30 hover:bg-surface-container/40",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
