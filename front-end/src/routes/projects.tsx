import { Button } from "@/components/base/Button";
import { useState } from "react";
import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, TrendingUp, ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { NewProjectCard } from "@/components/projects/NewProjectCard";
import { ProjectDetailModal } from "@/components/modal/layout/ProjectDetailModal";
import { NewProjectModal } from "@/components/modal/layout/NewProjectModal";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";

import { useProjects } from "@/hooks/api/useProjects";
import type { Project as APIProject } from "@/types/api";

interface UIProject {
  id: string;
  status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";
  title: string;
  subtitle: string;
  department: string;
  scope: string;
  team: { name: string; role: string; avatar: string }[];
  financials: {
    totalCost: string;
    burnRate: string;
    burnRatePercent: number;
    allocatedHours: string;
    consumedHours: string;
    infrastructureFee: string;
  };
  milestones: { title: string; completed: boolean }[];
  activities: {
    title: string;
    time: string;
    user: string;
    type: "success" | "info" | "neutral";
  }[];
  avatars: string[];
  mmCost: string;
  progress: number;
  period: string;
  statusText: string;
  statusIcon: ReactNode;
  periodIcon: ReactNode;
  variant: "secondary" | "error" | "primary" | "neutral";
  isAtRisk: boolean;
}

export const Route = createFileRoute("/projects")({
  component: Projects,
});

function Projects() {
  const [selectedProject, setSelectedProject] = useState<UIProject | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

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

      return {
        id: p.id,
        status: finalStatus,
        title: p.title,
        subtitle: p.description || "No description",
        department: "Software Engineering", // 임시
        scope: p.description || "Project details from API",
        team:
          p.assignments?.map((a) => ({
            name: a.user?.name || "Unknown",
            role: a.role,
            avatar: a.user?.avatarUrl || "",
          })) || [],
        financials: {
          totalCost: `$${p.budget.toLocaleString()}`,
          burnRate: "$0",
          burnRatePercent: 0,
          allocatedHours: "0 hrs",
          consumedHours: "0 hrs",
          infrastructureFee: "$0",
        },
        milestones: [],
        activities: [],
        avatars:
          p.assignments?.map((a) => a.user?.avatarUrl || "").filter(Boolean) ||
          [],
        mmCost: `$${(p.budget / 12).toFixed(0)}`,
        progress: Math.min(100, Math.max(10, (p.budget % 80) + 15)), // 임시
        period: `${new Date(p.startDate).toLocaleDateString()} - ${new Date(p.endDate).toLocaleDateString()}`,
        statusText: p.status === "Active" ? "On Track" : p.status,
        statusIcon: <TrendingUp className="w-4 h-4" />,
        periodIcon: <Calendar className="w-4 h-4" />,
        variant: (p.status === "At Risk"
          ? "error"
          : p.status === "Completed"
            ? "primary"
            : "secondary") as "secondary" | "error" | "primary" | "neutral",
        isAtRisk: p.status === "At Risk",
      };
    }) || [];

  const filteredProjects = mappedProjects.filter(
    (p) => activeFilter === "ALL" || p.status === activeFilter,
  );

  if (isLoading) return <div className="p-6">Loading projects...</div>;
  if (error)
    return <div className="p-6 text-error">Error loading projects</div>;

  const handleCardClick = (project: UIProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: "Projects" }]} />

      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-display-lg text-on-surface mb-1">
            Project Portfolio
          </h2>
          <p className="text-on-surface-variant text-body-md">
            Managing 12 active infrastructure deployments across 4 regions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container-low border border-outline-variant rounded p-1">
            {["ALL", "ACTIVE", "ON HOLD"].map((filter) => (
              <Button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 text-label-caps font-bold rounded transition-colors tracking-widest",
                  activeFilter === filter
                    ? "bg-primary-container/20 text-primary"
                    : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
          <select className="bg-surface-container-low border border-outline-variant text-on-surface text-label-md rounded px-3 py-2 outline-none focus:border-primary">
            <option>All Departments</option>
            <option>Network Ops</option>
            <option>Cloud Infrastructure</option>
            <option>Cyber Security</option>
          </select>
          <Button className="flex items-center gap-2 text-on-surface-variant transition-all px-2 py-2 rounded cursor-pointer hover:bg-interaction-hover hover:text-on-surface active:bg-interaction-pressed active:scale-90">
            <ListFilter className="w-5 h-5" />
          </Button>
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
        <Button variant="glass" className=" px-6">
          View More Projects
          <ChevronDown className="w-4 h-4" />
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
