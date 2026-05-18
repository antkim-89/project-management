import React from "react";
import { Button } from "@/components/base/Button";
import { CheckCircle2, XCircle } from "lucide-react";

interface TaskItemProps {
  icon: React.ReactNode;
  name: string;
  desc: string;
}

export function TaskItem({ icon, name, desc }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 transition-all rounded cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-label-md font-bold text-on-surface">{name}</p>
          <p className="text-label-sm text-on-surface-variant mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" className="p-2 rounded transition-colors hover:bg-error/10 text-error">
          <XCircle className="w-5 h-5" />
        </Button>
        <Button variant="outline" className="p-2 rounded transition-colors hover:bg-secondary/10 text-secondary">
          <CheckCircle2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
