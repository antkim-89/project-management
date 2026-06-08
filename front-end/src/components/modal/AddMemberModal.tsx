import { useState } from "react";
import { BaseModal } from "@/components/base/BaseModal";
import { Button } from "@/components/base/Button";
import { Select } from "@/components/base/Select";
import { useCreateUser } from "@/hooks/api/useUsers";
import { useRanks } from "@/hooks/api/useRanks";
import { Mail, User, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { t } = useTranslation();
  const createUserMutation = useCreateUser();
  const { data: ranks, isLoading: isRanksLoading } = useRanks();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRankId, setSelectedRankId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedRankId) {
      setError("모든 필수 항목(* 표시)을 입력해 주세요.");
      return;
    }

    setError(null);

    try {
      await createUserMutation.mutateAsync({
        name,
        email,
        rankId: selectedRankId,
        avatarUrl: avatarUrl || undefined,
      });
      
      // 상태 리셋 및 닫기
      setName("");
      setEmail("");
      setSelectedRankId("");
      setAvatarUrl("");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "임직원 등록에 실패했습니다. 이미 등록된 이메일인지 확인해 주세요."
      );
    }
  };

  const rankOptions = ranks
    ? ranks.map((rank) => ({
        value: rank.id,
        label: `${rank.name} (기본급 ₩${rank.baseSalary.toLocaleString()})`,
      }))
    : [];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="신규 임직원 등록"
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="glass" onClick={onClose} className="cursor-pointer">
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createUserMutation.isPending}
            className="cursor-pointer"
          >
            {createUserMutation.isPending ? "등록 중..." : "등록하기"}
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

        <div className="text-sm text-on-surface-variant bg-surface-container/50 border border-outline-variant/30 rounded-xl p-3.5 font-light leading-relaxed">
          임직원을 새로 등록하면 초기 비밀번호는 <strong className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">itmsg4u!</strong>로 자동 설정되며, 해당 임직원이 처음 로그인할 때 반드시 비밀번호를 직접 변경하도록 강제됩니다.
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            이름 *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="임직원의 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createUserMutation.isPending}
              className="w-full h-[42px] bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl pl-10 pr-4 text-body-md outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            이메일 주소 (아이디) *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
            <input
              type="email"
              placeholder="employee@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={createUserMutation.isPending}
              className="w-full h-[42px] bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl pl-10 pr-4 text-body-md outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        {/* Rank Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            직급 선택 *
          </label>
          {isRanksLoading ? (
            <div className="text-xs text-on-surface-variant">직급 정보를 로드하는 중...</div>
          ) : (
            <Select
              options={rankOptions}
              value={selectedRankId}
              onChange={setSelectedRankId}
              placeholder="직급을 선택해 주세요"
              disabled={createUserMutation.isPending}
            />
          )}
        </div>

        {/* Avatar Url Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            프로필 이미지 URL (선택)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/... (선택 사항)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            disabled={createUserMutation.isPending}
            className="w-full h-[42px] bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 text-body-md outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </form>
    </BaseModal>
  );
}
