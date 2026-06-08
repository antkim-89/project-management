import { Button } from "@/components/base/Button";
import { useState } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { CalendarPicker } from "@/components/base/CalendarPicker";
import { useUpdateProject } from "@/hooks/api/useProjects";
import { Calendar, Activity } from "lucide-react";
import { RadioGroup } from "@/components/base/Radio";
import { useTranslation } from "react-i18next";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    scope: string;
    status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD" | string;
    startDate?: string;
    endDate?: string;
  } | null;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const { t } = useTranslation();
  const updateProjectMutation = useUpdateProject();

  const getDbStatus = (statusVal: string) => {
    switch (statusVal) {
      case "ACTIVE": return "Active";
      case "AT RISK": return "At Risk";
      case "COMPLETED": return "Completed";
      case "ON HOLD": return "On Hold";
      default: return statusVal;
    }
  };

  // Form states initialized directly from props (component unmounts when closed)
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.scope || "");
  const [status, setStatus] = useState(() => getDbStatus(project?.status || "Active"));
  const [startDate, setStartDate] = useState(project?.startDate || "");
  const [endDate, setEndDate] = useState(project?.endDate || "");

  const handleUpdateProject = async () => {
    if (!project) return;

    if (!title) {
      alert(t("projects.edit.titleRequired"));
      return;
    }

    try {
      updateProjectMutation.mutate(
        {
          id: project.id,
          updatedData: {
            title,
            description,
            status,
            ...(startDate && { startDate: new Date(startDate) as any }),
            ...(endDate && { endDate: new Date(endDate) as any }),
          },
        },
        {
          onSuccess: () => {
            onClose();
            // We can reload if we want, but invalidateQueries is already handled in useUpdateProject
            window.location.reload();
          },
          onError: (err) => {
            console.error(err);
            alert(t("projects.edit.updateFailed"));
          },
        },
      );
    } catch (error) {
      console.error(error);
      alert(t("projects.edit.updateError"));
    }
  };

  const footer = (
    <div className="flex gap-2">
      <Button
        variant="glass"
        onClick={onClose}
        className=" px-4 h-10 cursor-pointer"
        disabled={updateProjectMutation.isPending}
      >
        {t("projects.edit.cancel")}
      </Button>
      <Button
        variant="primary"
        onClick={handleUpdateProject}
        className=" px-6 h-10 cursor-pointer"
        disabled={updateProjectMutation.isPending || !title}
      >
        {updateProjectMutation.isPending ? t("projects.edit.saving") : t("projects.edit.saveChanges")}
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("projects.edit.title")}
      footer={footer}
      size="md"
    >
      <div className="flex flex-col gap-5 py-2 animate-fade-in">
        <div>
          <label className="block text-label-caps font-bold text-on-surface-variant mb-1.5">
            {t("projects.edit.projectTitle")}
          </label>
          <input
            type="text"
            placeholder="e.g. APAC Cloud Deployment Phase 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-label-caps font-bold text-on-surface-variant mb-1.5">
            {t("projects.edit.scopeDescription")}
          </label>
          <textarea
            rows={3}
            placeholder="Detail the scope, roadmap, and deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
            <Activity className="w-4 h-4 text-primary" /> {t("projects.edit.status")}
          </label>
          <div className="flex flex-col">
            <RadioGroup
              name="edit-project-status"
              variant="segmented"
              options={[
                { value: "Active", label: "ACTIVE" },
                { value: "At Risk", label: "AT RISK" },
                { value: "Completed", label: "COMPLETED" },
                { value: "On Hold", label: "ON HOLD" },
              ]}
              value={status}
              onChange={setStatus}
              className="w-full flex-nowrap gap-1"
              optionClassName="flex-1 text-center py-2"
            />
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" /> {t("projects.edit.startDate")}
            </label>
            <CalendarPicker
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div>
            <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" /> {t("projects.edit.endDate")}
            </label>
            <CalendarPicker
              value={endDate}
              onChange={setEndDate}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
