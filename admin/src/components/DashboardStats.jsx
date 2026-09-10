import { Package, CheckCircle2, Clock, Shirt, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  {
    id: 'total',
    label: 'Total Items',
    value: '24',
    sub: '+3 this month',
    trend: 'up',
    icon: Package,
    iconColor: 'text-[#c9a97a]',
    iconBg: 'bg-[#c9a97a]/10',
    accentColor: '#c9a97a',
  },
  {
    id: 'available',
    label: 'Available',
    value: '14',
    sub: '58% of stock',
    trend: 'up',
    icon: CheckCircle2,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
    accentColor: '#4ade80',
  },
  {
    id: 'rented',
    label: 'Currently Rented',
    value: '7',
    sub: '29% of stock',
    trend: 'neutral',
    icon: Shirt,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    accentColor: '#60a5fa',
  },
  {
    id: 'cleaning',
    label: 'At Dry Cleaning',
    value: '3',
    sub: '13% of stock',
    trend: 'down',
    icon: Clock,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
    accentColor: '#facc15',
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map(({ id, label, value, sub, trend, icon: Icon, iconColor, iconBg, accentColor }) => (
        <div key={id} className="stat-card p-4 sm:p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={17} className={iconColor} strokeWidth={1.8} />
            </div>
            {trend === 'up' && (
              <div className="flex items-center gap-0.5 text-green-400 text-[0.62rem] font-semibold">
                <TrendingUp size={11} />
              </div>
            )}
            {trend === 'down' && (
              <div className="flex items-center gap-0.5 text-red-400 text-[0.62rem] font-semibold">
                <TrendingDown size={11} />
              </div>
            )}
          </div>

          {/* Value */}
          <p
            className="font-editorial text-3xl sm:text-4xl font-light leading-none mb-1"
            style={{ color: accentColor }}
          >
            {value}
          </p>

          {/* Label */}
          <p className="text-white/50 text-[0.7rem] font-medium uppercase tracking-wider leading-tight mb-0.5">
            {label}
          </p>

          {/* Sub */}
          <p className="text-white/25 text-[0.62rem]">{sub}</p>

          {/* Bottom accent bar */}
          <div className="mt-3 h-0.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: accentColor,
                width: id === 'total' ? '100%' : id === 'available' ? '58%' : id === 'rented' ? '29%' : '13%',
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
