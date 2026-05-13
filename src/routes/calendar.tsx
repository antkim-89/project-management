import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectTimeline } from '@/components/projects/ProjectTimeline'
import { Breadcrumbs } from '@/components/base/Breadcrumbs'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
})

function CalendarPage() {
  const [activeTab, setActiveTab] = useState('Week')

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
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: 'Calendar' }]} />
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-display-lg text-on-surface mb-1">Timeline Availability</h2>
          <p className="text-on-surface-variant text-body-md">Real-time resource allocation and project roadmap synchronization.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container-low border border-outline-variant rounded p-1">
            {['Week', 'Month', 'Quarter'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-label-caps font-bold rounded transition-colors tracking-widest",
                  activeTab === tab ? "bg-primary-container/20 text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="btn-glass px-4">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <ProjectTimeline projects={projectList} />
    </div>
  )
}
