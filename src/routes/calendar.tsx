import { createFileRoute } from '@tanstack/react-router'
import { CalendarRange, Download } from 'lucide-react'
import styles from '@/assets/scss/routes/Projects.module.scss'
import { ProjectTimeline } from '@/components/projects/ProjectTimeline'
import { Breadcrumbs } from '@/components/base/Breadcrumbs'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
})

function CalendarPage() {
  const projectList = [
    {
      id: '8821',
      status: 'ACTIVE' as const,
      title: 'Global Data Migration',
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlPCKzEd8otqFQLZNnxb3HgTi2hX6nNWyYSAeIvYqee_WzpMvOrSrK8dj9pakQMpI4G1MzOxqHW-K6xoRZNIvhfqPWkwltLum_23u9KhP1UZseaVofWymgt9hEjH-vlia1jX9_DCezC0butlTIfpEy5cLDLkHrPUIRk7nmxKvlM9L1uzao-D3weM0E8CkUHBnQc7L_iGfdmHY9Keohh7ywIBIZQNdeXMEZt-d8lUT7LqOrfs1OpnLWPwjQzUFDRTLM3sRh4al82fs',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAv0g9nNDhpuagyFX_JDsm2Xk31wQdB34kYj0HLv9fZdd8urnCbX8NNzphCAFzuEcg8PGpQcEGBeMFWaEaDnh0qtrpS2kQBN58c7tTx9w7EsHCfA41gv-3dz5cv9FHtvBzQl2fR9ehJ50a5UhYm9-vLb4F_lHUq0HEr_OQWqoC_jPAws4fYl46MevLdisr3rPoDe56NJsf9NP5vpe_9KJ1j_qqagGNogK_23NCJZyVAU2QScWjA-Plw8GzFjBClPmoOuvVChH3af78'
      ],
      avatarMore: 3,
      progress: 68,
      variant: 'secondary'
    },
    {
      id: '9014',
      status: 'AT RISK' as const,
      title: 'Quantum Security Patch',
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBpKuSw843oBbZt61M5aIQNjKm9IrnpoHBOnQ8oMxe69oofVofrjhsZIyEmKRQ9Q4bHlGwb1nuf1FUQIAsLov1Yjsp-Gw1C_GSr9e8OCUztfDeRrV1-PJrn3WtCW5kmHpybrMD2SnJtdxLotiV18qlGDuYW5R2yNJEA3mbcclEbbE6bcIw8GHqBT7vXGH_bx9dpLrj6FKRyDPNyj_SHlH-AWLtU7JwHiUjhgQYEtvNbviDAMAYVAH5LBW9izjnAcPj8lZFWsoHWC2M'
      ],
      avatarMore: 1,
      progress: 32,
      variant: 'error'
    },
    {
      id: '7220',
      status: 'COMPLETED' as const,
      title: 'Server Refresh Ph.1',
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCEQKD6t6VJDcLrcHz_3K4jLMASEU3Z5UsFS_gp4GTFG2J3WsXOPYRrpCc3I9J2U6iBIJAzrKZORt0u0KUgizvlkCwHH6dkL1oFneZVTf9X0nDuSZ95A93zIadIeEVQgTmQD_IdLzEioCZcLuYH0ktN7q7_nOEk2vkbsyAad9NhhbR5hpLeHJ_Ge9z6PgCP1n7D7njcjUtLVcE5LnJOXix56-T5yICNgMJnUtV9TrxIWmUHCkg3ztiz4eNYIuJs0It2JCcg1Gxtu6w'
      ],
      progress: 100,
      variant: 'primary'
    }
  ]

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Calendar' }]} />
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Timeline Availability</h2>
          <p className={styles.subtitle}>Real-time resource allocation and project roadmap synchronization.</p>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterToggle}>
            <button className={styles.active}>Week</button>
            <button>Month</button>
            <button>Quarter</button>
          </div>
          <button className={styles.loadMoreButton}>
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <ProjectTimeline projects={projectList} />
    </div>
  )
}
