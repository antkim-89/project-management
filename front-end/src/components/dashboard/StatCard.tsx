import React from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
}

export function StatCard({
  icon,
  label,
  value,
  badge,
  badgeColor,
  borderColor,
}: StatCardProps) {
  return (
    <GlassCard
      className={cn(
        "col-span-12 md:col-span-6 lg:col-span-3 p-6 border-l-4",
        borderColor,
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="w-5 h-5">{icon}</div>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            badgeColor,
          )}
        >
          {badge}
        </span>
      </div>
      <p className="text-on-surface-variant text-label-caps font-bold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-headline-lg font-bold font-mono mt-1 text-on-surface">
        {value}
      </p>
    </GlassCard>
  );
}
