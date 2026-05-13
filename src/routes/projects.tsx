import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Calendar,
  TrendingUp,
  History,
  AlertTriangle,
  CheckCircle2,
  Archive,
  PauseCircle,
  Info,
  Zap,
  ChevronDown,
  ListFilter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { NewProjectCard } from '@/components/projects/NewProjectCard'
import { ProjectDetailModal } from '@/components/modal/layout/ProjectDetailModal'
import { Breadcrumbs } from '@/components/base/Breadcrumbs'

export const Route = createFileRoute('/projects')({
  component: Projects,
})

type ProjectStatus = 'ACTIVE' | 'AT RISK' | 'COMPLETED' | 'ON HOLD'

interface Project {
  id: string
  status: ProjectStatus
  title: string
  subtitle: string
  department: string
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
}

function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')

  const projectList: Project[] = [
    {
      id: '8821',
      status: 'ACTIVE',
      title: 'Global Data Migration',
      subtitle: 'Enterprise X · Q1-Q3 Phase',
      department: 'Cloud Infrastructure',
      scope: 'Comprehensive infrastructure overhaul for Enterprise X. This project involves migrating 4,500 legacy servers to a hybrid AWS/On-Prem architecture across 14 global regions. Focus is on zero-downtime transition and 40% reduction in annual operational overhead.',
      team: [
        { name: 'Sarah Jenkins', role: 'Lead Architect', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCju7PT9Yd1jw42Uqoghdu8bOnToHuBEsdC_byLJVEOKH2yMc4s8i8EuD__74GamRYyOmy2JbTBiwUA2o5VF9kuq0dNIv7ls-jHt3rOJLUVLYINy29GZz4lB06_696txg8OQ4HcUWSYMe0HQ7WQ4JpH8Iyce9bv8QhzUSFAWWLv5iFd0rhsdEmItn8FkpiVLWtb-zgXqeUw109kncprsGOWydglyAPu1umlPuKB996_RK1X8_3QPWGouK8q5cKQUHP1HYKuK9zfWvs' },
        { name: 'David Chen', role: 'Senior DevOps', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6vz5gZ5MSFV8WepZaRwG0T9FQF2nbJRNExpRw6zhWHBDdFeDNb13qdDyczoIfM5ogtwWSP06fpEC6hR_uMHlU2vbACq4Kg76s7PsZV-P0hxBxPpkKWtXW-Qf2nLcMVV1VlO2MYo7Zf4t38_cIzCJ3_8e-Evo2iQiTT8FrvQLywgelWOqfv0G6xg9IgF2a5vlkYVZ16BELZZYE4g-NG33A2j6MeA8nU_KAxCBLtQCRo6EIasj0To7dmUXj6WA8rFP3iripRqsPG4' },
        { name: 'Anita Ray', role: 'Security Engineer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAceCiD9TSp2I2r7AnyTjbGnPcUyGxPdi6WZHTUs7PcoFRQjMVKYMdrwcMENGn6CZIVyjMSZfwk2GosE1uP9eVyKBRKI8B_K5wiXG_89CNCVI4WQM7QoMRe_SXrsz_gySqfwI5vR8znmZr782B_-_DL6TElJJ9MzO-oDRZslGtlriVURgPpJOKmTl7w7SRzzEK0I3vKkf3vIxgjWVmHEyjGN730sX34eqoU65-m0_JKllhNH47mM2gSfeIJiUyH74Xgh_U5QU_VZWc' }
      ],
      activities: [
        { title: 'Region 4 Migration Completed', time: '2 hours ago', user: 'David Chen', type: 'success' },
        { title: 'Resource Reallocation: Security Audit', time: 'Yesterday', user: 'Anita Ray', type: 'info' },
        { title: 'New Documentation Uploaded', time: '2 days ago', user: 'Sarah Jenkins', type: 'neutral' }
      ],
      financials: {
        totalCost: '$450,000',
        burnRate: '$1,240',
        burnRatePercent: 45,
        allocatedHours: '4,200 hrs',
        consumedHours: '2,730 hrs',
        infrastructureFee: '$12,400'
      },
      milestones: [
        { title: 'Region 1-3 Setup', completed: true },
        { title: 'Core VPN Tunnels', completed: true },
        { title: 'Final UAT Phase', completed: false }
      ],
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlPCKzEd8otqFQLZNnxb3HgTi2hX6nNWyYSAeIvYqee_WzpMvOrSrK8dj9pakQMpI4G1MzOxqHW-K6xoRZNIvhfqPWkwltLum_23u9KhP1UZseaVofWymgt9hEjH-vlia1jX9_DCezC0butlTIfpEy5cLDLkHrPUIRk7nmxKvlM9L1uzao-D3weM0E8CkUHBnQc7L_iGfdmHY9Keohh7ywIBIZQNdeXMEZt-d8lUT7LqOrfs1OpnLWPwjQzUFDRTLM3sRh4al82fs',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAv0g9nNDhpuagyFX_JDsm2Xk31wQdB34kYj0HLv9fZdd8urnCbX8NNzphCAFzuEcg8PGpQcEGBeMFWaEaDnh0qtrpS2kQBN58c7tTx9w7EsHCfA41gv-3dz5cv9FHtvBzQl2fR9ehJ50a5UhYm9-vLb4F_lHUq0HEr_OQWqoC_jPAws4fYl46MevLdisr3rPoDe56NJsf9NP5vpe_9KJ1j_qqagGNogK_23NCJZyVAU2QScWjA-Plw8GzFjBClPmoOuvVChH3af78'
      ],
      avatarMore: 3,
      mmCost: '$14,200',
      progress: 68,
      period: 'Oct 12 - Dec 24',
      statusText: 'On Track',
      statusIcon: <TrendingUp className="w-4 h-4" />,
      periodIcon: <Calendar className="w-4 h-4" />,
      variant: 'secondary'
    },
    {
      id: '9014',
      status: 'AT RISK',
      title: 'Quantum Security Patch',
      subtitle: 'Core Security · Phase 2',
      department: 'Cyber Security',
      scope: 'Implementing post-quantum encryption across legacy nodes to ensure long-term data integrity and protection against future cryptographic threats.',
      team: [
        { name: 'Anita Ray', role: 'Security Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAceCiD9TSp2I2r7AnyTjbGnPcUyGxPdi6WZHTUs7PcoFRQjMVKYMdrwcMENGn6CZIVyjMSZfwk2GosE1uP9eVyKBRKI8B_K5wiXG_89CNCVI4WQM7QoMRe_SXrsz_gySqfwI5vR8znmZr782B_-_DL6TElJJ9MzO-oDRZslGtlriVURgPpJOKmTl7w7SRzzEK0I3vKkf3vIxgjWVmHEyjGN730sX34eqoU65-m0_JKllhNH47mM2gSfeIJiUyH74Xgh_U5QU_VZWc' }
      ],
      activities: [
        { title: 'Security Audit Failed', time: '1 hour ago', user: 'System', type: 'neutral' }
      ],
      financials: {
        totalCost: '$210,000',
        burnRate: '$3,500',
        burnRatePercent: 85,
        allocatedHours: '1,500 hrs',
        consumedHours: '1,420 hrs',
        infrastructureFee: '$5,000'
      },
      milestones: [
        { title: 'Initial Assessment', completed: true },
        { title: 'Algorithm Selection', completed: false }
      ],
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBpKuSw843oBbZt61M5aIQNjKm9IrnpoHBOnQ8oMxe69oofVofrjhsZIyEmKRQ9Q4bHlGwb1nuf1FUQIAsLov1Yjsp-Gw1C_GSr9e8OCUztfDeRrV1-PJrn3WtCW5kmHpybrMD2SnJtdxLotiV18qlGDuYW5R2yNJEA3mbcclEbbE6bcIw8GHqBT7vXGH_bx9dpLrj6FKRyDPNyj_SHlH-AWLtU7JwHiUjhgQYEtvNbviDAMAYVAH5LBW9izjnAcPj8lZFWsoHWC2M'
      ],
      avatarMore: 1,
      mmCost: '$21,500',
      progress: 32,
      period: 'Aug 01 - Oct 30',
      statusText: 'Budget Overrun',
      statusIcon: <AlertTriangle className="w-4 h-4" />,
      periodIcon: <History className="w-4 h-4" />,
      variant: 'error',
      isAtRisk: true
    },
    {
      id: '7220',
      status: 'COMPLETED',
      title: 'Server Refresh Ph.1',
      subtitle: 'IT Ops · Annual Refresh',
      department: 'IT Operations',
      scope: 'Standard annual hardware refresh for central data center nodes, including storage upgrades and network interface replacements.',
      team: [],
      activities: [],
      financials: {
        totalCost: '$120,000',
        burnRate: '$0',
        burnRatePercent: 0,
        allocatedHours: '500 hrs',
        consumedHours: '480 hrs',
        infrastructureFee: '$2,000'
      },
      milestones: [],
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCEQKD6t6VJDcLrcHz_3K4jLMASEU3Z5UsFS_gp4GTFG2J3WsXOPYRrpCc3I9J2U6iBIJAzrKZORt0u0KUgizvlkCwHH6dkL1oFneZVTf9X0nDuSZ95A93zIadIeEVQgTmQD_IdLzEioCZcLuYH0ktN7q7_nOEk2vkbsyAad9NhhbR5hpLeHJ_Ge9z6PgCP1n7D7njcjUtLVcE5LnJOXix56-T5yICNgMJnUtV9TrxIWmUHCkg3ztiz4eNYIuJs0It2JCcg1Gxtu6w'
      ],
      mmCost: '$8,900',
      progress: 100,
      period: 'Closed Sep 15',
      statusText: 'Archived',
      statusIcon: <Archive className="w-4 h-4" />,
      periodIcon: <CheckCircle2 className="w-4 h-4" />,
      variant: 'primary'
    },
    {
      id: '4412',
      status: 'ON HOLD',
      title: 'Unified Comms Upgrade',
      subtitle: 'Network · VoIP Migration',
      department: 'Network Ops',
      scope: 'Migrating legacy VoIP systems to a unified communication platform. Currently paused due to hardware supply chain delays.',
      team: [],
      activities: [],
      financials: {
        totalCost: '$85,000',
        burnRate: '$0',
        burnRatePercent: 0,
        allocatedHours: '800 hrs',
        consumedHours: '120 hrs',
        infrastructureFee: '$1,500'
      },
      milestones: [],
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAb-LhJ8b11KY18dhCTa20xePeRF0aQG4pcOspbeEm5dk7gJqCGOi_X_r9IBppr97z3n_ZSY93oZbFBh185jY_-Rqx1vkxdWUP3ZY-QDFBFgup67dsSEzRTcUamgBO1gPzD6KM4d8v_7n2d2EGLgofwpSSoniRWS_OiUdy2qLYzfP4MYAq4o5D4gyTlQTrqANsS2fSlbqzf-4mMNE0CHAt84QNuLYSvUWLZec32mU7yICPcpCXbmELa2UJSA32bDdLn39UJi_pmjAg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDrr6h75kiQNEYpHzBgOukhLVUcOi4yZluPif-sMobQ2YwLncr0wykpNIBI8GibOY860uDcHLjq2Lt6vRMjrVTZ2e_ie8Izi4M5qrj4NCski-cgvwYNN6zriiXv8MzCIcWetBxO3NFXLQOGClpwb9mZEOUd4PHOeETnWs8HiJ2fUk-LZIBtF46bkbwam4Gt45eYOkD68FQ3C4PmbKoKQd2Y4e0XlXc355mnNdS-aq0N9RkopIwle1cIvN7SxOBDuAiYwXTWx-BHQys'
      ],
      mmCost: '$5,400',
      progress: 45,
      period: 'Paused Oct 01',
      statusText: 'Waiting for Hardware',
      statusIcon: <Info className="w-4 h-4" />,
      periodIcon: <PauseCircle className="w-4 h-4" />,
      variant: 'neutral'
    },
    {
      id: '5567',
      status: 'ACTIVE',
      title: 'Client VPN Expansion',
      subtitle: 'Security · Remote Work',
      department: 'Cyber Security',
      scope: 'Expanding VPN capacity to support an additional 2,000 remote workers across APAC regions.',
      team: [],
      activities: [],
      financials: {
        totalCost: '$65,000',
        burnRate: '$800',
        burnRatePercent: 30,
        allocatedHours: '400 hrs',
        consumedHours: '150 hrs',
        infrastructureFee: '$4,000'
      },
      milestones: [],
      avatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDyYriOUbbj6ljihXKdDda_ggr-W7Ao_ylPuinLRSnaQCQCxhvh_w-rDAV7ZY8ntWyI08GUjkW4ooJH1ry2FfEOuVliQ7C1wKCz-0RTdP8Hme3KEIsDr9tBvIiUQ4Ee_Yrgw8yjU11ARJep3bT7zMqq-nAHiE-NjG0QQ7Q057qKn4cHQHXWYl9VqDAKg167iG9JAKszoedsfRu9VqNWPpn17Y6xKpMYPM99_xWp6SUFnzaTgMEUOzZmiLkisZ4Y6C_cKncTyrRkUZE'
      ],
      mmCost: '$12,800',
      progress: 82,
      period: 'Sep 01 - Nov 15',
      statusText: 'Accelerated',
      statusIcon: <Zap className="w-4 h-4" />,
      periodIcon: <Calendar className="w-4 h-4" />,
      variant: 'secondary'
    }
  ]

  const handleCardClick = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: 'Projects' }]} />
      
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-display-lg text-on-surface mb-1">Project Portfolio</h2>
          <p className="text-on-surface-variant text-body-md">Managing 12 active infrastructure deployments across 4 regions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container-low border border-outline-variant rounded p-1">
            {['ALL', 'ACTIVE', 'ON HOLD'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 text-label-caps font-bold rounded transition-colors tracking-widest",
                  activeFilter === filter ? "bg-primary-container/20 text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <select className="bg-surface-container-low border border-outline-variant text-on-surface text-label-md rounded px-3 py-2 outline-none focus:border-primary">
            <option>All Departments</option>
            <option>Network Ops</option>
            <option>Cloud Infrastructure</option>
            <option>Cyber Security</option>
          </select>
          <button className="flex items-center gap-2 text-on-surface-variant transition-all px-2 py-2 rounded cursor-pointer hover:bg-interaction-hover hover:text-on-surface active:bg-interaction-pressed active:scale-90">
            <ListFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projectList.map((project, index) => (
          <ProjectCard 
            key={index} 
            {...project} 
            onClick={() => handleCardClick(project)}
          />
        ))}

        {/* Placeholder: New Project Card */}
        <NewProjectCard />
      </div>

      {/* Pagination/Load More */}
      <div className="mt-8 flex justify-center">
        <button className="btn-glass px-6">
          View More Projects
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </div>
  )
}
