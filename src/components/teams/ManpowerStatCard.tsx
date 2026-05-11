import React from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from '@/assets/scss/routes/Teams.module.scss';

interface ManpowerStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: 'primary' | 'secondary' | 'error';
}

export const ManpowerStatCard: React.FC<ManpowerStatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  accentColor = 'primary'
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-secondary';
    if (trend === 'down') return 'text-error';
    return 'text-on-surface-variant';
  };

  const getIconColor = () => {
    if (accentColor === 'secondary') return 'text-secondary';
    if (accentColor === 'error') return 'text-error';
    return 'text-primary';
  };

  return (
    <div className={`${styles.glassCard} p-4 rounded-xl`}>
      <div className="flex justify-between items-start mb-2">
        <Icon className={`${getIconColor()} w-6 h-6`} />
        {change && (
          <span className={`${getTrendColor()} text-[12px] font-bold`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-mono mt-1 text-on-surface">{value}</h3>
    </div>
  );
};
