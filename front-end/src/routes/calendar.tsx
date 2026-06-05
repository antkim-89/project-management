import { Button } from "@/components/base/Button";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";

import { TaskCalendarView } from "@/components/calendar/TaskCalendarView";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";

import { useProjects } from "@/hooks/api/useProjects";
import { useTasks } from "@/hooks/api/useTasks";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Week");
  const [viewMode, setViewMode] = useState<"TASKS" | "PROJECTS">(
    "TASKS",
  );

  const { data: projects, isLoading: isProjectsLoading, error: projectsError } = useProjects();
  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useTasks();

  const isLoading = isProjectsLoading || isTasksLoading;
  const error = projectsError || tasksError;

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-on-surface-variant animate-fade-in">
        {t("calendar.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 text-error flex items-center justify-center animate-fade-in">
        {t("calendar.error")}
      </div>
    );
  }

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

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

    // 해당 프로젝트에 할당된 할 일 정보 가공
    const projectTasks = tasks?.filter((t) => t.projectId === p.id) || [];
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter((t) => t.status === "DONE").length;
    const inProgressTasks = projectTasks.filter((t) => t.status === "IN_PROGRESS").length;
    const overdueTasks = projectTasks.filter((t) => {
      if (t.status === "DONE") return false;
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < todayMidnight;
    }).length;

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
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
    };
  }) || [];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: t("common.calendar") }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
        <div>
          <h2 className="font-bold text-display-lg text-on-surface mb-1">
            {viewMode === "TASKS"
              ? t("calendar.taskScheduleTitle")
              : t("calendar.timelineTitle")}
          </h2>
          <p className="text-on-surface-variant text-body-md">
            {viewMode === "TASKS"
              ? t("calendar.taskScheduleSubtitle")
              : t("calendar.timelineSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {viewMode !== "TASKS" && (
            <div className="flex items-center bg-surface-container-low border border-outline-variant rounded p-1">
              {["Week", "Month"].map((tab) => (
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
                  {tab === "Week" ? t("calendar.week") : t("calendar.month")}
                </button>
              ))}
            </div>
          )}
          <Button
            variant="glass"
            prefixIcon={<Download className="w-4 h-4" />}
          >
            {t("calendar.exportData")}
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
          {t("calendar.tabTasks")}
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
          {t("calendar.tabTimeline")}
          {viewMode === "PROJECTS" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-zoom-in" />
          )}
        </button>

      </div>

      {viewMode === "TASKS" ? (
        <TaskCalendarView />
      ) : (
        <ProjectTimeline projects={projectList} viewTab={activeTab as "Week" | "Month"} />
      )}
    </div>
  );
}
