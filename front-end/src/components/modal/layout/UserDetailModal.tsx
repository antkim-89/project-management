import { Button } from "@/components/base/Button";
import { Mail, Shield, Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import { BaseModal } from "@/components/base/BaseModal";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({ isOpen, onClose }: UserDetailModalProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  if (!user) return null;

  const footer = (
    <Button variant="primary" className=" px-6 h-10" onClick={onClose}>
      Confirm
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("common.overview")} - ${user.name}`}
      footer={footer}
      size="md"
    >
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary text-3xl font-bold shadow-lg shadow-secondary/20">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-on-surface">{user.name}</h3>
          <p className="bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-primary/20 inline-block mt-1">
            {user.plan} {t("common.proPlan")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Email
            </label>
            <span className="text-on-surface font-medium">{user.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <Shield className="w-5 h-5 text-secondary" />
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Role
            </label>
            <span className="text-on-surface font-medium">Administrator</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <Calendar className="w-5 h-5 text-on-surface-variant" />
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Joined
            </label>
            <span className="text-on-surface font-medium">2026.01.27</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <MapPin className="w-5 h-5 text-error" />
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Location
            </label>
            <span className="text-on-surface font-medium">Seoul, Korea</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
