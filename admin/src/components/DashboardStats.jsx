import { Package, CheckCircle2, Clock, Shirt, ChevronRight, TrendingUp } from 'lucide-react'

const fmtRWF = (n) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n) || 0) + ' RWF'

export default function DashboardStats({ items = [], orders = [] }) {
  const total     = items.length
  const available = items.filter((i) => i.status === 'available').length
  const rented    = items.filter((i) => i.status === 'rented').length
  const cleaning  = items.filter((i) => i.status === 'dry_cleaning').length

  // Revenue = sum of confirmed / delivered / completed orders (exclude cancelled + pending)
  const confirmedRevenue = orders
    .filter(o => ['confirmed', 'delivered', 'completed'].includes(o.order_status))
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)

  const stats = [
    {
      id: 'total',
      label: 'Total Pieces',
      value: total,
      icon: Package,
      iconColor: 'text-[#936a2e] dark:text-[#c9a97a]',
      badgeColor: 'text-[var(--gold-text)]',
    },
    {
      id: 'available',
      label: 'Available',
      value: available,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badgeColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'rented',
      label: 'Currently Out',
      value: rented,
      icon: Shirt,
      iconColor: 'text-blue-600 dark:text-blue-400',
      badgeColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'cleaning',
      label: 'At Cleaning',
      value: cleaning,
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400',
      badgeColor: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Revenue Banner */}
      <div className="rounded-2xl p-3.5 sm:p-4 border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[0.7rem] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
              Confirmed Revenue
            </p>
            <p className="text-[0.65rem] text-emerald-600/70 dark:text-emerald-500/70">
              Confirmed, delivered &amp; completed orders
            </p>
          </div>
        </div>
        <span className="text-lg sm:text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
          {fmtRWF(confirmedRevenue)}
        </span>
      </div>

      {/* Inventory stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {stats.map(({ id, label, value, icon: Icon, iconColor, badgeColor }) => (
          <div
            key={id}
            className="rounded-2xl p-3 sm:p-3.5 border border-gray-200/90 dark:border-[var(--border-color)] bg-white dark:bg-[#161410] flex flex-col justify-between h-[72px] sm:h-auto shadow-sm hover:shadow transition-all"
          >
            <div className="flex items-center justify-between w-full">
              <Icon size={18} className={iconColor} strokeWidth={2} />
              <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
            </div>
            <div className="flex items-center justify-between w-full mt-1">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">{label}</span>
              <span className={`text-xs font-bold font-mono ${badgeColor}`}>{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
