import { createFileRoute } from '@tanstack/react-router'
import { 
  Home, 
  ChevronRight, 
  Filter, 
  Download, 
  Laptop, 
  Monitor, 
  Smartphone, 
  MoreVertical, 
  AlertTriangle,
  Activity,
  Award,
  BookOpen,
  ShoppingCart,
  Check,
  X,
  Clock,
  Package,
  TrendingDown,
  Info
} from 'lucide-react'
import styles from '@/assets/scss/routes/Assets.module.scss'
import { ManpowerStatCard } from '@/components/teams/ManpowerStatCard'

export const Route = createFileRoute('/assets')({
  component: Assets,
})

const ASSETS = [
  {
    name: "MacBook Pro M3",
    sn: "4921-MBP",
    user: "John Doe",
    userInitial: "JD",
    health: 85,
    status: "Optimal",
    icon: Laptop,
    urgent: false
  },
  {
    name: 'Dell UltraSharp 32"',
    sn: "1022-MON",
    user: "Alice Smith",
    userInitial: "AS",
    health: 15,
    status: "Urgent Replacement",
    icon: Monitor,
    urgent: true
  },
  {
    name: "Surface Laptop 5",
    sn: "7712-SLT",
    user: "Robert King",
    userInitial: "RK",
    health: 45,
    status: "In Use",
    icon: Laptop,
    urgent: false
  }
]

const COURSES = [
  {
    title: "AWS Cloud Mastery",
    chapters: "12 Chapters",
    type: "Digital",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0_S07uN2i-htDInxiKCwRpfeJSnvVpyAGsCXZMLiwCQQd_BoDOVNcOlghtLi-Ot5udKkplsaLgaEr7RD9L56CSsPVAHsiOMpku8oDuoc73YQyHeJTqwjQt6CyYSdZ_MUHjvakBRgsmg3yMlEiMP6bBWWZZMvn8S900Xbuw_wQ4HzVY3dDbIzU9DWBDZZTM8laP6Y72LRptA9Xnxe3DdBybBG220LRexD4ejGo1z7wbSSSpQl55sopd2gVKnPWROc6F4HlBbdwoDI"
  },
  {
    title: "Systemic Design",
    chapters: "5 Units Available",
    type: "Hardcopy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3wzCk0zmkGKQVlGEQJN1mTsliNEz-KUTIXsJSaC_XnRMppdXP5n3fq8qSX74ondayqkh8I-p3oOylhgv3LBE_2H1x5p9bFk8TBDz7kaD2OuRUtq0QfXoKBNMXM8GabNzm_BOVeBhR7ipGj9N10PggRxLZty3AI_atmhu_FjgrxyRb2h2c8CFRLUu46Lm7uRNRqyqnZsWKq0VEZGLlYyYJ5fCMHQSXvnTdP8zjNM1qb-wdADzFzAKhBoLRFx842uk7UCVMXkIafUE"
  }
]

function Assets() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <nav className={styles.breadcrumb}>
            <Home size={12} />
            <span>/</span>
            <span>Assets & Welfare</span>
          </nav>
          <h2 className={styles.title}>Resource Lifecycle</h2>
          <p className={styles.subtitle}>Manage global inventory and employee development programs.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary}><Filter size={14} /> Filter View</button>
          <button className={styles.btnSecondary}><Download size={14} /> Export Inventory</button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Section: Inventory */}
        <div className={styles.leftSection}>
          <div className={styles.sectionHeader}>
            <h3><Package size={18} className="text-primary" /> Asset Inventory</h3>
            <span className={styles.count}>42 Active Units</span>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Assigned User</th>
                    <th>Life Cycle</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ASSETS.map(asset => (
                    <tr key={asset.sn} className={asset.urgent ? styles.urgent : ''}>
                      <td>
                        <div className={styles.assetInfo}>
                          <asset.icon className={`${styles.icon} ${asset.urgent ? styles.urgent : ''}`} />
                          <div>
                            <div className={styles.name}>{asset.name}</div>
                            <div className={styles.sn}>SN: {asset.sn}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.userBadge}>
                          <div className={styles.avatar}>{asset.userInitial}</div>
                          <span className="text-sm">{asset.user}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.healthBar}>
                          <div 
                            className={`${styles.progress} ${asset.health < 20 ? 'bg-error' : asset.health < 50 ? 'bg-primary' : 'bg-secondary'}`} 
                            style={{ width: `${asset.health}%` }} 
                          />
                        </div>
                        <div className={`text-[10px] mt-1 font-mono ${asset.urgent ? 'text-error' : 'text-outline'}`}>
                          {asset.health}% Health
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          asset.urgent ? 'bg-error/20 text-error border border-error/20' : 'bg-secondary/10 text-secondary'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          {asset.urgent ? <AlertTriangle size={18} className="text-error" /> : <MoreVertical size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={`${styles.glassCard} p-4 rounded-xl`}>
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">Replacement Budget</div>
              <div className="text-2xl font-mono text-on-surface">$12,450</div>
              <div className="flex items-center gap-1 text-secondary text-[10px] mt-2">
                <TrendingDown size={14} />
                -5% from last month
              </div>
            </div>
            <div className={`${styles.glassCard} p-4 rounded-xl`}>
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">Out of Warranty</div>
              <div className="text-2xl font-mono text-on-surface">08</div>
              <div className="flex items-center gap-1 text-error text-[10px] mt-2">
                <AlertTriangle size={14} />
                Requires auditing
              </div>
            </div>
            <div className={`${styles.glassCard} p-4 rounded-xl`}>
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">Average Age</div>
              <div className="text-2xl font-mono text-on-surface">2.4 <span className="text-sm font-normal">yrs</span></div>
              <div className="flex items-center gap-1 text-primary text-[10px] mt-2">
                <Info size={14} />
                Healthy fleet status
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Welfare */}
        <div className={styles.rightSection}>
          <div className={styles.sectionHeader}>
            <h3><Activity size={18} className="text-secondary" /> Employee Welfare</h3>
            <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className={styles.welfareGrid}>
            {COURSES.map(course => (
              <div key={course.title} className={styles.courseCard}>
                <div className={styles.imageWrapper}>
                  <img src={course.image} alt={course.title} />
                  <div className={styles.overlay} />
                  <span className={styles.badge}>{course.type}</span>
                </div>
                <div className={styles.content}>
                  <h4>{course.title}</h4>
                  <p>{course.chapters}</p>
                  <button className={styles.btn}>{course.type === 'Digital' ? 'Request Access' : 'Borrow'}</button>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.purchaseBtn}>
            <ShoppingCart size={18} /> Request Purchase
          </button>

          <div className={styles.approvalList}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Pending Approvals</div>
              <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">2</span>
            </div>
            
            <div className={styles.item}>
              <div className={styles.iconBox}><Laptop size={14} /></div>
              <div className={styles.info}>
                <div className={styles.name}>MacBook Pro Upgrade</div>
                <div className={styles.requester}>Requested by Michael Chen</div>
              </div>
              <div className={styles.actions}>
                <button className={styles.approve}><Check size={14} /></button>
                <button className={styles.reject}><X size={14} /></button>
              </div>
            </div>

            <div className={styles.item}>
              <div className={styles.iconBox}><Award size={14} className="text-secondary" /></div>
              <div className={styles.info}>
                <div className={styles.name}>Advanced PM Training</div>
                <div className={styles.requester}>Requested by Sarah Jenkins</div>
              </div>
              <div className={styles.actions}>
                <button className={styles.approve}><Check size={14} /></button>
                <button className={styles.reject}><X size={14} /></button>
              </div>
            </div>
          </div>

          <div className={`${styles.glassCard} p-4 rounded-xl`}>
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Well-being Calendar</div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-12 h-14 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-[10px] font-bold text-primary">NOV</div>
                <div className="text-lg font-black text-primary leading-none">18</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface">Mental Health Workshop</div>
                <div className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  14:00 - 15:30 • Zoom
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
