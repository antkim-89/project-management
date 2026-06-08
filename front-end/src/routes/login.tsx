import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/base/Button";
import { Lock, Mail, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const loginFn = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginFn(email, password);
      // 로그인 성공 시 __root.tsx의 useEffect에 의해 자동으로 필요한 곳으로 리다이렉트됩니다.
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "로그인에 실패했습니다. 입력한 정보를 확인해 주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none animate-pulse duration-5000 delay-2000" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-10 animate-fade-in">
        {/* Brand/Logo Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-primary to-secondary/80 p-0.5 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-xl bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">PM</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-4">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400">
            프로젝트 관리 시스템에 로그인하세요.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm p-3.5 rounded-xl animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full h-12 bg-white/[0.03] border border-white/[0.07] focus:border-primary/50 text-white rounded-xl pl-12 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full h-12 bg-white/[0.03] border border-white/[0.07] focus:border-primary/50 text-white rounded-xl pl-12 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Footer Guidance */}
        <div className="text-center text-xs text-slate-500 mt-2">
          초기 로그인 계정은 관리자 John Doe(`john@example.com` / `itmsg4u!`) 입니다.
        </div>
      </div>
    </div>
  );
}
