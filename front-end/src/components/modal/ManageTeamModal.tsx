import { Button } from "@/components/base/Button";
import { useState } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { useUsers } from "@/hooks/api/useUsers";
import { useProjectDetail } from "@/hooks/api/useProjects";
import { useProjectRoles } from "@/hooks/api/useProjectRoles";
import api from "@/lib/axios";
import { Select } from "@/components/base/Select";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Check, Briefcase, Users, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, SkillSet } from "@/types/api";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/base/Pagination";

interface UserSkill {
  id: string;
  userId: string;
  skillSetId: string;
  skillSet?: SkillSet;
}

interface TeamMember extends User {
  skills?: UserSkill[];
}

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface AllocationState {
  userId: string;
  role: string;
  isInitiallyAllocated: boolean;
  initialRole?: string;
}

export function ManageTeamModal({
  isOpen,
  onClose,
  projectId,
}: ManageTeamModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: allUsers, isLoading: usersLoading } = useUsers();
  const { data: project, isLoading: projectLoading } =
    useProjectDetail(projectId);
  const { data: projectRoles } = useProjectRoles();

  // Allocation local state
  const [allocations, setAllocations] = useState<
    Record<string, AllocationState>
  >({});
  const [prevAssignments, setPrevAssignments] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [isSaving, setIsSaving] = useState(false);

  // Pagination States
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state during render (React recommended way to avoid cascading renders in effects)
  if (project?.assignments && project.assignments !== prevAssignments) {
    setPrevAssignments(project.assignments);
    const initialMap: Record<string, AllocationState> = {};
    project.assignments.forEach((assignment: any) => {
      initialMap[assignment.userId] = {
        userId: assignment.userId,
        role: assignment.role,
        isInitiallyAllocated: true,
        initialRole: assignment.role,
      };
    });
    setAllocations(initialMap);
  }

  // Filter users for resource list
  const filteredUsers =
    (allUsers as TeamMember[] | undefined)?.filter((u) => {
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
      (allUsers || [])
        .flatMap((u) => (u as TeamMember).skills || [])
        .map((s) => s.skillSet?.name)
        .filter((name): name is string => !!name),
    ),
  );

  const handleToggleAllocate = (user: TeamMember) => {
    const current = allocations[user.id];
    if (current) {
      // If currently selected, deselect it
      const nextAllocations = { ...allocations };
      delete nextAllocations[user.id];
      setAllocations(nextAllocations);
    } else {
      // Prevent double assignment check
      const otherProjectAssignment = user.assignments?.find(
        (a) => a.projectId !== projectId && a.project?.status !== "Completed"
      );
      if (otherProjectAssignment) return; // Block allocation

      // If not selected, select it
      const defaultRole = projectRoles && projectRoles.length > 0 ? projectRoles[0].name : "Developer";
      setAllocations({
        ...allocations,
        [user.id]: {
          userId: user.id,
          role: defaultRole, // Default role from settings
          isInitiallyAllocated: false,
        },
      });
    }
  };

  const handleRoleChange = (userId: string, role: string) => {
    if (allocations[userId]) {
      setAllocations({
        ...allocations,
        [userId]: {
          ...allocations[userId],
          role,
        },
      });
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      if (!project) return;
      const initialAssignments = project?.assignments || [];

      // Determine what to add, delete, or update
      // 1. Deletions: in initialAssignments but not in allocations
      const toDelete = initialAssignments.filter(
        (a: any) => !allocations[a.userId],
      );
      for (const assign of toDelete) {
        await api.delete(
          `/assignments/project/${projectId}/user/${assign.userId}`,
        );
      }

      // 2. Additions and Updates: in allocations
      for (const userId of Object.keys(allocations)) {
        const alloc = allocations[userId];
        const initial = initialAssignments.find(
          (a: any) => a.userId === userId,
        );

        if (!initial) {
          // New assignment addition
          await api.post("/assignments", {
            userId,
            projectId,
            role: alloc.role,
            contributionPercentage: 100,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate),
          });
        } else if (initial.role !== alloc.role) {
          // Role changed: delete and recreate to update role
          await api.delete(`/assignments/project/${projectId}/user/${userId}`);
          await api.post("/assignments", {
            userId,
            projectId,
            role: alloc.role,
            contributionPercentage: 100,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate),
          });
        }
      }

      // Invalidate queries to refresh the details immediately
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(t("projects.manageTeam.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const footer = (
    <div className="flex gap-2">
      <Button
        variant="glass"
        onClick={onClose}
        className=" px-4 h-10 cursor-pointer"
        disabled={isSaving}
      >
        {t("projects.manageTeam.cancel")}
      </Button>
      <Button
        variant="primary"
        onClick={handleSaveChanges}
        className=" px-6 h-10 cursor-pointer"
        disabled={isSaving || projectLoading}
      >
        {isSaving ? t("projects.manageTeam.saving") : t("projects.manageTeam.saveTeam")}
      </Button>
    </div>
  );

  const activeAllocCount = Object.keys(allocations).length;

  const selectedUsers = (allUsers as TeamMember[] | undefined)?.filter(
    (u) => !!allocations[u.id]
  ) || [];


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("projects.manageTeam.title", { title: project?.title || t("projects.manageTeam.loading") })}
      footer={footer}
      size="lg"
    >
      <div className="flex flex-col gap-6 max-h-[65vh] overflow-y-auto pr-1">
        {/* Helper Alert Strip */}
        <div className="flex items-start gap-2.5 p-3.5 bg-primary/5 border border-primary/20 rounded-xl text-primary text-body-sm leading-relaxed">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>
            {t("projects.manageTeam.helperText")}
          </span>
        </div>

        {/* Resource Search Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="relative sm:col-span-2 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder={t("projects.manageTeam.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface text-label-md outline-none focus:border-primary transition-colors h-[42px]"
            />
          </div>
          <div className="w-full">
            <Select
              value={selectedSkill}
              onChange={(val) => {
                setSelectedSkill(val);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: t("projects.manageTeam.allSkills") },
                ...uniqueSkills.map((skill) => ({ value: skill, label: skill })),
              ]}
              className="w-full"
            />
          </div>
        </div>

        {/* Selected Members Preview Row */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-col gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-xl animate-fade-in shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {t("projects.manageTeam.selectedPreviewTitle", { defaultValue: "선택된 프로젝트 팀원" })} ({selectedUsers.length}명)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto pr-1">
              {selectedUsers.map((user) => {
                const alloc = allocations[user.id];
                return (
                  <div
                    key={`selected-${user.id}`}
                    className="flex items-center gap-1.5 bg-surface border border-outline-variant/60 rounded-full pl-1.5 pr-2.5 py-1 text-label-sm font-medium hover:border-error/30 hover:bg-error/5 group transition-all"
                  >
                    <img
                      src={
                        user.avatarUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover border border-outline-variant"
                    />
                    <span className="text-on-surface truncate max-w-[80px]">
                      {user.name}
                    </span>
                    {alloc?.role && (
                      <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                        {alloc.role}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleAllocate(user)}
                      className="text-on-surface-variant hover:text-error transition-colors ml-1 p-0.5 rounded-full hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Allocation Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usersLoading || projectLoading ? (
            <div className="col-span-2 text-center text-on-surface-variant py-8">
              {t("projects.manageTeam.loadingResources")}
            </div>
          ) : (() => {
            const totalItems = filteredUsers.length;
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
            const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

            return paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const isAllocated = !!allocations[user.id];
                const currentAlloc = allocations[user.id];
                const otherProjectAssignment = user.assignments?.find(
                  (a) => a.projectId !== projectId && a.project?.status !== "Completed"
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
                      otherProjectAssignment && "opacity-60 cursor-not-allowed pointer-events-none"
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
                        <span className="text-outline text-[9px]">{t("projects.manageTeam.noSkills")}</span>
                      )}
                    </div>

                    {/* Allocated Project Role field (only if selected) */}
                    {isAllocated && (
                      <div
                        className="mt-4 pt-3 border-t border-primary/20 flex flex-col gap-1.5"
                        onClick={(e) => e.stopPropagation()} // Prevent deselecting
                      >
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {t("projects.manageTeam.projectRole")}
                        </label>
                        <Select
                          value={currentAlloc?.role || ""}
                          onChange={(val) => handleRoleChange(user.id, val)}
                          options={[
                            { value: "", label: t("projects.manageTeam.selectRole") },
                            ...(projectRoles?.map((r) => ({ value: r.name, label: r.name })) || [])
                          ]}
                          className="w-full"
                        />
                      </div>
                    )}

                    {otherProjectAssignment && (
                      <div className="mt-3 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg flex items-center gap-1.5 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{t("projects.manageTeam.alreadyAssigned", {
                          projectName: otherProjectAssignment.project?.title,
                          defaultValue: `배정 불가: ${otherProjectAssignment.project?.title} 참여 중`
                        })}</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-on-surface-variant py-8">
                {t("projects.manageTeam.noResourcesFound")}
              </div>
            );
          })()}
        </div>

        {/* Pagination Controls */}
        {(() => {
          const totalItems = filteredUsers.length;
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

          if (totalPages <= 1) return null;

          return (
            <div className="flex justify-between items-center mt-2 pt-4 border-t border-outline-variant/20 select-none animate-fade-in">
              <span className="text-[11px] font-medium text-on-surface-variant font-mono">
                {t("teams.showingEntries", {
                  start: startIndex + 1,
                  end: endIndex,
                  total: totalItems,
                })}
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          );
        })()}

        {/* Allocation Summary count */}
        {activeAllocCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-lg text-secondary text-label-md font-bold mt-2">
            <Users className="w-5 h-5" />
            <span>
              {t("projects.manageTeam.selectionSummary", { count: activeAllocCount, title: project?.title })}
            </span>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
