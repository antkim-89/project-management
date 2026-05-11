import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  Calendar,
  Files,
  Settings,
  ChevronLeft
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/useUIStore'
import styles from '@/assets/scss/layout/Sidebar.module.scss'

export function Sidebar() {
  const { t } = useTranslation()
  const { isSidebarCollapsed, toggleSidebar } = useUIStore()

  const menuItems = [
    { icon: LayoutDashboard, label: t('common.dashboard'), to: '/' },
    { icon: Briefcase, label: t('common.projects'), to: '/projects' },
    { icon: CheckSquare, label: t('common.tasks'), to: '/tasks' },
    { icon: Users, label: t('common.teams'), to: '/teams' },
    { icon: Calendar, label: t('common.calendar'), to: '/calendar' },
    { icon: Files, label: t('common.files'), to: '/files' },
    { icon: Settings, label: t('common.settings'), to: '/settings' },
  ]

  return (
    <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>


      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`${styles.navLink} group`}
            activeProps={{ className: styles.activeLink }}
          >
            <div className={styles.linkContent}>
              <item.icon className={styles.linkIcon} />
              <span className={styles.linkLabel}>{item.label}</span>
            </div>
            <ChevronLeft className={styles.linkChevron} />
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        {!isSidebarCollapsed && (
          <div className={styles.copyright}>
            {t('common.copyright')}
          </div>
        )}
        <button
          className={styles.toggleButton}
          onClick={toggleSidebar}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
