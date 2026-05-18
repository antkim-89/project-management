import { Button } from "@/components/base/Button";
import React, { useState } from "react";
import {
  X,
  Edit2,
  Share2,
  Check,
  History,
  FileText,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseModal } from "@/components/base/BaseModal";
import { ManageTeamModal } from "@/components/modal/layout/ManageTeamModal";
import { EditProjectModal } from "@/components/modal/layout/EditProjectModal";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";
    id: string;
    title: string;
    subtitle: string;
    scope: string;
    team: { name: string; role: string; avatar: string }[];
    activities: {
      title: string;
      time: string;
      user: string;
      type: "success" | "info" | "neutral";
    }[];
    financials: {
      totalCost: string;
      burnRate: string;
      burnRatePercent: number;
      allocatedHours: string;
      consumedHours: string;
      infrastructureFee: string;
    };
    milestones: { title: string; completed: boolean }[];
  } | null;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !project) return null;

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
          onClick={() => setIsEditModalOpen(true)}
          className="btn-glass px-3 h-10 cursor-pointer hover:text-primary transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="glass" className=" px-3 h-10">
          <Share2 className="w-4 h-4" />
        </Button>
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
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
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
            <p className="text-body-lg text-on-surface/80 leading-relaxed bg-surface-container-low/30 p-4 rounded-xl border border-outline-variant/10 italic">
              {project.scope}
            </p>
          </section>

          {/* Team */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest">
                Assigned Personnel ({project.team.length})
              </h4>
              <Button
                onClick={() => setIsManageTeamOpen(true)}
                className="text-primary text-label-sm font-bold hover:underline cursor-pointer"
              >
                Manage Team
              </Button>
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

        {/* Metrics & Budget (Right 1/3) */}
        <div className="space-y-8 bg-surface-container-low/40 p-6 rounded-2xl border border-outline-variant/30 h-fit sticky top-0">
          <section>
            <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-6">
              Financial Health
            </h4>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Total M/M Cost
                </p>
                <p className="text-3xl font-mono font-bold text-on-surface">
                  {project.financials.totalCost}
                </p>
                <div className="flex items-center gap-1.5 text-secondary text-[11px] font-bold mt-1">
                  <TrendingDown className="w-3 h-3" />
                  12% below forecast
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Current Burn Rate
                </p>
                <p className="text-xl font-mono font-bold text-on-surface">
                  {project.financials.burnRate}{" "}
                  <span className="text-xs text-on-surface-variant font-sans">
                    / day
                  </span>
                </p>
                <div className="h-1.5 w-full bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${project.financials.burnRatePercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/30 space-y-3">
                {[
                  {
                    label: "Allocated Hours",
                    value: project.financials.allocatedHours,
                  },
                  {
                    label: "Consumed Hours",
                    value: project.financials.consumedHours,
                  },
                  {
                    label: "Infrastructure Fee",
                    value: project.financials.infrastructureFee,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-label-md"
                  >
                    <span className="text-on-surface-variant">
                      {item.label}
                    </span>
                    <span className="font-mono font-bold text-on-surface">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-4">
              Key Milestones
            </h4>
            <div className="space-y-3">
              {project.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-label-md font-medium",
                      milestone.completed
                        ? "text-on-surface/60 line-through"
                        : "text-on-surface",
                    )}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
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
