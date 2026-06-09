import { Button } from "@/components/base/Button";
import { useState } from "react";
import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, TrendingUp, ChevronDown, ListFilter } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { NewProjectCard } from "@/components/projects/NewProjectCard";
import { ProjectDetailModal } from "@/components/modal/ProjectDetailModal";
import { NewProjectModal } from "@/components/modal/NewProjectModal";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { Select } from "@/components/base/Select";
import { RadioGroup } from "@/components/base/Radio";
import { useTranslation } from "react-i18next";

import { useProjects } from "@/hooks/api/useProjects";
import type { Project as APIProject, Task } from "@/types/api";

interface UIProject {
  id: string;
  status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";
  title: string;
  subtitle: string;
  department: string;
  scope: string;
  team: { name: string; role: string; avatar: string }[];
  financials: {
    burnRate: string;
    burnRatePercent: number;
    allocatedHours: string;
    consumedHours: string;
    infrastructureFee: string;
    monthlyCost: string;
    estimatedTotalCost: string;
    expectedMargin: string;
    marginPercent: number;
    salePrice: string;
  };
  milestones: { title: string; completed: boolean }[];
  activities: {
    title: string;
    time: string;
    user: string;
    type: "success" | "info" | "neutral";
  }[];
  avatars: string[];
  progress: number;
  period: string;
  startDate: string;
  endDate: string;
  statusText: string;
  statusIcon: ReactNode;
  periodIcon: ReactNode;
  variant: "secondary" | "error" | "primary" | "neutral";
  isAtRisk: boolean;
  tasks: Task[];
}

export const Route = createFileRoute("/projects")({
  component: Projects,
});

function Projects() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<UIProject | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  const { data: projects, isLoading, error } = useProjects();

  // API 데이터를 UI 모델로 변환
  const mappedProjects: UIProject[] =
    projects?.map((p: APIProject) => {
      const statusVal = p.status.toUpperCase();
      const finalStatus = (
        ["ACTIVE", "AT RISK", "COMPLETED", "ON HOLD"].includes(statusVal)
          ? statusVal
          : "ACTIVE"
      ) as "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";

      // 활동(Activities) 동적 매핑
      const rawActivities: {
        title: string;
        date: Date;
        user: string;
        type: "success" | "info" | "neutral";
      }[] = [];

      if (p.createdAt) {
        rawActivities.push({
          title: t("projects.activity.created"),
          date: new Date(p.createdAt),
          user: "System",
          type: "info" as const,
        });
      }

      if (p.assignments && p.assignments.length > 0) {
        p.assignments.forEach((a) => {
          rawActivities.push({
            title: t("projects.activity.memberAssigned", {
              name: a.user?.name || t("projects.unknown"),
              role: a.role,
            }),
            date: new Date(a.startDate || p.startDate),
            user: "HR System",
            type: "neutral" as const,
          });
        });
      }

      if (p.updatedAt && new Date(p.updatedAt).getTime() > new Date(p.createdAt).getTime() + 1000) {
        rawActivities.push({
          title: t("projects.activity.updated"),
          date: new Date(p.updatedAt),
          user: "Manager",
          type: "success" as const,
        });
      }

      // 최신 활동 순 정렬
      rawActivities.sort((actA, actB) => actB.date.getTime() - actA.date.getTime());

      const dynamicActivities = rawActivities.map((act) => ({
        title: act.title,
        time: act.date.toLocaleDateString(),
        user: act.user,
        type: act.type,
      }));

      return {
        id: p.id,
        status: finalStatus,
        title: p.title,
        subtitle: p.description || t("projects.noDescription"),
        department: "Software Engineering", // 임시
        scope: p.description || t("projects.detailsFromAPI"),
        team:
          p.assignments?.map((a) => ({
            name: a.user?.name || t("projects.unknown"),
            role: a.role,
            avatar: a.user?.avatarUrl || "",
          })) || [],
        financials: (() => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          const totalMonths = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
          
          let monthlyTotalCost = 0;
          p.assignments?.forEach((a) => {
            const baseSalary = a.user?.rank?.baseSalary || 0;
            const contribution = a.contributionPercentage || 100;
            monthlyTotalCost += baseSalary * (contribution / 100);
          });
          
          const estimatedTotalCost = monthlyTotalCost * totalMonths;
          const projectPrice = p.price || 0;
          const expectedMargin = Math.max(0, projectPrice - estimatedTotalCost);
          const marginPercent = projectPrice > 0 ? Math.round((expectedMargin / projectPrice) * 100) : 0;
          
          return {
            burnRate: "₩0",
            burnRatePercent: 0,
            allocatedHours: "0 hrs",
            consumedHours: "0 hrs",
            infrastructureFee: "₩0",
            monthlyCost: `₩${monthlyTotalCost.toLocaleString()}`,
            estimatedTotalCost: `₩${estimatedTotalCost.toLocaleString()}`,
            expectedMargin: `₩${expectedMargin.toLocaleString()}`,
            marginPercent,
            salePrice: `₩${projectPrice.toLocaleString()}`,
          };
        })(),
        milestones: [],
        activities: dynamicActivities,
        avatars:
          p.assignments?.map((a) => a.user?.avatarUrl || "").filter(Boolean) ||
          [],
        progress: Math.min(100, Math.max(10, ((p.price || 0) % 80) + 15)), // 임시
        period: `${new Date(p.startDate).toLocaleDateString()} - ${new Date(p.endDate).toLocaleDateString()}`,
        startDate: p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : "",
        endDate: p.endDate ? new Date(p.endDate).toISOString().split("T")[0] : "",
        statusText: p.status === "Active" ? t("projects.status.onTrack") : p.status,
        statusIcon: <TrendingUp className="w-4 h-4" />,
        periodIcon: <Calendar className="w-4 h-4" />,
        variant: (p.status === "At Risk"
          ? "error"
          : p.status === "Completed"
            ? "primary"
            : "secondary") as "secondary" | "error" | "primary" | "neutral",
        isAtRisk: p.status === "At Risk",
        tasks: p.tasks || [],
      };
    }) || [];

  const filteredProjects = mappedProjects.filter((p) => {
    const matchesFilter = activeFilter === "ALL" || p.status === activeFilter;
    const matchesDept = selectedDept === "All Departments" || p.department === selectedDept;
    return matchesFilter && matchesDept;
  });

  if (isLoading) return <div className="p-6">{t("projects.loading")}</div>;
  if (error)
    return <div className="p-6 text-error">{t("projects.error")}</div>;

  const handleCardClick = (project: UIProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: t("common.projects") }]} />

      {/* Page Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 border-b border-outline-variant/30 pb-6">
        <div>
          <h2 className="font-bold text-display-lg text-on-surface mb-1">
            {t("projects.portfolio")}
          </h2>
          <p className="text-on-surface-variant text-body-md">
            {t("projects.subtitle")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
          <div className="max-w-full overflow-x-auto scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="inline-flex min-w-full sm:min-w-0">
              <RadioGroup
                name="project-filter"
                variant="segmented"
                options={[
                  { value: "ALL", label: t("projects.all") },
                  { value: "ACTIVE", label: t("projects.active") },
                  { value: "AT RISK", label: t("projects.atRisk") },
                  { value: "COMPLETED", label: t("projects.completed") },
                  { value: "ON HOLD", label: t("projects.onHold") },
                ]}
                value={activeFilter}
                onChange={setActiveFilter}
                className="shrink-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Select
              value={selectedDept}
              onChange={setSelectedDept}
              options={[
                { value: "All Departments", label: t("projects.allDepts") },
                { value: "Software Engineering", label: t("projects.softwareEng") },
                { value: "Network Ops", label: t("projects.networkOps") },
                { value: "Cloud Infrastructure", label: t("projects.cloudInfra") },
                { value: "Cyber Security", label: t("projects.cyberSec") },
              ]}
              className="min-w-[180px] flex-1 sm:flex-initial"
            />
            <button className="flex items-center justify-center gap-2 text-on-surface-variant transition-all p-2.5 rounded-xl border border-outline-variant/50 cursor-pointer hover:bg-interaction-hover hover:text-on-surface active:bg-interaction-pressed active:scale-95 bg-surface-container-low">
              <ListFilter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index: number) => (
          <ProjectCard
            key={index}
            {...project}
            onClick={() => handleCardClick(project)}
          />
        ))}

        {/* Placeholder: New Project Card */}
        <NewProjectCard onClick={() => setIsNewProjectModalOpen(true)} />
      </div>

      {/* Pagination/Load More */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="glass"
          suffixIcon={<ChevronDown className="w-4 h-4" />}
        >
          {t("projects.viewMore")}
        </Button>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
      />

      {/* Initiate New Project Modal */}
      <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
