import { createFileRoute } from '@tanstack/react-router'
import { Briefcase, Plus } from 'lucide-react'
import styles from '@/assets/scss/routes/Projects.module.scss'

export const Route = createFileRoute('/projects')({
  component: Projects,
})

function Projects() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Manage and track all your active projects.</p>
        </div>
        <button className={styles.actionButton}>
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>
      <div className={styles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${styles.card} group`}>
            <div className={styles.cardIconBox}>
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className={styles.cardTitle}>Project Alpha {i}</h3>
            <p className={styles.cardDesc}>A high-priority project focused on infrastructure scaling.</p>
            <div className={styles.progressTrack}>
              <div className={styles.progressBar} style={{ width: '66%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
