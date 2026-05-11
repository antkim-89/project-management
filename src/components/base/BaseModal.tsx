import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from '@/assets/scss/base/Modal.module.scss'

interface BaseModalProps {
  isOpen: boolean
  onClose?: () => void // Optional로 변경하여 경고 해결 및 유연성 확보
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}: BaseModalProps) {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalContainer} ${styles[size]}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - 제목이 있거나 닫기 기능이 있을 때만 렌더링 */}
        {(title || onClose) && (
          <header className={styles.modalHeader}>
            {title ? <h2 className={styles.modalTitle}>{title}</h2> : <div />}
            {onClose && (
              <button className={styles.closeBtn} onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            )}
          </header>
        )}

        {/* Content */}
        <div className={styles.modalContent}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className={styles.modalFooter}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
