import React from 'react'
import { PlusCircle } from 'lucide-react'
import styles from '@/assets/scss/routes/Projects.module.scss'

export const NewProjectCard: React.FC = () => {
  return (
    <div className={`${styles.newProjectCard} group`}>
      <div className={styles.newProjectIcon}>
        <PlusCircle className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className={styles.newProjectTitle}>Initiate Project</p>
        <p className={styles.newProjectDesc}>Define scope and allocate initial resources.</p>
      </div>
    </div>
  )
}
