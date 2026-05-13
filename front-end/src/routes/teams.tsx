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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ManpowerStatCard } from '@/components/teams/ManpowerStatCard'
import { ResourceCard } from '@/components/teams/ResourceCard'
import { Breadcrumbs } from '@/components/base/Breadcrumbs'

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
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Teams' }]} />
          <h2 className="font-bold text-display-lg text-on-surface mb-1">Manpower Directory</h2>
          <p className="text-on-surface-variant text-body-md">Advanced resource allocation and skill mapping engine.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-glass px-4">
            <Filter className="w-4 h-4" /> Advanced Filters
          </button>
          <button className="btn-primary px-4">
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search by name, skill, or project ID..." 
            className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface text-label-md outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select className="bg-surface-container border border-outline-variant text-on-surface text-label-md rounded-lg px-3 py-2 outline-none focus:border-primary min-w-[140px]">
            <option>All Skills</option>
            <option>Kotlin</option>
            <option>React</option>
            <option>Python</option>
          </select>
          <select className="bg-surface-container border border-outline-variant text-on-surface text-label-md rounded-lg px-3 py-2 outline-none focus:border-primary min-w-[140px]">
            <option>Rank: All</option>
            <option>Senior</option>
            <option>Lead</option>
            <option>Associate</option>
          </select>
          <select className="bg-surface-container border border-outline-variant text-on-surface text-label-md rounded-lg px-3 py-2 outline-none focus:border-primary min-w-[140px]">
            <option>All Regions</option>
            <option>Americas</option>
            <option>EMEA</option>
            <option>APAC</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {RESOURCES.map(resource => (
          <ResourceCard key={resource.name} {...resource} />
        ))}
        
        {/* Onboard New Placeholder */}
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer group min-h-[160px]">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-all">
            <Plus className="w-8 h-8" />
          </div>
          <p className="text-headline-md font-bold text-on-surface-variant group-hover:text-on-surface mb-1 transition-colors">Onboard New Resource</p>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-label-md text-on-surface-variant">Showing 1 to 12 of 1,482 entries</p>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded bg-primary-container/20 text-primary border border-primary/20 font-bold">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-colors font-bold">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-colors font-bold">3</button>
          <span className="px-2 text-on-surface-variant">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-colors font-bold">124</button>
          <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
