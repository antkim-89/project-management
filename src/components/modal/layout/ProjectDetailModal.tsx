import React, { useEffect } from 'react'
import { X, Edit2, Share2, Check, History, FileText, TrendingDown, CheckCircle2 } from 'lucide-react'
import styles from '@/assets/scss/modal/layout/ProjectDetailModal.module.scss'

interface ProjectDetailModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    status: 'ACTIVE' | 'AT RISK' | 'COMPLETED' | 'ON HOLD'
    id: string
    title: string
    subtitle: string
    scope: string
    team: { name: string; role: string; avatar: string }[]
    activities: { title: string; time: string; user: string; type: 'success' | 'info' | 'neutral' }[]
    financials: {
      totalCost: string
      burnRate: string
      burnRatePercent: number
      allocatedHours: string
      consumedHours: string
      infrastructureFee: string
    }
    milestones: { title: string; completed: boolean }[]
  } | null
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ isOpen, onClose, project }) => {
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

  if (!isOpen || !project) return null

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return styles.active
      case 'AT RISK': return styles.atRisk
      case 'COMPLETED': return styles.completed
      case 'ON HOLD': return styles.onHold
      default: return ''
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
          <div className={styles.headerContent}>
            <div>
              <div className={styles.badgeWrapper}>
                <div className={`${styles.badge} ${getStatusClass(project.status)}`}>
                  <span className={styles.dot}></span>
                  {project.status}
                </div>
                <span className={styles.projectId}>#{project.id}</span>
              </div>
              <h2 className={styles.projectTitle}>{project.title}</h2>
              <p className={styles.projectSubtitle}>{project.subtitle}</p>
            </div>
            <div className={styles.actionButtons}>
              <button><Edit2 className="w-4 h-4" /></button>
              <button><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className={styles.modalBody}>
          {/* Main Info (Left 2/3) */}
          <div className={styles.mainInfo}>
            {/* Description */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>Project Scope</h4>
              </div>
              <p className={styles.scopeText}>{project.scope}</p>
            </div>

            {/* Team */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>Assigned Personnel ({project.team.length})</h4>
                <button className={styles.manageBtn}>Manage Team</button>
              </div>
              <div className={styles.teamGrid}>
                {project.team.map((member, idx) => (
                  <div key={idx} className={styles.teamMember}>
                    <img src={member.avatar} alt={member.name} />
                    <div>
                      <p className={styles.memberName}>{member.name}</p>
                      <p className={styles.memberRole}>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>Recent Activity</h4>
              </div>
              <div className={styles.activityList}>
                {project.activities.map((activity, idx) => (
                  <div key={idx} className={styles.activityItem}>
                    <div className={`${styles.iconBox} ${styles[activity.type]}`}>
                      {activity.type === 'success' ? <Check className="w-2.5 h-2.5" /> : 
                       activity.type === 'info' ? <History className="w-2.5 h-2.5" /> : 
                       <FileText className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <p className={styles.activityTitle}>{activity.title}</p>
                      <p className={styles.activityMeta}>{activity.time} · {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics & Budget (Right 1/3) */}
          <div className={styles.sidePanel}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>Financial Health</h4>
              </div>
              <div className={styles.financialCard}>
                <p className={styles.label}>Total M/M Cost</p>
                <p className={styles.value}>{project.financials.totalCost}</p>
                <div className={styles.trend}>
                  <TrendingDown className="w-3 h-3" />
                  12% below forecast
                </div>
              </div>
              <div className={styles.burnRateCard}>
                <p className={styles.label}>Current Burn Rate</p>
                <p className={styles.value}>{project.financials.burnRate} <span className="text-[10px] text-outline font-sans">/ day</span></p>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${project.financials.burnRatePercent}%` }}></div>
                </div>
              </div>
              <div className={styles.financialDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Allocated Hours</span>
                  <span className={styles.value}>{project.financials.allocatedHours}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Consumed Hours</span>
                  <span className={styles.value}>{project.financials.consumedHours}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Infrastructure Fee</span>
                  <span className={styles.value}>{project.financials.infrastructureFee}</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>Key Milestones</h4>
              </div>
              <div className={styles.milestoneList}>
                {project.milestones.map((milestone, idx) => (
                  <div key={idx} className={styles.milestoneItem}>
                    {milestone.completed ? <CheckCircle2 className={styles.checkIcon} /> : <div className={styles.pendingIcon} />}
                    <span className={styles.title}>{milestone.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className={styles.reportBtn}>View Full Report</button>
          </div>
        </div>
      </div>
    </div>
  )
}
