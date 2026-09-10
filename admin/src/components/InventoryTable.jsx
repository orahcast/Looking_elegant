import { useState } from 'react'
import { Edit2, Trash2, MoreVertical, Filter, ArrowUpDown } from 'lucide-react'

// ── Static mock data (will be replaced with Supabase in Week 2) ─────────────
const MOCK_ITEMS = [
  {
    id: '1',
    name: 'Midnight Navy 3-Piece',
    category: 'Suit',
    size: '42R',
    rental_price_per_day: 15000,
    status: 'available',
    condition_notes: 'Excellent',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&q=70',
  },
  {
    id: '2',
    name: 'Ivory Peak Tuxedo',
    category: 'Tuxedo',
    size: '40R',
    rental_price_per_day: 22000,
    status: 'rented',
    condition_notes: 'Good',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5d8e?w=80&q=70',
  },
  {
    id: '3',
    name: 'Classic Oxford Brogues',
    category: 'Shoes',
    size: '43',
    rental_price_per_day: 7000,
    status: 'dry_cleaning',
    condition_notes: 'Minor scuff on left toe',
    image_url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=80&q=70',
  },
  {
    id: '4',
    name: 'Charcoal Slim Fit Suit',
    category: 'Suit',
    size: '38R',
    rental_price_per_day: 14000,
    status: 'available',
    condition_notes: 'Excellent',
    image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=80&q=70',
  },
  {
    id: '5',
    name: 'Gold Silk Pocket Square',
    category: 'Accessory',
    size: 'OS',
    rental_price_per_day: 2000,
    status: 'available',
    condition_notes: 'Brand new',
    image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&q=70',
  },
  {
    id: '6',
    name: 'Onyx Double-Breasted',
    category: 'Suit',
    size: '44R',
    rental_price_per_day: 18000,
    status: 'rented',
    condition_notes: 'Very good',
    image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=80&q=70',
  },
]

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    available:    { className: 'badge badge-available',  dot: '#4ade80', label: 'Available' },
    rented:       { className: 'badge badge-rented',     dot: '#60a5fa', label: 'Rented' },
    dry_cleaning: { className: 'badge badge-cleaning',   dot: '#facc15', label: 'Dry Cleaning' },
  }
  const cfg = map[status] || map.available
  return (
    <span className={cfg.className}>
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}

// ── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => `RWF ${n.toLocaleString()}`

// ── Component ────────────────────────────────────────────────────────────────
export default function InventoryTable({ onAddItem }) {
  const [filter, setFilter] = useState('all')
  const [items] = useState(MOCK_ITEMS)

  const filtered = filter === 'all'
    ? items
    : items.filter((i) => i.status === filter)

  return (
    <div className="glass-card overflow-hidden">
      {/* Table toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b border-white/5">
        <div>
          <h2 className="text-white font-medium text-sm tracking-wide">Rental Inventory</h2>
          <p className="text-white/30 text-[0.68rem] mt-0.5">{filtered.length} items shown</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 bg-white/3 rounded-lg p-1 border border-white/5">
            {[
              { key: 'all',          label: 'All' },
              { key: 'available',    label: 'Available' },
              { key: 'rented',       label: 'Rented' },
              { key: 'dry_cleaning', label: 'Cleaning' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 rounded-md text-[0.68rem] font-medium transition-all ${
                  filter === key
                    ? 'bg-[#c9a97a] text-[#0a0906]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button className="btn-ghost text-[0.7rem] gap-1.5 hidden sm:inline-flex">
            <Filter size={13} />
            Filter
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>
                <span className="flex items-center gap-1">
                  Category <ArrowUpDown size={10} className="opacity-40" />
                </span>
              </th>
              <th>Size</th>
              <th>Price / Day</th>
              <th>Status</th>
              <th>Condition</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                {/* Item with photo */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-white/85 font-medium text-[0.82rem]">{item.name}</span>
                  </div>
                </td>
                <td className="text-white/50">{item.category}</td>
                <td>
                  <span className="bg-white/5 border border-white/8 text-white/60 text-[0.68rem] px-2 py-0.5 rounded font-mono">
                    {item.size}
                  </span>
                </td>
                <td className="text-[#c9a97a] font-medium font-mono text-[0.8rem]">
                  {fmt(item.rental_price_per_day)}
                </td>
                <td><StatusBadge status={item.status} /></td>
                <td className="text-white/35 text-[0.75rem]">{item.condition_notes}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button className="btn-icon" aria-label={`Edit ${item.name}`} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-icon danger" aria-label={`Delete ${item.name}`} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-white/5">
        {filtered.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/85 font-medium text-sm truncate">{item.name}</p>
              <p className="text-white/35 text-[0.7rem]">
                {item.category} · {item.size}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <StatusBadge status={item.status} />
                <span className="text-[#c9a97a] text-[0.72rem] font-mono font-medium">
                  {fmt(item.rental_price_per_day)}
                </span>
              </div>
            </div>
            <button className="btn-icon flex-shrink-0" aria-label="More options">
              <MoreVertical size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-white/25 text-[0.65rem]">
          Showing {filtered.length} of {items.length} items
        </p>
        <p className="text-white/20 text-[0.62rem] italic">
          Live data — Week 2
        </p>
      </div>
    </div>
  )
}
