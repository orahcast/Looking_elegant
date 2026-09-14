import { Package, CheckCircle2, Clock, Shirt, ChevronRight } from 'lucide-react'

export default function DashboardStats({ items = [] }) {
  const total = items.length
  const available = items.filter((i) => i.status === 'available').length
  const rented = items.filter((i) => i.status === 'rented').length
  const cleaning = items.filter((i) => i.status === 'dry_cleaning').length

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
  )
}
