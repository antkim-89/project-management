
import { cn } from "@/lib/utils";

interface MilestoneItemProps {
  name: string;
  time: string;
  color: string;
}

export function MilestoneItem({ name, time, color }: MilestoneItemProps) {
  return (
    <div className="flex gap-3 items-center p-2 rounded-xl bg-surface-container-high/50 border border-outline-variant/30">
      <div className={cn("w-1 h-8 rounded-full", color)} />
      <div>
        <p className="text-sm font-bold text-on-surface">{name}</p>
        <p className="text-[10px] text-on-surface-variant">
          {time} • Conference Room A
        </p>
      </div>
    </div>
  );
}
