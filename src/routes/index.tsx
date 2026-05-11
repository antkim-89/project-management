import { createFileRoute } from '@tanstack/react-router'
import {
  Users,
  Package,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Sun,
  FolderKanban,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import styles from '@/assets/scss/routes/Index.module.scss'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      {/* Title & Quick Stats Hero */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{t('common.overview')}</h2>
          <p className={styles.subtitle}>Monitor key metrics and manage your platform operations.</p>
        </div>
        <div className={styles.actionSection}>
          <button className={styles.dateButton}>
            <Calendar className="w-4 h-4" />
            This Month
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        {/* Main KPI Card */}
        <div className={`${styles.col8} ${styles.glassCard} ${styles.greetingCard}`}>
          <div className={styles.gradientBg} />
          <div>
            <h3 className={styles.greetingTitle}>Hope you're well, Alex</h3>
            <p className={styles.statusText}>
              Operational status is <span className={styles.stable}>Stable</span>. You have 4 pending approvals.
            </p>
          </div>
          <div className={styles.timeWeatherInfo}>
            <div className={styles.timeBox}>
              <p className={styles.time}>09:42 <span className={styles.period}>AM</span></p>
              <p className={styles.date}>MONDAY, OCTOBER 27, 2025</p>
            </div>
            <div className={styles.weatherBox}>
              <div className={styles.tempInfo}>
                <p className={styles.temp}>24°C</p>
                <p className={styles.city}>Sunny • Singapore</p>
              </div>
              <Sun className={styles.weatherIcon} />
            </div>
          </div>
        </div>

        {/* Circular Progress / Insights */}
        <div className={`${styles.col4} ${styles.glassCard} ${styles.insightsCard}`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">Insights</h4>
            <MoreHorizontal className="text-on-surface-variant cursor-pointer" />
          </div>
          <div className={styles.chartContainer}>
            <svg viewBox="0 0 192 192">
              <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-outline-variant/30" />
              <circle
                cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12"
                strokeDasharray="502" strokeDashoffset="75" strokeLinecap="round"
                className={`text-primary ${styles.chartGlow}`}
              />
            </svg>
            <div className={styles.chartValue}>
              <span className={styles.value}>85%</span>
              <span className={styles.label}>Efficiency</span>
            </div>
          </div>
          <div className={styles.metricList}>
            <MetricItem label="Task Completion" value="+12.4%" color="bg-primary" />
            <MetricItem label="Average Wait" value="32 min" color="bg-outline-variant" />
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className={`${styles.colStats} ${styles.glassCard} ${styles.statsCard} ${styles.emerald}`}>
          <div className={styles.statsHeader}>
            <Users className={`${styles.icon} text-emerald-400`} />
            <span className={`${styles.badge} bg-emerald-400/10 text-emerald-400`}>+3.2%</span>
          </div>
          <p className={styles.statsLabel}>Manpower Utilization</p>
          <p className={styles.statsValue}>85%</p>
        </div>

        <div className={`${styles.colStats} ${styles.glassCard} ${styles.statsCard} ${styles.blue}`}>
          <div className={styles.statsHeader}>
            <FolderKanban className={`${styles.icon} text-primary`} />
            <span className={`${styles.badge} bg-surface-container-highest text-on-surface-variant`}>Stable</span>
          </div>
          <p className={styles.statsLabel}>Total Active Projects</p>
          <p className={styles.statsValue}>24</p>
        </div>

        <div className={`${styles.colStats} ${styles.glassCard} ${styles.statsCard} ${styles.rose}`}>
          <div className={styles.statsHeader}>
            <Package className={`${styles.icon} text-rose-400`} />
            <span className={`${styles.badge} bg-rose-400/10 text-rose-400`}>Action Required</span>
          </div>
          <p className={styles.statsLabel}>Equipment Replacements</p>
          <p className={styles.statsValue}>12</p>
        </div>

        <div className={`${styles.colStats} ${styles.glassCard} ${styles.statsCard} ${styles.purple}`}>
          <div className={styles.statsHeader}>
            <DollarSign className={`${styles.icon} text-purple-400`} />
            <span className={`${styles.badge} bg-purple-400/10 text-purple-400`}>On Budget</span>
          </div>
          <p className={styles.statsLabel}>Monthly M/M Cost</p>
          <p className={styles.statsValue}>$184k</p>
        </div>

        {/* Main Area Chart - Manpower Availability */}
        <div className={`${styles.col8} ${styles.glassCard} ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div>
              <h4 className="text-lg font-bold">Manpower Availability</h4>
              <p className="text-sm text-on-surface-variant">Fluctuations across the current quarter</p>
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={`${styles.dot} bg-primary`} /> Full-time</div>
              <div className={styles.legendItem}><span className={`${styles.dot} bg-emerald-400`} /> Contractors</div>
            </div>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.gridLines}>
              <div /><div /><div /><div />
            </div>
            <svg viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,180 C100,160 200,80 300,100 C400,120 500,40 600,60 C700,80 800,50 L800,200 L0,200 Z" fill="url(#areaGradient)" />
              <path d="M0,180 C100,160 200,80 300,100 C400,120 500,40 600,60 C700,80 800,50" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />
              <circle cx="500" cy="40" r="4" fill="var(--color-primary)" />
            </svg>
          </div>
          <div className={styles.chartFooter}>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Calendar / Milestones */}
        <div className={`${styles.col4} ${styles.glassCard}`}>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Milestones</h4>
            <div className="flex gap-2">
              <Clock className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-on-surface" />
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-on-surface-variant mb-4">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs mb-6">
            {[...Array(35)].map((_, i) => (
              <span key={i} className={`p-2 ${i === 26 ? 'bg-primary text-white rounded-full' : (i < 3 || i > 31 ? 'opacity-20' : '')}`}>
                {(i % 31) + 1}
              </span>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Upcoming Today</p>
            <MilestoneItem name="Project Alpha Deployment" time="14:00" color="bg-emerald-400" />
            <MilestoneItem name="Q4 Resource Planning" time="16:30" color="bg-primary" />
          </div>
        </div>

        {/* Bottom Tasks and Lists Section */}
        <div className={`${styles.col8} ${styles.glassCard} ${styles.listSection}`}>
          <div className={styles.listHeader}>
            <h4 className={styles.title}>Quick Tasks & Approvals</h4>
            <button className={styles.viewAll}>View All</button>
          </div>
          <div className={styles.listItems}>
            <TaskItem
              icon={<Users className="w-5 h-5" />}
              name="Leave Request: Sarah Miller"
              desc="Annual Leave • 3 Days • Pending Approval"
            />
            <TaskItem
              icon={<DollarSign className="w-5 h-5" />}
              name="Purchase Order: Server Rack B4"
              desc="$2,450.00 • IT Infrastructure"
            />
          </div>
        </div>

        {/* Project Efficiency Bento Cell */}
        <div className={`${styles.col4} ${styles.glassCard} ${styles.progressSection}`}>
          <h4 className="text-lg font-bold mb-6">Project Cost Efficiency</h4>
          <div className="space-y-6">
            <ProgressItem name="Data Center Migration" percent={92} color="bg-emerald-400" />
            <ProgressItem name="Network Security Audit" percent={78} color="bg-primary" />
            <ProgressItem name="Cloud Infrastructure Build" percent={45} color="bg-rose-400" />
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <p className={styles.label}>Total Saving</p>
              <p className={`${styles.value} text-emerald-400`}>+$12.4k</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.label}>Est. Completion</p>
              <p className={styles.value}>Dec 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className={styles.metricItem}>
      <div className={styles.metricLabel}>
        <div className={`${styles.dot} ${color}`} />
        <span>{label}</span>
      </div>
      <span className={styles.metricValue}>{value}</span>
    </div>
  )
}

function MilestoneItem({ name, time, color }: { name: string, time: string, color: string }) {
  return (
    <div className="flex gap-3 items-center p-2 rounded-xl bg-surface-container-high/50 border border-outline-variant/30">
      <div className={`w-1 h-8 rounded-full ${color}`} />
      <div>
        <p className="text-sm font-bold text-on-surface">{name}</p>
        <p className="text-[10px] text-on-surface-variant">{time} • Conference Room A</p>
      </div>
    </div>
  )
}

function TaskItem({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) {
  return (
    <div className={styles.listItem}>
      <div className={styles.itemContent}>
        <div className={styles.itemIconBox}>{icon}</div>
        <div className={styles.itemText}>
          <p className={styles.itemName}>{name}</p>
          <p className={styles.itemDesc}>{desc}</p>
        </div>
      </div>
      <div className={styles.itemActions}>
        <button className={`${styles.actionBtn} ${styles.reject}`}><XCircle className="w-5 h-5" /></button>
        <button className={`${styles.actionBtn} ${styles.approve}`}><CheckCircle2 className="w-5 h-5" /></button>
      </div>
    </div>
  )
}

function ProgressItem({ name, percent, color }: { name: string, percent: number, color: string }) {
  return (
    <div className={styles.progressItem}>
      <div className={styles.progressHeader}>
        <span className={styles.name}>{name}</span>
        <span className={`${styles.percent} ${percent > 80 ? 'text-emerald-400' : 'text-on-surface'}`}>{percent}%</span>
      </div>
      <div className={styles.progressBar}>
        <div className={`${styles.fill} ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
