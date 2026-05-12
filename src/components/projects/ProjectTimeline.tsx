import React from 'react'
import styles from '@/assets/scss/components/ProjectTimeline.module.scss'
import { AlertCircle } from 'lucide-react'

interface Project {
  id: string
  status: 'ACTIVE' | 'AT RISK' | 'COMPLETED' | 'ON HOLD'
  title: string
  avatars: string[]
  avatarMore?: number
  progress: number
  variant: string
}

interface ProjectTimelineProps {
  projects: Project[]
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects }) => {
  // Mock dates for the header
  const dates = [
    { day: 'MON', date: '15', isToday: true },
    { day: 'TUE', date: '16' },
    { day: 'WED', date: '17' },
    { day: 'THU', date: '18' },
    { day: 'FRI', date: '19' },
    { day: 'SAT', date: '20', isWeekend: true },
    { day: 'SUN', date: '21', isWeekend: true },
    { day: 'MON', date: '22' },
    { day: 'TUE', date: '23' },
    { day: 'WED', date: '24' },
  ]

  // Mock positions for the bars (in pixels, 80px per day)
  const getBarProps = (index: number, status: string) => {
    const offsets = [0, 80, 240, 0, 160]
    const widths = [480, 600, 320, 240, 400]
    
    return {
      left: offsets[index % offsets.length],
      width: widths[index % widths.length],
      statusClass: status === 'ACTIVE' ? styles.active : 
                   status === 'AT RISK' ? styles.atRisk : 
                   status === 'COMPLETED' ? styles.completed : styles.onHold
    }
  }

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <div className={styles.columnHeader}>
          <span>Active Projects</span>
        </div>
        <div className={styles.gridHeaderArea}>
          {dates.map((d, i) => (
            <div key={i} className={`${styles.dateHeaderCell} ${d.isToday ? styles.today : ''} ${d.isWeekend ? styles.weekend : ''}`}>
              <span className={styles.day}>{d.day}</span>
              <span className={styles.date}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timelineBody}>
        {projects.map((project, idx) => {
          const { left, width, statusClass } = getBarProps(idx, project.status)
          return (
            <div key={project.id} className={`${styles.projectRow} group`}>
              <div className={styles.projectInfoCell}>
                <div className={styles.titleWrapper}>
                  <span className={styles.projectTitle}>{project.title}</span>
                  <div className={`${styles.statusDot} ${
                    project.status === 'ACTIVE' ? styles.active : 
                    project.status === 'AT RISK' ? styles.atRisk : 
                    project.status === 'COMPLETED' ? styles.completed : styles.onHold
                  }`}></div>
                </div>
                <p className={styles.projectCode}>CODE: PRJ-{project.id}</p>
                <div className={styles.teamAvatars}>
                  {project.avatars.slice(0, 2).map((avatar, i) => (
                    <img key={i} src={avatar} alt="Team" />
                  ))}
                  {project.avatarMore && <div className={styles.more}>+{project.avatarMore}</div>}
                </div>
              </div>
              
              <div className={styles.gridBodyArea}>
                <div 
                  className={`${styles.projectBar} ${statusClass}`}
                  style={{ left: `${left}px`, width: `${width}px` }}
                >
                  <span className={styles.barLabel}>
                    {project.status === 'ACTIVE' ? `PHASE 1 • ${project.progress}%` : 
                     project.status === 'AT RISK' ? `CRITICAL • ${project.progress}%` : 
                     project.status === 'COMPLETED' ? 'DELIVERED' : 'ON HOLD'}
                  </span>
                  
                  {/* Mock staffing gap for "At Risk" projects */}
                  {project.status === 'AT RISK' && (
                    <div className={styles.staffingGap} style={{ left: '160px' }}>
                      <div className={styles.pattern}></div>
                      <AlertCircle className={styles.gapIcon + " w-3 h-3"} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
