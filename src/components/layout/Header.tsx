import { useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Briefcase, Globe, LogOut, User as UserIcon, LogIn, Sun, Moon, Settings, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { UserDetailModal } from '@/components/modal/layout/UserDetailModal'
import { BasePopover } from '@/components/base/BasePopover'
import styles from '@/assets/scss/layout/Header.module.scss'

export function Header() {
  const { t, i18n } = useTranslation()
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const userBtnRef = useRef<HTMLButtonElement>(null)

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ko' : 'en'
    i18n.changeLanguage(nextLang)
  }

  const handleUserClick = () => {
    setIsPopoverOpen(!isPopoverOpen)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsPopoverOpen(false)
  }

  return (
    <>
      <header className={styles.header}>
        {/* Left: Brand Logo & Navigation */}
        <div className={styles.leftSection}>
          <Link to="/" className={styles.brand}>
            <div className={styles.brandIcon}>
              <Briefcase className="w-5 h-5" />
            </div>
            <span className={styles.brandName}>ProManage</span>
          </Link>
        </div>

        {/* Right: User, Language, Theme, Auth */}
        <div className={styles.rightSection}>
          {/* Theme Toggle */}
          <button 
            className={styles.langSelect} 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span className="uppercase">{theme}</span>
          </button>

          {/* Language Selector */}
          <button className={styles.langSelect} onClick={toggleLanguage}>
            <Globe className="w-4 h-4" />
            <span className="uppercase">{i18n.language.split('-')[0]}</span>
          </button>

          <div className={styles.divider} />

          {/* Auth Group */}
          <div className={styles.authGroup}>
            {isAuthenticated && user ? (
              <>
                <button 
                  ref={userBtnRef}
                  className={styles.userInfo} 
                  onClick={handleUserClick}
                >
                  <div className={styles.avatar}>
                    {user.name.charAt(0)}
                  </div>
                  <span className={styles.userName}>{user.name}</span>
                </button>

                {/* BasePopover Integration */}
                <BasePopover
                  isOpen={isPopoverOpen}
                  onClose={() => setIsPopoverOpen(false)}
                  triggerRef={userBtnRef}
                  position="bottomRight"
                  className={styles.userPopover}
                >
                  <div className={styles.popoverHeader}>
                    <div className={styles.popoverAvatar}>{user.name.charAt(0)}</div>
                    <div className={styles.popoverName}>{user.name}</div>
                    <div className={styles.popoverEmail}>{user.email}</div>
                  </div>
                  <div className={styles.popoverContent}>
                    <button className={styles.popoverItem} onClick={handleOpenModal}>
                      <UserIcon className="w-4 h-4" />
                      <span>Profile Detail</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </button>
                    <button className={styles.popoverItem}>
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    <div className={styles.popoverDivider} />
                    <button className={styles.popoverItem} onClick={logout}>
                      <LogOut className="w-4 h-4" />
                      <span>{t('common.logout')}</span>
                    </button>
                  </div>
                </BasePopover>
              </>
            ) : (
              <button className={styles.logoutBtn} onClick={login}>
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>{t('common.login')}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Detail Modal */}
      <UserDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
