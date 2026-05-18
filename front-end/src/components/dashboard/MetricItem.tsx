
import { cn } from "@/lib/utils";

interface MetricItemProps {
  label: string;
  value: string;
  color: string;
}

export function MetricItem({ label, value, color }: MetricItemProps) {
  return (
    <div className="flex justify-between items-center text-body-sm">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
      <span className="font-mono font-bold text-on-surface">{value}</span>
    </div>
  );
}
