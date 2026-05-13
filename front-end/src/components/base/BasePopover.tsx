import React, { useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

interface BasePopoverProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  position?: 'bottomRight' | 'bottomLeft'
  className?: string
}

export function BasePopover({
  isOpen,
  onClose,
  triggerRef,
  children,
  position = 'bottomRight',
  className = ''
}: BasePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Use the custom hook for outside clicks
  useClickOutside(popoverRef, onClose, triggerRef)

  if (!isOpen) return null

  const positionClasses = {
    bottomRight: 'right-0 top-full mt-2',
    bottomLeft: 'left-0 top-full mt-2'
  }

  return (
    <div
      ref={popoverRef}
      className={cn(
        "absolute z-[60] bg-surface-container border border-outline-variant rounded-xl shadow-2xl animate-slide-in-top min-w-[200px]",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  )
}
