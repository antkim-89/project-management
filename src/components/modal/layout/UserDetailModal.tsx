import { Mail, Shield, Calendar, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/useAuthStore'
import { BaseModal } from '@/components/base/BaseModal'
import styles from '@/assets/scss/modal/layout/UserDetailModal.module.scss'

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserDetailModal({ isOpen, onClose }: UserDetailModalProps) {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  if (!user) return null

  const footer = (
    <button className={styles.primaryBtn} onClick={onClose}>
      Confirm
    </button>
  )

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${t('common.overview')} - ${user.name}`}
      footer={footer}
      size="md"
    >
      <div className={styles.profileSection}>
        <div className={styles.avatarLarge}>
          {user.name.charAt(0)}
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.userName}>{user.name}</h3>
          <p className={styles.userPlanBadge}>{user.plan} {t('common.proPlan')}</p>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <Mail className={styles.infoIcon} />
          <div className={styles.infoText}>
            <label>Email</label>
            <span>{user.email}</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Shield className={styles.infoIcon} />
          <div className={styles.infoText}>
            <label>Role</label>
            <span>Administrator</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <Calendar className={styles.infoIcon} />
          <div className={styles.infoText}>
            <label>Joined</label>
            <span>2026.01.27</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <MapPin className={styles.infoIcon} />
          <div className={styles.infoText}>
            <label>Location</label>
            <span>Seoul, Korea</span>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
