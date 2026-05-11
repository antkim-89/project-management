import { createFileRoute } from '@tanstack/react-router'
import { Rocket, Zap, Shield, ChevronRight } from 'lucide-react'
import styles from '@/assets/scss/routes/Index.module.scss'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundDecoration}>
        <div className={styles.glowBlue} />
        <div className={styles.glowPurple} />
      </div>

      <div className={styles.heroContent}>
        <div className={styles.versionBadge}>
          <Zap className="w-4 h-4 fill-current" />
          <span>v1.0 is now live</span>
        </div>
        
        <h1 className={styles.heroTitle}>
          Manage Projects with <br />
          <span className={styles.gradientText}>
            Infinite Precision
          </span>
        </h1>
        
        <p className={styles.heroSubtitle}>
          The all-in-one workspace for your team. Built with the speed of Vite, 
          the power of TanStack, and the elegance of Tailwind CSS.
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton}>
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
          <button className={styles.secondaryButton}>
            Documentation
          </button>
        </div>

        <div className={styles.featureGrid}>
          <FeatureCard 
            icon={<Rocket className="w-6 h-6 text-blue-400" />}
            title="Blazing Fast"
            description="Built on Vite for near-instant HMR and production builds that fly."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-emerald-400" />}
            title="Type-Safe Routing"
            description="TanStack Router ensures your navigation is robust and developer-friendly."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-purple-400" />}
            title="Secure by Design"
            description="Best practices baked in for authentication and data management."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className={`${styles.featureCard} group`}>
      <div className={styles.featureIconBox}>
        {icon}
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </div>
  )
}
