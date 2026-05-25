import { Button } from "@/components/base/Button";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { UserLeaveView } from "@/components/calendar/UserLeaveView";
import { TaskCalendarView } from "@/components/calendar/TaskCalendarView";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";

import { useProjects } from "@/hooks/api/useProjects";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [activeTab, setActiveTab] = useState("Week");
  const [viewMode, setViewMode] = useState<"TASKS" | "PROJECTS" | "LEAVE">(
    "TASKS",
  );

  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-on-surface-variant animate-fade-in">
        Loading calendar data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 text-error flex items-center justify-center animate-fade-in">
        Error loading calendar data.
      </div>
    );
  }

  const projectList = projects?.map((p) => {
    const statusVal = p.status.toUpperCase();
    const finalStatus = (
      ["ACTIVE", "AT RISK", "COMPLETED", "ON HOLD"].includes(statusVal)
        ? statusVal
        : "ACTIVE"
    ) as "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";

    const avatars = p.assignments?.map((a) => a.user?.avatarUrl || "").filter(Boolean) || [];
    const avatarMore = avatars.length > 2 ? avatars.length - 2 : 0;

    // progress 동적 계산: (오늘 - 시작일) / (종료일 - 시작일) * 100
    const start = new Date(p.startDate).getTime();
    const end = new Date(p.endDate).getTime();
    const now = new Date().getTime();
    let progress = 0;
    if (end > start) {
      progress = Math.min(
        100,
        Math.max(0, Math.round(((now - start) / (end - start)) * 100))
      );
    } else if (now >= start) {
      progress = 100;
    }

    const variant =
      finalStatus === "ACTIVE"
        ? "secondary"
        : finalStatus === "AT RISK"
          ? "error"
          : finalStatus === "COMPLETED"
            ? "primary"
            : "neutral";

    return {
      id: p.id,
      status: finalStatus,
      title: p.title,
      avatars: avatars,
      avatarMore: avatarMore,
      progress,
      variant,
      startDate: p.startDate,
      endDate: p.endDate,
    };
  }) || [];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: "Calendar" }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
        <div>
          <h2 className="font-bold text-display-lg text-on-surface mb-1">
            {viewMode === "TASKS"
              ? "Task Schedule Calendar"
              : viewMode === "PROJECTS"
                ? "Timeline Availability"
                : "Leave Management"}
          </h2>
          <p className="text-on-surface-variant text-body-md">
            {viewMode === "TASKS"
              ? "프로젝트별 마감일을 한눈에 확인하고 협업 효율을 극대화하세요."
              : viewMode === "PROJECTS"
                ? "Real-time resource allocation and project roadmap synchronization."
                : "Monitor personnel availability and manage leave requests."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {viewMode !== "TASKS" && (
            <div className="flex items-center bg-surface-container-low border border-outline-variant rounded p-1">
              {["Week", "Month", "Quarter"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 text-label-caps font-bold rounded transition-colors tracking-widest cursor-pointer",
                    activeTab === tab
                      ? "bg-primary-container/20 text-primary"
                      : "text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
          <Button
            variant="glass"
            prefixIcon={<Download className="w-4 h-4" />}
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-4 border-b border-outline-variant/30 mb-8 shrink-0">
        <button
          onClick={() => setViewMode("TASKS")}
          className={cn(
            "pb-4 text-label-md font-bold uppercase tracking-widest transition-all relative cursor-pointer",
            viewMode === "TASKS"
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          할 일 일정 (Tasks)
          {viewMode === "TASKS" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-zoom-in" />
          )}
        </button>
        <button
          onClick={() => setViewMode("PROJECTS")}
          className={cn(
            "pb-4 text-label-md font-bold uppercase tracking-widest transition-all relative cursor-pointer",
            viewMode === "PROJECTS"
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          프로젝트 일정 (Timeline)
          {viewMode === "PROJECTS" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-zoom-in" />
          )}
        </button>
        <button
          onClick={() => setViewMode("LEAVE")}
          className={cn(
            "pb-4 text-label-md font-bold uppercase tracking-widest transition-all relative cursor-pointer",
            viewMode === "LEAVE"
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          휴가 현황 (Leaves)
          {viewMode === "LEAVE" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-zoom-in" />
          )}
        </button>
      </div>

      {viewMode === "TASKS" ? (
        <TaskCalendarView />
      ) : viewMode === "PROJECTS" ? (
        <ProjectTimeline projects={projectList} />
      ) : (
        <UserLeaveView />
      )}
    </div>
  );
}
