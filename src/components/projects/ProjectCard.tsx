import React from 'react'
import { MoreVertical } from 'lucide-react'
import styles from '@/assets/scss/routes/Projects.module.scss'

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
  const badgeClass = status === 'ACTIVE' ? styles.active : 
                    status === 'AT RISK' ? styles.atRisk :
                    status === 'COMPLETED' ? styles.completed :
                    styles.onHold

  return (
    <div 
      className={`${styles.glassCard} ${isAtRisk ? styles.borderLeftError : ''} group cursor-pointer`}
      onClick={onClick}
    >
      <div className={styles.cardHeader}>
        <div>
          <span className={`${styles.badge} ${badgeClass}`}>{status}</span>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        <button className={styles.cardMenuButton}><MoreVertical className="w-5 h-5" /></button>
      </div>
      <div className={styles.teamSection}>
        <div className={styles.avatars}>
          {avatars.map((url, idx) => (
            <img key={idx} src={url} alt="Team member" />
          ))}
          {avatarMore && <div className={styles.avatarMore}>+{avatarMore}</div>}
        </div>
        <span className={styles.departmentName}>{department}</span>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.metricsGrid}>
          <div>
            <p className={styles.metricLabel}>M/M COST</p>
            <p className={`${styles.metricValue} ${variant === 'error' ? styles.error : ''}`}>{mmCost}</p>
          </div>
          <div>
            <p className={styles.metricLabel}>PROGRESS</p>
            <div className={styles.progressContainer}>
              <p className={`${styles.progressPercent} ${styles[variant]}`}>{progress}%</p>
              <div className={styles.progressBarTrack}>
                <div className={`${styles.progressBarFill} ${styles[variant]}`} style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.footerItem}>{periodIcon} {period}</span>
          <span className={`${styles.footerItem} ${styles[variant]}`}>{statusIcon} {statusText}</span>
        </div>
      </div>
    </div>
  )
}
