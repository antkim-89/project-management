import React from 'react'
import { PlusCircle } from 'lucide-react'

export const NewProjectCard: React.FC = () => {
  return (
    <div className="border-2 border-dashed border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-all">
        <PlusCircle className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className="text-headline-md font-bold text-on-surface-variant group-hover:text-on-surface mb-1 transition-colors">Initiate Project</p>
        <p className="text-label-md text-on-surface-variant/60">Define scope and allocate initial resources.</p>
      </div>
    </div>
  )
}
