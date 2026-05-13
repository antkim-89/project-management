import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useUIStore } from '@/store/useUIStore'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { theme } = useUIStore()

  // Apply theme to the document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

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
  )
}
