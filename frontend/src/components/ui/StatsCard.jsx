import { clsx } from 'clsx'

const iconColors = {
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend,
  trendLabel,
  className 
}) {
  return (
    <div className={clsx('stats-card', className)}>
      <div className={clsx('stats-icon', iconColors[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-morning-gray">{title}</p>
        <p className="text-2xl font-bold text-morning-darker mt-1">{value}</p>
        {trend !== undefined && (
          <p className={clsx(
            'text-xs mt-1',
            trend >= 0 ? 'text-accent-success' : 'text-accent-error'
          )}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
          </p>
        )}
      </div>
    </div>
  )
}
