import { create } from "zustand";
import api from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  mustChangePassword: boolean;
  plan?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// 초기 로컬스토리지 상태 로드
const initialToken = localStorage.getItem("token");
const initialUserJson = localStorage.getItem("user");
const initialUser: User | null = initialUserJson ? JSON.parse(initialUserJson) : null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  isAuthenticated: !!initialToken && !!initialUser,
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { token, user } = data;
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
  changePassword: async (currentPassword, newPassword) => {
    const user = get().user;
    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    await api.post("/auth/change-password", {
      email: user.email,
      currentPassword,
      newPassword,
    });

    // 성공 시 로컬 사용자 데이터에서 비밀번호 변경 필요 여부를 false로 업데이트
    const updatedUser: User = { ...user, mustChangePassword: false };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
