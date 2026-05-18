import { Button } from "@/components/base/Button";
import { useState } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { CalendarPicker } from "@/components/base/CalendarPicker";
import { useUpdateProject } from "@/hooks/api/useProjects";
import { Calendar, DollarSign, Activity } from "lucide-react";
import { RadioGroup } from "@/components/base/Radio";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    scope: string;
    status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD" | string;
    financials: {
      totalCost: string;
    };
  } | null;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const updateProjectMutation = useUpdateProject();

  // Form states initialized directly from props (component unmounts when closed)
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.scope || "");
  const [budget, setBudget] = useState(
    () => project?.financials?.totalCost?.replace(/[^0-9.-]+/g, "") || "",
  );
  const [status, setStatus] = useState(project?.status || "ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleUpdateProject = async () => {
    if (!project) return;

    if (!title) {
      alert("Project Title is required.");
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
            ...(budget && { budget: parseFloat(budget) }),
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
            alert("Failed to update project.");
          },
        },
      );
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating.");
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
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleUpdateProject}
        className=" px-6 h-10 cursor-pointer"
        disabled={updateProjectMutation.isPending || !title}
      >
        {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project Details"
      footer={footer}
      size="md"
    >
      <div className="flex flex-col gap-5 py-2 animate-fade-in">
        <div>
          <label className="block text-label-caps font-bold text-on-surface-variant mb-1.5">
            Project Title *
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
            Scope Description
          </label>
          <textarea
            rows={3}
            placeholder="Detail the scope, roadmap, and deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <Activity className="w-4 h-4 text-primary" /> Status
            </label>
            <div className="flex flex-col">
              <RadioGroup
                name="edit-project-status"
                variant="segmented"
                options={[
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "AT RISK", label: "AT RISK" },
                  { value: "COMPLETED", label: "COMPLETED" },
                  { value: "ON HOLD", label: "ON HOLD" },
                ]}
                value={status}
                onChange={setStatus}
                className="w-full flex-wrap gap-1"
                optionClassName="flex-1 text-center py-2"
              />
            </div>
          </div>
          <div>
            <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary" /> Budget (USD)
            </label>
            <input
              type="number"
              placeholder="e.g. 500000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" /> Update Start Date
            </label>
            <CalendarPicker
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div>
            <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" /> Update End Date
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
