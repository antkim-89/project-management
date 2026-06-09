import { useState, useEffect } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { Button } from "@/components/base/Button";
import { useUsers } from "@/hooks/api/useUsers";
import { useUpdateTeamMembers } from "@/hooks/api/useTeams";
import type { Team } from "@/hooks/api/useTeams";
import { Search, AlertCircle, Check, Users, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/base/Pagination";



interface ManageTeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

export function ManageTeamMembersModal({
  isOpen,
  onClose,
  team,
}: ManageTeamMembersModalProps) {
  const { t } = useTranslation();
  const { data: users, isLoading: isUsersLoading } = useUsers();
  const updateMembersMutation = useUpdateTeamMembers();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Pagination States
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // 모달이 열릴 때 혹은 team이 바뀔 때 초기 선택 상태를 설정
  useEffect(() => {
    if (team && team.users) {
      const initialIds = new Set(team.users.map((u) => u.id));
      setSelectedUserIds(initialIds);
    }
  }, [team, isOpen]);

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setError(null);
    try {
      await updateMembersMutation.mutateAsync({
        teamId: team.id,
        userIds: Array.from(selectedUserIds),
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "조직 인원 구성 업데이트에 실패했습니다."
      );
    }
  };

  const filteredUsers = users
    ? users.filter((u) => {
        const query = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.rank?.name || "").toLowerCase().includes(query)
        );
      })
    : [];

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const normalizedPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const startIndex = (normalizedPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const selectedUsers = users
    ? users.filter((u) => selectedUserIds.has(u.id))
    : [];



  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`조직원 구성 관리 - ${team.name}`}
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="glass" onClick={onClose} className="cursor-pointer">
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={updateMembersMutation.isPending}
            className="cursor-pointer font-bold"
          >
            {updateMembersMutation.isPending ? "저장 중..." : "구성 저장"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1 flex flex-col max-h-[60vh]">
        {error && (
          <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm p-3.5 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Notification */}
        <div className="text-xs text-on-surface-variant bg-surface-container/50 border border-outline-variant/30 rounded-xl p-3 shrink-0 leading-relaxed font-light flex items-start gap-2">
          <Users className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <span>
            이 조직에 포함시키고자 하는 임직원들을 선택해 주세요. 체크를 해제하면 조직에서 자동으로 제외됩니다. (다른 조직에 할당되어 있던 임직원을 선택하면 이 조직으로 재배치됩니다.)
          </span>
        </div>

        {/* Search Strip */}
        <div className="relative shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="이름, 이메일 또는 직급으로 멤버 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[42px] bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl pl-10 pr-4 text-body-md outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Selected Members Preview Row */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-col gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-xl animate-fade-in shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                선택된 조직원 ({selectedUsers.length}명)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto pr-1">
              {selectedUsers.map((user) => (
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
                  {user.rank?.name && (
                    <span className="text-[9px] bg-secondary/10 border border-secondary/20 text-secondary px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                      {user.rank.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleUser(user.id)}
                    className="text-on-surface-variant hover:text-error transition-colors ml-1 p-0.5 rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Checklist Area */}
        <div className="flex-1 overflow-y-auto border border-outline-variant/30 rounded-xl divide-y divide-outline-variant/20 bg-surface-container-low/30 pr-1">
          {isUsersLoading ? (
            <div className="text-center py-8 text-sm text-on-surface-variant">
              임직원 목록을 로드하는 중...
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-8 text-sm text-on-surface-variant/50 font-light">
              검색 조건에 맞는 임직원이 없습니다.
            </div>
          ) : (
            paginatedUsers.map((member) => {
              const isChecked = selectedUserIds.has(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => handleToggleUser(member.id)}
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer hover:bg-interaction-hover transition-colors",
                    isChecked && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.avatarUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-outline-variant/30"
                    />
                    <div>
                      <div className="font-bold text-on-surface text-label-md flex items-center gap-1.5">
                        {member.name}
                        {member.rank && (
                          <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-1.5 py-0.2 rounded font-normal font-sans">
                            {member.rank.name}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-on-surface-variant font-light">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  {/* Custom Checkbox */}
                  <div
                    className={cn(
                      "w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all",
                      isChecked
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                        : "border-outline-variant bg-surface-container"
                    )}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20 select-none shrink-0">
            <span className="text-[11px] font-medium text-on-surface-variant font-mono">
              {t("teams.showingEntries", {
                start: totalItems > 0 ? startIndex + 1 : 0,
                end: endIndex,
                total: totalItems,
              })}
            </span>
            <Pagination
              currentPage={normalizedPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

      </div>
    </BaseModal>
  );
}
