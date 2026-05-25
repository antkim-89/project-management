import { Button } from "@/components/base/Button";
import React from "react";
import { MapPin, Star, Zap, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";

export interface ResourceCardProps {
  name: string;
  role: string;
  avatar: string;
  cost: string;
  location: string;
  skills: string[];
  status: "available" | "on-project" | "on-leave";
  matchScore?: number;
  availableDate?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  name,
  role,
  avatar,
  cost,
  location,
  skills,
  status,
  matchScore,
  availableDate,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-secondary";
      case "on-project":
        return "bg-primary";
      case "on-leave":
        return "bg-error";
      default:
        return "bg-outline";
    }
  };

  const getMatchIcon = () => {
    if (matchScore && matchScore >= 90)
      return <Star size={14} fill="currentColor" />;
    if (matchScore && matchScore >= 80)
      return <Zap size={14} fill="currentColor" />;
    return <History size={14} />;
  };

  const getMatchLabel = () => {
    if (matchScore && matchScore >= 90) return "Top Match";
    if (matchScore && matchScore >= 80) return "Strong";
    return "Fair";
  };

  return (
    <GlassCard className="rounded-xl overflow-hidden flex flex-col relative p-0 border-0">
      {matchScore && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-secondary-container/20 border border-secondary text-secondary px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
            {getMatchIcon()}
            <span className="font-mono text-[12px] font-bold">
              {matchScore} pts - {getMatchLabel()}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 flex gap-4">
        <div className="relative shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-xl object-cover border border-outline-variant shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl border border-outline-variant shadow-sm bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-xl">
              {name.charAt(0)}
            </div>
          )}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 border-4 border-background rounded-full",
              getStatusColor(),
            )}
            title={status.replace("-", " ")}
          ></div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-on-surface leading-tight">
                {name}
              </h4>
              <p className="text-primary text-[11px] font-bold uppercase tracking-wider">
                {role}
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-[11px] font-bold uppercase">
                M/M Cost
              </p>
              <p className="font-mono text-on-surface">{cost}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-medium border border-outline-variant/30 text-on-surface-variant"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-outline-variant/20 p-4 flex items-center justify-between bg-surface-container-highest/30">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MapPin size={16} />
          <span className="text-xs">{location}</span>
        </div>

        {status === "on-leave" ? (
          <div className="text-[11px] font-bold text-error uppercase">
            Available {availableDate}
          </div>
        ) : (
          <Button variant="primary" size="sm">
            Assign to Project
          </Button>
        )}
      </div>
    </GlassCard>
  );
};
