import { create } from 'zustand'

interface UIState {
  isSidebarCollapsed: boolean
  theme: 'light' | 'dark'
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  toggleTheme: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  theme: 'dark', // 기본값 다크
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))
