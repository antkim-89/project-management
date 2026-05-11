import { createFileRoute } from '@tanstack/react-router'
import { CheckSquare, Plus } from 'lucide-react'
import styles from '@/assets/scss/routes/Tasks.module.scss'

export const Route = createFileRoute('/tasks')({
  component: Tasks,
})

function Tasks() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tasks</h1>
          <p className={styles.subtitle}>Stay on top of your daily goals and assignments.</p>
        </div>
        <button className={styles.actionButton}>
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>
      <div className={styles.list}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`${styles.taskItem} group`}>
            <div className={styles.taskContent}>
              <div className={`${styles.checkbox} group-hover:border-primary`}>
                <div className={styles.checkboxInner} />
              </div>
              <span className={styles.taskLabel}>Review design system implementation {i}</span>
            </div>
            <div className={styles.badge}>
              In Progress
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
