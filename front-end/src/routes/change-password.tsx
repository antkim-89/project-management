import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/base/Button";
import { Lock, Check, X, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/change-password")({
  component: ChangePassword,
});

function ChangePassword() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const changePasswordFn = useAuthStore((state) => state.changePassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 실시간 비밀번호 유효성 검사 기준 상태
  const [rules, setRules] = useState({
    length: false,
    alphanumeric: false,
    specialChar: false,
    matches: false,
  });

  useEffect(() => {
    setRules({
      length: newPassword.length >= 8 && newPassword.length <= 16,
      alphanumeric: /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword),
      specialChar: /[!@#$%^&*]/.test(newPassword),
      matches: newPassword !== "" && newPassword === confirmPassword,
    });
  }, [newPassword, confirmPassword]);

  const isFormValid = rules.length && rules.alphanumeric && rules.specialChar && rules.matches && currentPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("비밀번호 규칙과 일치 여부를 다시 확인해 주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await changePasswordFn(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해 주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Change Password Card */}
      <div className="w-full max-w-lg bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 p-1 text-amber-400 mb-2">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            비밀번호 변경 필요
          </h1>
          <p className="text-sm text-slate-400">
            보안을 위해 첫 로그인 시 반드시 비밀번호를 변경해야 합니다.
          </p>
          {user && (
            <p className="text-xs text-primary font-mono bg-primary/5 border border-primary/10 rounded-full py-1 px-3 inline-block mt-2">
              계정: {user.email}
            </p>
          )}
        </div>

        {/* Success / Error Toast */}
        {success ? (
          <div className="flex items-center gap-2.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-sm p-4 rounded-xl">
            <Check className="w-5 h-5 shrink-0" />
            <span>비밀번호가 변경되었습니다. 잠시 후 대시보드로 이동합니다...</span>
          </div>
        ) : (
          error && (
            <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm p-3.5 rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">
              현재 비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="password"
                placeholder="현재 비밀번호 (초기: itmsg4u!)"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isLoading || success}
                className="w-full h-11 bg-white/[0.03] border border-white/[0.07] focus:border-primary/50 text-white rounded-xl pl-12 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">
              새 비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="password"
                placeholder="새로운 비밀번호를 입력해 주세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading || success}
                className="w-full h-11 bg-white/[0.03] border border-white/[0.07] focus:border-primary/50 text-white rounded-xl pl-12 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="password"
                placeholder="새로운 비밀번호를 다시 입력해 주세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || success}
                className="w-full h-11 bg-white/[0.03] border border-white/[0.07] focus:border-primary/50 text-white rounded-xl pl-12 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Realtime password validation feedback */}
          <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl space-y-2 mt-4 text-xs">
            <p className="font-bold text-slate-400 mb-2">비밀번호 규칙 요구사항</p>
            
            <div className="flex items-center gap-2">
              {rules.length ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className={rules.length ? "text-emerald-300" : "text-slate-500"}>
                8자 이상 16자 이하의 길이
              </span>
            </div>

            <div className="flex items-center gap-2">
              {rules.alphanumeric ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className={rules.alphanumeric ? "text-emerald-300" : "text-slate-500"}>
                영문 대소문자 및 숫자 포함
              </span>
            </div>

            <div className="flex items-center gap-2">
              {rules.specialChar ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className={rules.specialChar ? "text-emerald-300" : "text-slate-500"}>
                특수문자 (!@#$%^&*) 포함
              </span>
            </div>

            <div className="flex items-center gap-2">
              {rules.matches ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className={rules.matches ? "text-emerald-300" : "text-slate-500"}>
                새 비밀번호와 비밀번호 확인이 정확히 일치
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || isLoading || success}
            className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "비밀번호 변경 중..." : "비밀번호 변경 및 완료"}
          </Button>
        </form>
      </div>
    </div>
  );
}
