import React from 'react'
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/base/GlassCard'

interface ProjectCardProps {
  status: 'ACTIVE' | 'AT RISK' | 'COMPLETED' | 'ON HOLD'
  title: string
  department: string
  avatars: string[]
  avatarMore?: number
  mmCost: string
  progress: number
  period: string
  statusText: string
  statusIcon: React.ReactNode
  periodIcon: React.ReactNode
  variant: 'secondary' | 'error' | 'primary' | 'neutral'
  isAtRisk?: boolean
  onClick?: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  status,
  title,
  department,
  avatars,
  avatarMore,
  mmCost,
  progress,
  period,
  statusText,
  statusIcon,
  periodIcon,
  variant,
  isAtRisk,
  onClick
}) => {
  const badgeStyles = {
    'ACTIVE': 'text-secondary bg-secondary/10',
    'AT RISK': 'text-error bg-error/10',
    'COMPLETED': 'text-primary bg-primary/10',
    'ON HOLD': 'text-on-surface-variant bg-surface-container-highest'
  }

  const variantStyles = {
    secondary: 'text-secondary bg-secondary',
    error: 'text-error bg-error',
    primary: 'text-primary bg-primary',
    neutral: 'text-on-surface-variant bg-outline'
  }

  return (
    <GlassCard 
      className={cn(
        "p-6 flex flex-col transition-all duration-300",
        isAtRisk && "border-l-4 border-l-error",
        "group cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={cn("text-label-caps font-bold px-2 py-0.5 rounded tracking-wider", badgeStyles[status])}>
            {status}
          </span>
          <h3 className="text-headline-md font-bold mt-2 group-hover:text-primary transition-colors text-on-surface">
            {title}
          </h3>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex -space-x-2">
          {avatars.map((url, idx) => (
            <img 
              key={idx} 
              src={url} 
              alt="Team member" 
              className="w-7 h-7 rounded-full border-2 border-surface-container object-cover" 
            />
          ))}
          {avatarMore && (
            <div className="w-7 h-7 rounded-full bg-surface-container-highest border-2 border-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
              +{avatarMore}
            </div>
          )}
        </div>
        <span className="text-label-sm text-on-surface-variant">{department}</span>
      </div>

      <div className="mt-auto space-y-4">
        <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-3 rounded">
          <div>
            <p className="text-label-caps font-bold text-on-surface-variant tracking-wider mb-1">M/M COST</p>
            <p className={cn("text-label-md font-medium font-mono", variant === 'error' ? 'text-error' : 'text-on-surface')}>
              {mmCost}
            </p>
          </div>
          <div>
            <p className="text-label-caps font-bold text-on-surface-variant tracking-wider mb-1">PROGRESS</p>
            <div className="flex items-center gap-2">
              <p className={cn("text-label-md font-medium font-mono", variant === 'error' ? 'text-error' : variant === 'secondary' ? 'text-secondary' : variant === 'primary' ? 'text-primary' : 'text-on-surface-variant')}>
                {progress}%
              </p>
              <div className="flex-1 h-1 bg-surface-variant rounded-full overflow-hidden">
                <div 
                  className={cn("h-full", variantStyles[variant].split(' ')[1])} 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-label-sm text-on-surface-variant pt-2 border-t border-outline-variant/30">
          <span className="flex items-center gap-1">{periodIcon} {period}</span>
          <span className={cn("flex items-center gap-1", variant === 'error' ? 'text-error' : variant === 'secondary' ? 'text-secondary' : variant === 'primary' ? 'text-primary' : '')}>
            {statusIcon} {statusText}
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
