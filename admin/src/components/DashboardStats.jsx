import { Package, CheckCircle2, Clock, Shirt, TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardStats({ items = [] }) {
  const total = items.length
  const available = items.filter((i) => i.status === 'available').length
  const rented = items.filter((i) => i.status === 'rented').length
  const cleaning = items.filter((i) => i.status === 'dry_cleaning').length

  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0
  const rentedPct = total > 0 ? Math.round((rented / total) * 100) : 0
  const cleaningPct = total > 0 ? Math.round((cleaning / total) * 100) : 0

  const stats = [
    {
      id: 'total',
      label: 'Total Items',
      value: total,
      sub: `${items.length} listed pieces`,
      trend: 'up',
      icon: Package,
      iconColor: 'text-[#936a2e] dark:text-[#c9a97a]',
      iconBg: 'bg-[#b8935a]/12 dark:bg-[#c9a97a]/15',
      accentColor: 'text-[#936a2e] dark:text-[#c9a97a]',
      barColor: '#b8935a',
      pct: 100,
    },
    {
      id: 'available',
      label: 'Available',
      value: available,
      sub: `${availablePct}% of stock`,
      trend: 'up',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      barColor: '#10b981',
      pct: availablePct,
    },
    {
      id: 'rented',
      label: 'Currently Rented',
      value: rented,
      sub: `${rentedPct}% of stock`,
      trend: 'neutral',
      icon: Shirt,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
      accentColor: 'text-blue-600 dark:text-blue-400',
      barColor: '#3b82f6',
      pct: rentedPct,
    },
    {
      id: 'cleaning',
      label: 'At Dry Cleaning',
      value: cleaning,
      sub: `${cleaningPct}% of stock`,
      trend: 'down',
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/30',
      accentColor: 'text-amber-600 dark:text-amber-400',
      barColor: '#f59e0b',
      pct: cleaningPct,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map(({ id, label, value, sub, trend, icon: Icon, iconColor, iconBg, accentColor, barColor, pct }) => (
        <div key={id} className="stat-card p-4 sm:p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={17} className={iconColor} strokeWidth={2} />
            </div>
            {trend === 'up' && (
              <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-[0.68rem] font-bold">
                <TrendingUp size={12} />
              </div>
            )}
            {trend === 'down' && (
              <div className="flex items-center gap-0.5 text-rose-500 dark:text-rose-400 text-[0.68rem] font-bold">
                <TrendingDown size={12} />
              </div>
            )}
          </div>

          {/* Value */}
          <p className={`font-sans font-bold tracking-tight text-xl leading-none mb-1 ${accentColor}`}>
            {value}
          </p>

          {/* Label */}
          <p className="text-[var(--text-muted)] text-[0.72rem] font-bold uppercase tracking-wider leading-tight mb-1">
            {label}
          </p>

          {/* Sub */}
          <p className="text-[var(--text-subtle)] text-[0.68rem] font-medium">{sub}</p>

          {/* Bottom accent bar */}
          <div className="mt-3.5 h-1 rounded-full bg-[var(--bg-surface-subtle)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                background: barColor,
                width: `${pct}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
