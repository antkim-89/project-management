import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/base/GlassCard'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/tasks')({
  component: Tasks,
})

function Tasks() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-bold text-display-lg text-on-surface mb-1">Tasks</h1>
          <p className="text-on-surface-variant text-body-md">Stay on top of your daily goals and assignments.</p>
        </div>
        <button className="btn-primary px-4">
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>
      <div className="flex flex-col gap-3 max-w-4xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <GlassCard key={i} className="flex items-center justify-between p-4 group">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded border-2 border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors cursor-pointer shrink-0">
                <div className="w-3 h-3 bg-primary rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <span className="text-on-surface group-hover:text-primary transition-colors">Review design system implementation {i}</span>
            </div>
            <div className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-primary/20">
              In Progress
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
