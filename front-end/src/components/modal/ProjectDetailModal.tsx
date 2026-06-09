import { Button } from "@/components/base/Button";
import React, { useState } from "react";
import {
  X,
  Edit2,
  Share2,
  Check,
  History,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseModal } from "@/components/base/BaseModal";
import { ManageTeamModal } from "@/components/modal/ManageTeamModal";
import { EditProjectModal } from "@/components/modal/EditProjectModal";
import { useTranslation } from "react-i18next";
import type { Task } from "@/types/api";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";
    id: string;
    title: string;
    subtitle: string;
    scope: string;
    startDate: string;
    endDate: string;
    team: { name: string; role: string; avatar: string }[];
    activities: {
      title: string;
      time: string;
      user: string;
      type: "success" | "info" | "neutral";
    }[];
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
    tasks: Task[];
  } | null;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { t } = useTranslation();
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !project) return null;

  const todoTasks = project.tasks?.filter((t) => t.status === "TODO") || [];
  const inProgressTasks = project.tasks?.filter((t) => t.status === "IN_PROGRESS") || [];
  const doneTasks = project.tasks?.filter((t) => t.status === "DONE") || [];

  const renderTaskItems = (tasksList: typeof project.tasks) => {
    if (tasksList.length === 0) {
      return (
        <p className="text-[11px] text-on-surface-variant/40 italic px-2.5 py-3 text-center bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/10">
          {t("projects.detail.noTasksShort")}
        </p>
      );
    }

    const maxDisplay = 3;
    const displayedTasks = tasksList.slice(0, maxDisplay);
    const hasMore = tasksList.length > maxDisplay;
    const moreCount = tasksList.length - maxDisplay;

    return (
      <div className="space-y-2">
        {displayedTasks.map((task) => (
          <div
            key={task.id}
            className="group p-3 rounded-xl bg-surface-container-high/70 border border-outline-variant/15 text-xs text-on-surface font-semibold hover:border-primary/20 hover:bg-surface-container-high hover:shadow-md transition-all duration-200 cursor-default select-none"
          >
            {/* Default: truncated single-line view */}
            <div className="truncate w-full block group-hover:hidden">
              {task.title}
            </div>
            
            {/* Hover: expanded full text view */}
            <div className="hidden group-hover:block whitespace-normal break-words leading-relaxed text-on-surface animate-fade-in">
              {task.title}
            </div>
          </div>
        ))}
        {hasMore && (
          <div className="text-center py-2 text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 border-dashed rounded-xl animate-pulse">
            ... + {moreCount} {t("projects.detail.moreTasks")}
          </div>
        )}
      </div>
    );
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-secondary bg-secondary/10 border-secondary/20 shadow-[0_0_12px_rgba(78,222,163,0.1)]";
      case "AT RISK":
        return "text-error bg-error/10 border-error/20 shadow-[0_0_12px_rgba(255,180,171,0.1)]";
      case "COMPLETED":
        return "text-primary bg-primary/10 border-primary/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]";
      case "ON HOLD":
        return "text-on-surface-variant bg-surface-container-highest border-outline-variant/30";
      default:
        return "";
    }
  };

  const header = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-label-caps font-bold border backdrop-blur-md transition-all",
            getStatusStyles(project.status),
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {project.status}
        </div>
        <span className="text-label-caps font-bold text-on-surface-variant tracking-widest font-mono">
          #{project.id}
        </span>
      </div>
      <h2 className="text-3xl font-bold text-on-surface mt-1">
        {project.title}
      </h2>
      <p className="text-body-md text-on-surface-variant">{project.subtitle}</p>
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2">
        <Button
          variant="glass"
          onClick={() => setIsEditModalOpen(true)}
          className="px-3 h-10 cursor-pointer hover:text-secondary transition-colors"
          prefixIcon={<Edit2 className="w-4 h-4" />}
        />
        <Button
          variant="glass"
          className="px-3 h-10"
          prefixIcon={<Share2 className="w-4 h-4" />}
        />
      </div>
      <Button variant="primary" className=" px-8 h-10">
        View Full Report
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="" // Custom header used instead
      hideHeader={true}
      footer={footer}
      size="xl"
      className="max-h-[90vh]"
    >
      {/* Custom Header Area */}
      <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/50 -mt-6 -mx-6 mb-6">
        <div className="flex justify-between items-start">
          {header}
          <Button
            variant="ghost"
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all"
            onClick={onClose}
            prefixIcon={<X className="w-6 h-6" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-4">
              Project Scope
            </h4>
            <p className="text-body-lg text-on-surface/80 leading-relaxed bg-surface-container-low/30 p-4 rounded-xl border border-outline-variant/10">
              {project.scope}
            </p>
          </section>

          {/* Team */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest">
                Assigned Personnel ({project.team.length})
              </h4>
              <button
                onClick={() => setIsManageTeamOpen(true)}
                className="text-secondary text-label-sm font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 outline-none"
              >
                Manage Team
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-colors group"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-lg object-cover border border-outline-variant group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      {member.name}
                    </p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tasks List */}
          <section>
            <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-4">
              {t("projects.detail.tasksTitle")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* To Do */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/20 shadow-sm">
                <div className="flex justify-between items-center px-1 border-b border-outline-variant/20 pb-2.5 mb-0.5">
                  <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40" />
                    {t("projects.detail.statusTodo")}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-full border border-outline-variant/10">
                    {todoTasks.length}
                  </span>
                </div>
                {renderTaskItems(todoTasks)}
              </div>

              {/* In Progress */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/20 shadow-sm">
                <div className="flex justify-between items-center px-1 border-b border-outline-variant/20 pb-2.5 mb-0.5">
                  <span className="text-[11px] font-bold text-secondary flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {t("projects.detail.statusInProgress")}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                    {inProgressTasks.length}
                  </span>
                </div>
                {renderTaskItems(inProgressTasks)}
              </div>

              {/* Done */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/20 shadow-sm">
                <div className="flex justify-between items-center px-1 border-b border-outline-variant/20 pb-2.5 mb-0.5">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t("projects.detail.statusDone")}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                    {doneTasks.length}
                  </span>
                </div>
                {renderTaskItems(doneTasks)}
              </div>
            </div>
          </section>

          {/* Activity Log */}
          <section>
            <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-4">
              Recent Activity
            </h4>
            <div className="space-y-4">
              {project.activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm",
                      activity.type === "success"
                        ? "bg-secondary/20 text-secondary"
                        : activity.type === "info"
                          ? "bg-primary/20 text-primary"
                          : "bg-on-surface-variant/20 text-on-surface-variant",
                    )}
                  >
                    {activity.type === "success" ? (
                      <Check className="w-4 h-4" />
                    ) : activity.type === "info" ? (
                      <History className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      {activity.title}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {activity.time} · {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Financials & Margin Summary (Right 1/3) */}
        <div className="space-y-6 bg-surface-container-low/40 p-6 rounded-2xl border border-outline-variant/30 h-fit sticky top-0 animate-fade-in">
          <section className="space-y-5">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest">
                Profitability Analysis
              </h4>
              {project.financials.marginPercent < 10 && (
                <span className="text-[10px] font-bold text-error bg-error/10 border border-error/20 px-2.5 py-0.5 rounded animate-pulse">
                  Low Margin
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Sale Price (수주 금액)
                </p>
                <p className="text-xl font-mono font-bold text-on-surface">
                  {project.financials.salePrice}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Est. Manpower Cost (예상 인건비)
                </p>
                <p className="text-xl font-mono font-bold text-on-surface">
                  {project.financials.estimatedTotalCost}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Monthly Manpower Cost (월 인건비)
                </p>
                <p className="text-sm font-mono text-on-surface-variant">
                  {project.financials.monthlyCost} / month
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/10">
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Expected Margin (예상 마진)
                  </p>
                  <p className="text-xs font-mono font-bold text-secondary">
                    {project.financials.marginPercent}%
                  </p>
                </div>
                <p className="text-2xl font-mono font-bold text-secondary mb-3">
                  {project.financials.expectedMargin}
                </p>
                
                {/* Gauge Bar */}
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      project.financials.marginPercent < 10
                        ? "bg-error"
                        : project.financials.marginPercent < 30
                          ? "bg-amber-400"
                          : "bg-secondary"
                    )}
                    style={{ width: `${project.financials.marginPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isManageTeamOpen && (
        <ManageTeamModal
          isOpen={isManageTeamOpen}
          onClose={() => setIsManageTeamOpen(false)}
          projectId={project.id}
        />
      )}

      {isEditModalOpen && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={project as any}
        />
      )}
    </BaseModal>
  );
};
