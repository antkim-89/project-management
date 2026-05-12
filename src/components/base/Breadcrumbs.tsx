import React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'
import styles from '@/assets/scss/components/Breadcrumbs.module.scss'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.link}>
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <ChevronRight className={styles.separator} />
            {item.to ? (
              <Link to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
