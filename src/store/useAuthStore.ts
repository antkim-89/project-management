import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'Free' | 'Pro' | 'Enterprise'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: () => {
    // 가짜 로그인 데이터
    const mockUser: User = {
      id: '1',
      name: 'Jun Kim',
      email: 'jun@example.com',
      plan: 'Pro',
    }
    set({ user: mockUser, isAuthenticated: true })
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}))
