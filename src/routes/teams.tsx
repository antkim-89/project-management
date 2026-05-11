import { createFileRoute } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import styles from '@/assets/scss/routes/Teams.module.scss'

export const Route = createFileRoute('/teams')({
  component: Teams,
})

function Teams() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Teams</h1>
          <p className={styles.subtitle}>Collaborate with your team members across projects.</p>
        </div>
        <button className={styles.actionButton}>
          <UserPlus className="w-5 h-5" /> Invite Member
        </button>
      </div>
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.card}>
            <div className={styles.avatar}>TM</div>
            <h3 className={styles.cardTitle}>Team Member {i}</h3>
            <p className={styles.cardDesc}>Senior Developer</p>
            <div className={styles.tagList}>
              <div className={styles.tag}>React</div>
              <div className={styles.tag}>TS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
