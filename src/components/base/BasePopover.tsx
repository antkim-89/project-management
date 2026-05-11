import React, { useRef } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import styles from '@/assets/scss/base/Popover.module.scss'

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

  return (
    <div 
      ref={popoverRef} 
      className={`${styles.popoverContainer} ${styles[position]} ${className}`}
    >
      {children}
    </div>
  )
}
