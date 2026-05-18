import { Button } from "@/components/base/Button";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { UserLeaveView } from "@/components/calendar/UserLeaveView";
import { TaskCalendarView } from "@/components/calendar/TaskCalendarView";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [activeTab, setActiveTab] = useState("Week");
  const [viewMode, setViewMode] = useState<"TASKS" | "PROJECTS" | "LEAVE">(
    "TASKS",
  );

  const projectList = [
    {
      id: "8821",
      status: "ACTIVE" as const,
      title: "Global Data Migration",
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDlPCKzEd8otqFQLZNnxb3HgTi2hX6nNWyYSAeIvYqee_WzpMvOrSrK8dj9pakQMpI4G1MzOxqHW-K6xoRZNIvhfqPWkwltLum_23u9KhP1UZseaVofWymgt9hEjH-vlia1jX9_DCezC0butlTIfpEy5cLDLkHrPUIRk7nmxKvlM9L1uzao-D3weM0E8CkUHBnQc7L_iGfdmHY9Keohh7ywIBIZQNdeXMEZt-d8lUT7LqOrfs1OpnLWPwjQzUFDRTLM3sRh4al82fs",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAv0g9nNDhpuagyFX_JDsm2Xk31wQdB34kYj0HLv9fZdd8urnCbX8NNzphCAFzuEcg8PGpQcEGBeMFWaEaDnh0qtrpS2kQBN58c7tTx9w7EsHCfA41gv-3dz5cv9FHtvBzQl2fR9ehJ50a5UhYm9-vLb4F_lHUq0HEr_OQWqoC_jPAws4fYl46MevLdisr3rPoDe56NJsf9NP5vpe_9KJ1j_qqagGNogK_23NCJZyVAU2QScWjA-Plw8GzFjBClPmoOuvVChH3af78",
      ],
      avatarMore: 3,
      progress: 68,
      variant: "secondary",
    },
    {
      id: "9014",
      status: "AT RISK" as const,
      title: "Quantum Security Patch",
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBpKuSw843oBbZt61M5aIQNjKm9IrnpoHBOnQ8oMxe69oofVofrjhsZIyEmKRQ9Q4bHlGwb1nuf1FUQIAsLov1Yjsp-Gw1C_GSr9e8OCUztfDeRrV1-PJrn3WtCW5kmHpybrMD2SnJtdxLotiV18qlGDuYW5R2yNJEA3mbcclEbbE6bcIw8GHqBT7vXGH_bx9dpLrj6FKRyDPNyj_SHlH-AWLtU7JwHiUjhgQYEtvNbviDAMAYVAH5LBW9izjnAcPj8lZFWsoHWC2M",
      ],
      avatarMore: 1,
      progress: 32,
      variant: "error",
    },
    {
      id: "7220",
      status: "COMPLETED" as const,
      title: "Server Refresh Ph.1",
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCEQKD6t6VJDcLrcHz_3K4jLMASEU3Z5UsFS_gp4GTFG2J3WsXOPYRrpCc3I9J2U6iBIJAzrKZORt0u0KUgizvlkCwHH6dkL1oFneZVTf9X0nDuSZ95A93zIadIeEVQgTmQD_IdLzEioCZcLuYH0ktN7q7_nOEk2vkbsyAad9NhhbR5hpLeHJ_Ge9z6PgCP1n7D7njcjUtLVcE5LnJOXix56-T5yICNgMJnUtV9TrxIWmUHCkg3ztiz4eNYIuJs0It2JCcg1Gxtu6w",
      ],
      progress: 100,
      variant: "primary",
    },
  ];

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
          <Button variant="glass" className=" px-4">
            <Download className="w-4 h-4" />
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
