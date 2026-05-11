import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  Calendar,
  Files,
  Settings,
  ChevronLeft,
  User as UserIcon
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/useUIStore'
import { useAuthStore } from '@/store/useAuthStore'
import styles from '@/assets/scss/layout/Sidebar.module.scss'

export function Sidebar() {
  const { t } = useTranslation()
  const { isSidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, isAuthenticated } = useAuthStore()

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
      <button
        className={styles.toggleButton}
        onClick={toggleSidebar}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

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
        {isAuthenticated && user ? (
          <div className={`${styles.userCard} group`}>
            <div className={styles.avatar}>
              <UserIcon className="w-4 h-4" />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userPlan}>{t('common.proPlan')}</span>
            </div>
          </div>
        ) : (
          <div className={`${styles.userCard} opacity-50 italic text-xs px-2`}>
            {t('sidebar.pleaseLogin')}
          </div>
        )}
      </div>
    </aside>
  )
}
