import { Button } from "@/components/base/Button";
import { useState } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { CalendarPicker } from "@/components/base/CalendarPicker";
import { useUsers } from "@/hooks/api/useUsers";
import { useCreateProject } from "@/hooks/api/useProjects";
import { useProjectCategories } from "@/hooks/api/useProjectCategories";
import { useSkills } from "@/hooks/api/useSkills";
import { Select } from "@/components/base/Select";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Check,
  Calendar,
  DollarSign,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, SkillSet } from "@/types/api";

interface UserSkill {
  id: string;
  userId: string;
  skillSetId: string;
  skillSet?: SkillSet;
}

interface TeamMember extends User {
  skills?: UserSkill[];
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Allocation {
  userId: string;
  role: string;
  name: string;
  avatarUrl: string;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const queryClient = useQueryClient();
  const { data: users, isLoading: usersLoading } = useUsers();
  const createProjectMutation = useCreateProject();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalManMonths, setTotalManMonths] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  // Fetch reference data
  const { data: projectCategories } = useProjectCategories();
  const { data: allSkills } = useSkills();

  // Resource Allocation states
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("ALL");

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Details, Step 2: Allocate Resources

  // Filter users for resource allocation
  const filteredUsers =
    (users as TeamMember[] | undefined)?.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.rank?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill =
        selectedSkill === "ALL" ||
        u.skills?.some((s) => s.skillSet?.name === selectedSkill);

      return matchesSearch && matchesSkill;
    }) || [];

  // Extract unique skills dynamically
  const uniqueSkills = Array.from(
    new Set(
      (users || [])
        .flatMap((u) => (u as TeamMember).skills || [])
        .map((s) => s.skillSet?.name)
        .filter((name): name is string => !!name),
    ),
  );

  const handleToggleAllocate = (user: TeamMember) => {
    const exists = allocations.find((a) => a.userId === user.id);
    if (exists) {
      setAllocations(allocations.filter((a) => a.userId !== user.id));
    } else {
      setAllocations([
        ...allocations,
        {
          userId: user.id,
          role: "Developer", // Default role
          name: user.name,
          avatarUrl: user.avatarUrl || "",
        },
      ]);
    }
  };

  const handleRoleChange = (userId: string, role: string) => {
    setAllocations(
      allocations.map((a) => (a.userId === userId ? { ...a, role } : a)),
    );
  };

  const handleInitiateProject = async () => {
    if (!title || !startDate || !endDate || !budget) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // Create Project
      createProjectMutation.mutate(
        {
          title,
          description,
          startDate: new Date(startDate) as any,
          endDate: new Date(endDate) as any,
          budget: parseFloat(budget),
          totalManMonths: totalManMonths ? parseFloat(totalManMonths) : undefined,
          price: price ? parseFloat(price) : undefined,
          categoryId: categoryId || undefined,
          requiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
          status: "Active",
        },
        {
          onSuccess: async (createdProject) => {
            // Sequentially create assignments
            for (const alloc of allocations) {
              await api.post("/assignments", {
                userId: alloc.userId,
                projectId: createdProject.id,
                role: alloc.role,
                contributionPercentage: 100,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
              });
            }
            // Invalidate React Query Cache
            await queryClient.invalidateQueries({ queryKey: ["projects"] });

            // Reset Form and Close
            handleClose();
            window.location.reload();
          },
          onError: (err) => {
            console.error(err);
            alert("Failed to initiate project.");
          },
        },
      );
    } catch (error) {
      console.error(error);
      alert("Failed to allocate resources.");
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setBudget("");
    setTotalManMonths("");
    setPrice("");
    setCategoryId("");
    setRequiredSkills([]);
    setStartDate("");
    setEndDate("");
    setAllocations([]);
    setStep(1);
    onClose();
  };

  const footer = (
    <div className="flex justify-between items-center w-full">
      {step === 2 ? (
        <button
          onClick={() => setStep(1)}
          className="btn-glass px-4 h-10 cursor-pointer"
        >
          Back
        </button>
      ) : (
        <div></div>
      )}
      <div className="flex gap-2">
        <Button
          variant="glass"
          onClick={handleClose}
          className=" px-4 h-10 cursor-pointer"
        >
          Cancel
        </Button>
        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            className="btn-primary px-6 h-10 cursor-pointer"
            disabled={!title || !startDate || !endDate || !budget}
          >
            Allocate Resources
          </button>
        ) : (
          <Button
            variant="primary"
            onClick={handleInitiateProject}
            className=" px-6 h-10 cursor-pointer"
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending
              ? "Initiating..."
              : "Initiate Project"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Initiate New Project" : "Allocate Project Resources"}
      footer={footer}
      size="lg"
    >
      {step === 1 ? (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
            
            <div className="md:col-span-2">
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

            <div className="relative">
              <label className="block text-label-caps font-bold text-on-surface-variant mb-1.5">
                Project Category
              </label>
              <Select
                value={categoryId}
                onChange={setCategoryId}
                options={[
                  { value: "", label: "Select Category..." },
                  ...(projectCategories?.map((c) => ({ value: c.id, label: c.name })) || []),
                ]}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                Required Tech Stacks
              </label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-surface-container border border-outline-variant rounded-lg">
                {allSkills?.map((skill) => {
                  const isSelected = requiredSkills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        setRequiredSkills((prev) =>
                          isSelected ? prev.filter((id) => id !== skill.id) : [...prev, skill.id]
                        );
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors",
                        isSelected
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/50"
                      )}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                Total Man-Months
              </label>
              <input
                type="number"
                placeholder="e.g. 12.5"
                value={totalManMonths}
                onChange={(e) => setTotalManMonths(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors"
                step="0.1"
              />
            </div>
            <div>
              <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-primary" /> Budget Cost (USD) *
              </label>
              <input
                type="number"
                placeholder="e.g. 500000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Sale Price (USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 750000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="relative md:col-span-2">
              <label className="text-label-caps font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-secondary" /> Project Period (Start - End Date) *
              </label>
              <CalendarPicker
                mode="range"
                rangeValue={{ startDate, endDate }}
                onRangeChange={(range) => {
                  setStartDate(range.startDate);
                  setEndDate(range.endDate);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in max-h-[60vh] overflow-y-auto pr-1">
          {/* Resource Search Strip */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search resources by name or rank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface text-label-md outline-none focus:border-primary transition-colors"
              />
            </div>
            <Select
              value={selectedSkill}
              onChange={setSelectedSkill}
              options={[
                { value: "ALL", label: "All Skills" },
                ...uniqueSkills.map((skill) => ({ value: skill, label: skill })),
              ]}
              className="min-w-[150px]"
            />
          </div>

          {/* Allocation Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersLoading ? (
              <div className="col-span-2 text-center text-on-surface-variant py-8">
                Loading resources...
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAllocated = !!allocations.find(
                  (a) => a.userId === user.id,
                );
                const currentAlloc = allocations.find(
                  (a) => a.userId === user.id,
                );

                return (
                  <div
                    key={user.id}
                    onClick={() => handleToggleAllocate(user)}
                    className={cn(
                      "flex flex-col bg-surface-container border transition-all duration-300 rounded-xl p-4 shadow-sm cursor-pointer relative select-none",
                      isAllocated
                        ? "border-primary shadow-lg shadow-primary/5 bg-primary/5"
                        : "border-outline-variant hover:border-primary/40",
                    )}
                  >
                    {/* User Profile info */}
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={
                            user.avatarUrl ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border border-outline-variant"
                        />
                        {isAllocated && (
                          <div className="absolute -top-1 -right-1 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center border border-surface shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-on-surface text-label-lg truncate">
                            {user.name}
                          </h4>
                          <span className="text-[10px] font-bold font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                            ₩{(user.rank?.baseSalary || 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">
                          {user.rank?.name}
                        </p>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded"
                          >
                            {s.skillSet?.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-outline text-[9px]">
                          No skills
                        </span>
                      )}
                    </div>

                    {/* Allocated Project Role field (only if selected) */}
                    {isAllocated && (
                      <div
                        className="mt-4 pt-3 border-t border-primary/20 flex flex-col gap-1.5"
                        onClick={(e) => e.stopPropagation()} // Prevent deselecting
                      >
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Project Role
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lead Developer, QA Engineer..."
                          value={currentAlloc?.role || ""}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="w-full bg-surface-container border border-primary/30 rounded px-2.5 py-1 text-on-surface text-label-md outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-on-surface-variant py-8">
                No matching resources found.
              </div>
            )}
          </div>

          {/* Allocation Summary count */}
          {allocations.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-lg text-secondary text-label-md font-bold mt-2">
              <UserCheck className="w-5 h-5" />
              <span>
                Allocating {allocations.length} personnel to project `{title}`
              </span>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
}
