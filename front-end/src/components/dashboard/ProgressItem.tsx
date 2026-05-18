
import { cn } from "@/lib/utils";

interface ProgressItemProps {
  name: string;
  percent: number;
  color: string;
}

export function ProgressItem({ name, percent, color }: ProgressItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-label-md font-bold text-on-surface">{name}</span>
        <span
          className={cn(
            "font-mono text-label-md font-bold",
            percent > 80 ? "text-emerald-400" : "text-on-surface",
          )}
        >
          {percent}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            color,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
