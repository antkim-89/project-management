import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from '@/assets/scss/routes/Calendar.module.scss'

export const Route = createFileRoute('/calendar')({
  component: Calendar,
})

function Calendar() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.subtitle}>Schedule meetings and deadlines effectively.</p>
        </div>
        <div className={styles.controls}>
          <button className={styles.controlButton}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className={styles.currentMonth}>May 2026</span>
          <button className={styles.controlButton}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className={styles.calendarBoard}>
        <div className={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={styles.dayCell}>
              <span className={styles.dayNumber}>{(i % 31) + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
