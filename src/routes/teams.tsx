import { createFileRoute } from '@tanstack/react-router'
import { 
  Users, 
  CheckCircle2, 
  CalendarCheck, 
  DollarSign, 
  Search, 
  Filter, 
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronRight as ChevronRightIcon
} from 'lucide-react'
import styles from '@/assets/scss/routes/Teams.module.scss'
import { ManpowerStatCard } from '@/components/teams/ManpowerStatCard'
import { ResourceCard } from '@/components/teams/ResourceCard'

export const Route = createFileRoute('/teams')({
  component: Teams,
})

const RESOURCES = [
  {
    name: "Marcus Aurelius",
    role: "Senior Principal Engineer",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_PFfiI-e4FRBUJWRPVcndiaIw7xONCsVs2F5JkQjTBL7uppiMo2YQ0m5a8mPx8RSFW_IXPAisPj5XYRqnNPpeBYSg4WnTsTxgkjwgmHx0nLl7fRVYXfY9eyi7YFlznmYU6c1fjZctHrF0fgjfwMAOHCHgmJJtpeU5snf-3AdHfUnPvmlM9JgpUqu6C4KUu8QGjZNrPJrVTFZy9MG4_ZqP6eOvXbPQnRqMeJ9I1AeTRwuC7D4BhL360hqiFW_Vpgw57GI3yRmqXAc",
    cost: "$12,400",
    location: "Berlin, DE",
    skills: ["Kotlin", "Spring Boot", "Microservices", "AWS"],
    status: "available" as const,
    matchScore: 98
  },
  {
    name: "Elena Rodriguez",
    role: "Lead Frontend Architect",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3qa9sUFtCA_RSSigw9rkk1tdqGNmvNrkuxrp3Rm3TVMpbDg3YvhjlqzKLT2VLcCSo4_BOBg-4ZbzgSHM56cia_KJNEs5DcUxPuvf-AEKaim4NIIOusJM4ZVdZqBG9nYV9_0_OMjrBcetfQC83MA4hHXBsvJL6X43kZsuLmBBHDcv3Cmhs39dUkiJaCIR9AXfspNLryVtjk2YMPX0DjLtwi43s-Z7mVqGosh7THM7G9aRIxL0QOdlHAGctiKN3bSQhrACLfTOPcJs",
    cost: "$10,800",
    location: "Madrid, ES",
    skills: ["Flutter", "React", "TypeScript"],
    status: "on-project" as const,
    matchScore: 87
  },
  {
    name: "Kenji Tanaka",
    role: "Machine Learning Engineer",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnR-z9ORACpNW-FCUSomRy4jJstxDwz153csMvfPZ_cqqck8QI5yot-y05E5gUQoDppNZYJfQHbzZweT9X42yuPwj_c03d72WpQx5vprbx0FliRh9o19hck4fURwEv2SjNwDKOQ7uJ-nnPEzEdgBFbMCWdCG5htLl8idxDOYuRxwCdisF0jlH8d1S_fHVJoF0NnPI10XOgY1_jtD3WgmFqjuxM8QJdCM0bML9eCnn_V9edy15sOgA84oXrYMMEaBYij2rUlpRlb3E",
    cost: "$11,200",
    location: "Tokyo, JP",
    skills: ["Python", "PyTorch", "SQL"],
    status: "on-leave" as const,
    matchScore: 72,
    availableDate: "Dec 04"
  },
  {
    name: "Sarah Jenkins",
    role: "SecOps Specialist",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKRC7QLUhU9iP7DRrAfehErC2d-7VGedi4v0krEiNwLs9GETRgZ9Ah8BDcp-ebeG9l3gKgDZ2_ks9zUT2cLkc7gEw3goUFpGopSergy7WI1sXTvB96JjVOsgNPtrXcDup5i9ET2wosaOax-fY44qOKIhySUEno3Q9phzyQY7Yy0dwLqZqSLXCIooarjA13pN1yGByeBqJApuylqq-117nMEjSLPZTl7C8oKgh7cNuoZOyBhWNScIbAghhrNekyvLigkPHwYtLdOOw",
    cost: "$13,500",
    location: "London, UK",
    skills: ["Ethical Hacking", "SIEM", "Docker"],
    status: "available" as const,
    matchScore: 92
  }
]

function Teams() {
  return (
    <div className={styles.container}>
      {/* Breadcrumbs & Title */}
      <div className={styles.headerSection}>
        <div>
          <nav className={styles.breadcrumb}>
            <Home className="w-3 h-3" />
            <span>Dashboard</span>
            <ChevronRightIcon className="w-3 h-3" />
            <span className="text-primary">Manpower Directory</span>
          </nav>
          <h2 className={styles.title}>Manpower Directory</h2>
          <p className={styles.subtitle}>Advanced resource allocation and skill mapping engine.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary}>
            <Filter className="w-4 h-4" /> Advanced Filters
          </button>
          <button className={styles.btnPrimary}>
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <ManpowerStatCard 
          title="Total Personnel" 
          value="1,482" 
          change="+12% vs LY" 
          icon={Users} 
          trend="up" 
        />
        <ManpowerStatCard 
          title="Utilization" 
          value="84.2%" 
          change="Optimal" 
          icon={CheckCircle2} 
          trend="neutral" 
          accentColor="secondary"
        />
        <ManpowerStatCard 
          title="Availability" 
          value="156" 
          change="32 New" 
          icon={CalendarCheck} 
          trend="up" 
          accentColor="secondary"
        />
        <ManpowerStatCard 
          title="Avg. M/M Cost" 
          value="$8,450" 
          change="Budget Bound" 
          icon={DollarSign} 
          trend="neutral" 
        />
      </div>

      {/* Search & Filter Strip */}
      <div className={styles.filterStrip}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name, skill, or project ID..." 
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterActions}>
          <select className={styles.select}>
            <option>All Skills</option>
            <option>Kotlin</option>
            <option>React</option>
            <option>Python</option>
          </select>
          <select className={styles.select}>
            <option>Rank: All</option>
            <option>Senior</option>
            <option>Lead</option>
            <option>Associate</option>
          </select>
          <select className={styles.select}>
            <option>All Regions</option>
            <option>Americas</option>
            <option>EMEA</option>
            <option>APAC</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className={styles.resourceGrid}>
        {RESOURCES.map(resource => (
          <ResourceCard key={resource.name} {...resource} />
        ))}
        
        {/* Onboard New Placeholder */}
        <div className={styles.addPlaceholder}>
          <div className={styles.addIconWrapper}>
            <Plus className="w-8 h-8" />
          </div>
          <p className={styles.addLabel}>Onboard New Resource</p>
        </div>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <p className={styles.pageInfo}>Showing 1 to 12 of 1,482 entries</p>
        <div className={styles.pageActions}>
          <button className={`${styles.pageBtn} ${styles.iconBtn}`}><ChevronLeft className="w-4 h-4" /></button>
          <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <span className="px-2">...</span>
          <button className={styles.pageBtn}>124</button>
          <button className={`${styles.pageBtn} ${styles.iconBtn}`}><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  )
}
