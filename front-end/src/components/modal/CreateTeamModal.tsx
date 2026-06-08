import { useState } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { Button } from "@/components/base/Button";
import { useCreateTeam } from "@/hooks/api/useTeams";
import { Briefcase, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const { t } = useTranslation();
  const createTeamMutation = useCreateTeam();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("조직 이름은 필수 항목입니다.");
      return;
    }

    setError(null);

    try {
      await createTeamMutation.mutateAsync({
        name,
        description: description || undefined,
      });

      // 리셋 및 닫기
      setName("");
      setDescription("");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "조직 생성에 실패했습니다. 중복된 이름인지 확인해 주세요."
      );
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="신규 조직(팀) 개설"
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="glass" onClick={onClose} className="cursor-pointer">
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createTeamMutation.isPending}
            className="cursor-pointer font-bold"
          >
            {createTeamMutation.isPending ? "개설 중..." : "개설하기"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {error && (
          <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm p-3.5 rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Team Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            조직(팀) 이름 *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="예: 플랫폼 개발팀, 디자인 기획실"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createTeamMutation.isPending}
              className="w-full h-[42px] bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl pl-10 pr-4 text-body-md outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            조직 설명
          </label>
          <textarea
            placeholder="조직의 역할이나 목적에 대한 설명을 입력하세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={createTeamMutation.isPending}
            className="w-full min-h-[100px] bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl p-4 text-body-md outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 resize-none font-light"
          />
        </div>
      </form>
    </BaseModal>
  );
}
