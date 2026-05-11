import { createFileRoute } from '@tanstack/react-router'
import { FolderOpen, FileText, Image as ImageIcon, Video, MoreVertical } from 'lucide-react'
import styles from '@/assets/scss/routes/Files.module.scss'

export const Route = createFileRoute('/files')({
  component: Files,
})

function Files() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Files</h1>
          <p className={styles.subtitle}>Access and manage all project-related documents.</p>
        </div>
      </div>
      <div className={styles.grid}>
        <FileCard icon={<FolderOpen className="text-blue-400" />} name="Design Assets" size="1.2 GB" items="42 files" />
        <FileCard icon={<FileText className="text-emerald-400" />} name="Documentation" size="45 MB" items="12 files" />
        <FileCard icon={<ImageIcon className="text-purple-400" />} name="Screenshots" size="230 MB" items="85 files" />
        <FileCard icon={<Video className="text-rose-400" />} name="Presentations" size="3.4 GB" items="5 files" />
      </div>
    </div>
  )
}

function FileCard({ icon, name, size, items }: { icon: React.ReactNode, name: string, size: string, items: string }) {
  return (
    <div className={`${styles.card} group`}>
      <div className={styles.cardTop}>
        <div className={styles.iconBox}>
          {icon}
        </div>
        <button className={styles.moreButton}>
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <h3 className={styles.cardTitle}>{name}</h3>
      <div className={styles.cardInfo}>
        <span>{items}</span>
        <span>{size}</span>
      </div>
    </div>
  )
}
