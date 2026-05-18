import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";

interface Project {
  id: string;
  status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";
  title: string;
  avatars: string[];
  avatarMore?: number;
  progress: number;
  variant: string;
}

interface ProjectTimelineProps {
  projects: Project[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projects,
}) => {
  // Mock dates for the header
  const dates = [
    { day: "MON", date: "15", isToday: true },
    { day: "TUE", date: "16" },
    { day: "WED", date: "17" },
    { day: "THU", date: "18" },
    { day: "FRI", date: "19" },
    { day: "SAT", date: "20", isWeekend: true },
    { day: "SUN", date: "21", isWeekend: true },
    { day: "MON", date: "22" },
    { day: "TUE", date: "23" },
    { day: "WED", date: "24" },
  ];

  // Mock positions for the bars (in pixels, 80px per day)
  const getBarProps = (index: number, status: string) => {
    const offsets = [0, 80, 240, 0, 160];
    const widths = [480, 600, 320, 240, 400];

    return {
      left: offsets[index % offsets.length],
      width: widths[index % widths.length],
      statusStyles:
        status === "ACTIVE"
          ? "bg-secondary/20 text-secondary border-secondary/30"
          : status === "AT RISK"
            ? "bg-error/20 text-error border-error/30"
            : status === "COMPLETED"
              ? "bg-primary/20 text-primary border-primary/30"
              : "bg-on-surface-variant/20 text-on-surface-variant border-on-surface-variant/30",
    };
  };

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col min-h-[400px]">
      <div className="flex border-b border-outline-variant/30 sticky top-0 bg-surface-container/60 backdrop-blur-md z-20">
        <div className="w-[280px] p-6 border-r border-outline-variant/30 flex items-center">
          <span className="text-label-caps font-bold text-on-surface-variant tracking-widest">
            Active Projects
          </span>
        </div>
        <div className="flex-1 flex overflow-x-auto">
          {dates.map((d, i) => (
            <div
              key={i}
              className={cn(
                "min-w-[80px] h-[72px] flex flex-col items-center justify-center border-r border-outline-variant/10",
                d.isToday && "bg-primary-container/10 relative",
                d.isWeekend && "bg-surface-container-low",
              )}
            >
              {d.isToday && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              )}
              <span className="text-[10px] font-bold text-on-surface-variant tracking-wider">
                {d.day}
              </span>
              <span
                className={cn(
                  "text-lg font-mono font-bold mt-0.5",
                  d.isToday ? "text-primary" : "text-on-surface",
                )}
              >
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {projects.map((project, idx) => {
          const { left, width, statusStyles } = getBarProps(
            idx,
            project.status,
          );
          return (
            <div
              key={project.id}
              className="flex border-b border-outline-variant/10 hover:bg-interaction-hover transition-colors group"
            >
              <div className="w-[280px] p-6 border-r border-outline-variant/30 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-on-surface truncate max-w-[180px]">
                    {project.title}
                  </span>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      project.status === "ACTIVE"
                        ? "bg-secondary shadow-[0_0_8px_var(--color-secondary)]"
                        : project.status === "AT RISK"
                          ? "bg-error shadow-[0_0_8px_var(--color-error)]"
                          : project.status === "COMPLETED"
                            ? "bg-primary"
                            : "bg-on-surface-variant",
                    )}
                  ></div>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant tracking-widest font-mono">
                  CODE: PRJ-{project.id}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex -space-x-1.5">
                    {project.avatars.slice(0, 2).map((avatar, i) => (
                      <img
                        key={i}
                        src={avatar}
                        alt="Team"
                        className="w-5 h-5 rounded-full border border-surface-container object-cover"
                      />
                    ))}
                    {project.avatarMore && (
                      <div className="w-5 h-5 rounded-full bg-surface-container-highest border border-surface-container flex items-center justify-center text-[8px] font-bold text-on-surface">
                        +{project.avatarMore}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-x-auto relative min-h-[100px] items-center p-4">
                <div
                  className={cn(
                    "absolute h-10 rounded-lg border flex items-center px-4 transition-all duration-500",
                    statusStyles,
                  )}
                  style={{ left: `${left + 16}px`, width: `${width}px` }}
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase truncate whitespace-nowrap">
                    {project.status === "ACTIVE"
                      ? `PHASE 1 • ${project.progress}%`
                      : project.status === "AT RISK"
                        ? `CRITICAL • ${project.progress}%`
                        : project.status === "COMPLETED"
                          ? "DELIVERED"
                          : "ON HOLD"}
                  </span>

                  {project.status === "AT RISK" && (
                    <div className="absolute left-[160px] top-0 bottom-0 w-20 flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background:
                            "repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)",
                        }}
                      ></div>
                      <AlertCircle className="w-4 h-4 relative z-10" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
