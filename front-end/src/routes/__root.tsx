import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // 1. 인증이 안 되었을 때, /login이 아니면 /login으로 리다이렉트
    if (!isAuthenticated && pathname !== "/login") {
      navigate({ to: "/login" });
    }
    // 2. 인증이 되었는데, 비밀번호를 변경해야 하는 상태이고, /change-password가 아니면 /change-password로 이동
    else if (isAuthenticated && user?.mustChangePassword && pathname !== "/change-password") {
      navigate({ to: "/change-password" });
    }
    // 3. 인증되었고 비밀번호 변경 조건도 통과했는데 /login이나 /change-password에 접근하면 /로 리다이렉트
    else if (isAuthenticated && !user?.mustChangePassword && (pathname === "/login" || pathname === "/change-password")) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, user, pathname, navigate]);

  const isAuthPage = pathname === "/login" || pathname === "/change-password";

  if (isAuthPage) {
    return (
      <div className="w-screen h-screen bg-background text-on-background font-pretendard overflow-auto">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 bg-background text-on-background font-pretendard overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
