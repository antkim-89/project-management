import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/base/Breadcrumbs'
import { GlassCard } from '@/components/base/GlassCard'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <div className="max-w-4xl">
        <Breadcrumbs items={[{ label: 'About' }]} />
        <h1 className="font-bold text-display-lg text-on-surface mb-6">About This Project</h1>
        
        <GlassCard className="p-8">
          <p className="text-on-surface-variant text-body-lg leading-relaxed mb-4">
            This project is a modern Project Management & Resource Planning platform designed for enterprise scale. 
            Built with React, TanStack Router, and Tailwind CSS, it leverages a utility-first styling approach 
            to ensure maximum maintainability and performance.
          </p>
          <p className="text-on-surface-variant text-body-lg leading-relaxed">
            The design follows a Glassmorphism aesthetic, providing a premium feel while maintaining a clean 
            and data-dense layout for efficient professional use.
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
