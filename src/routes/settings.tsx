import { createFileRoute } from '@tanstack/react-router'
import { User, Bell, Lock, Globe, Palette } from 'lucide-react'
import styles from '@/assets/scss/routes/Settings.module.scss'
import { Breadcrumbs } from '@/components/base/Breadcrumbs'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: 'Settings' }]} />
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>Configure your personal and workspace preferences.</p>
      
      <div className={styles.list}>
        <SettingItem icon={<User />} title="Profile" description="Update your personal information and avatar." />
        <SettingItem icon={<Palette />} title="Appearance" description="Customize the look and feel of your workspace." />
        <SettingItem icon={<Bell />} title="Notifications" description="Choose how and when you want to be notified." />
        <SettingItem icon={<Lock />} title="Security" description="Manage your password and account security." />
        <SettingItem icon={<Globe />} title="Language" description="Change the display language for the interface." />
      </div>
    </div>
  )
}

function SettingItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className={`${styles.item} group`}>
      <div className={styles.iconBox}>
        {icon}
      </div>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{title}</h3>
        <p className={styles.itemDesc}>{description}</p>
      </div>
      <button className={styles.editButton}>Edit</button>
    </div>
  )
}
