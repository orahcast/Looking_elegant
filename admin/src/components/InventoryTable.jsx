import { useState, useMemo } from 'react'
import { Edit2, Trash2, PackageOpen, Plus } from 'lucide-react'

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    available:    { className: 'badge badge-available',  dot: '#059669', label: 'Available' },
    rented:       { className: 'badge badge-rented',     dot: '#2563eb', label: 'Rented' },
    dry_cleaning: { className: 'badge badge-cleaning',   dot: '#d97706', label: 'Dry Cleaning' },
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

// ── Category badge helper ───────────────────────────────────────────────────
function CategoryBadge({ category }) {
  const cat = (category || '').toLowerCase()
  if (cat.includes('women')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#fdf2f4] text-[#a21caf] dark:bg-[#341228] dark:text-[#f472b6] border border-[#fbcfe8] dark:border-[#701a45]">
        👗 Women's Suit
      </span>
    )
  }
  if (cat.includes('suit') && !cat.includes('tux')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#eff6ff] text-[#1d4ed8] dark:bg-[#111e38] dark:text-[#93c5fd] border border-[#bfdbfe] dark:border-[#1e3a8a]">
        👔 Men's Suit
      </span>
    )
  }
  if (cat.includes('tux')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#fbf5e6] text-[#b45309] dark:bg-[#2e210a] dark:text-[#fcd34d] border border-[#fde68a] dark:border-[#78350f]">
        ✨ Tuxedo
      </span>
    )
  }
  if (cat.includes('blaz')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#ecfdf5] text-[#047857] dark:bg-[#062c1d] dark:text-[#6ee7b7] border border-[#a7f3d0] dark:border-[#065f46]">
        🧥 Blazer
      </span>
    )
  }
  if (cat.includes('shoe')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#faf5ff] text-[#6d28d9] dark:bg-[#23123d] dark:text-[#c4b5fd] border border-[#ddd6fe] dark:border-[#4c1d95]">
        👞 Shoes
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]">
      💎 {category || 'Accessory'}
    </span>
  )
}

// ── Inline status selector ───────────────────────────────────────────────────
function StatusSelect({ status, onStatusChange }) {
  return (
    <select
      value={status}
      onChange={e => onStatusChange(e.target.value)}
      className="text-[0.7rem] font-semibold rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] text-[var(--text-main)] px-2 py-1 focus:outline-none focus:border-[var(--gold-primary)] cursor-pointer transition-colors hover:border-[var(--gold-primary)]/60"
      title="Change item status"
    >
      <option value="available">🟢 Available</option>
      <option value="rented">🔵 Rented</option>
      <option value="dry_cleaning">🟡 Dry Cleaning</option>
    </select>
  )
}

// ── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => `RWF ${Number(n || 0).toLocaleString()}`

const CATEGORY_TABS = [
  { key: 'all',         label: 'All Items' },
  { key: 'men_suit',    label: "Men's Suits" },
  { key: 'women_suit',  label: "Women's Suits" },
  { key: 'tuxedo',      label: 'Tuxedos' },
  { key: 'blazer',      label: 'Blazers' },
  { key: 'shoes',       label: 'Shoes' },
  { key: 'accessory',   label: 'Accessories' },
]

// ── Component ────────────────────────────────────────────────────────────────
export default function InventoryTable({
  items = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onStatusChange,
  searchQuery = '',
}) {
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Calculate live counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: items.length }
    items.forEach((item) => {
      const cat = (item.category || '').toLowerCase()
      if (cat.includes('women')) counts.women_suit = (counts.women_suit || 0) + 1
      else if (cat.includes('suit') && !cat.includes('tux')) counts.men_suit = (counts.men_suit || 0) + 1
      else if (cat.includes('tux')) counts.tuxedo = (counts.tuxedo || 0) + 1
      else if (cat.includes('blaz')) counts.blazer = (counts.blazer || 0) + 1
      else if (cat.includes('shoe')) counts.shoes = (counts.shoes || 0) + 1
      else if (cat.includes('access')) counts.accessory = (counts.accessory || 0) + 1
      else counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [items])

  // Filter by status tab, category tab & search query
  const filtered = items.filter((i) => {
    const matchesStatus = filter === 'all' || i.status === filter

    const cat = (i.category || '').toLowerCase()
    let matchesCategory = true
    if (categoryFilter === 'women_suit') {
      matchesCategory = cat.includes('women')
    } else if (categoryFilter === 'men_suit') {
      matchesCategory = cat.includes('suit') && !cat.includes('women') && !cat.includes('tux')
    } else if (categoryFilter === 'tuxedo') {
      matchesCategory = cat.includes('tux')
    } else if (categoryFilter === 'blazer') {
      matchesCategory = cat.includes('blaz')
    } else if (categoryFilter === 'shoes') {
      matchesCategory = cat.includes('shoe')
    } else if (categoryFilter === 'accessory') {
      matchesCategory = cat.includes('access')
    }

    const query = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !query ||
      (i.name || '').toLowerCase().includes(query) ||
      cat.includes(query) ||
      (i.size || '').toLowerCase().includes(query)

    return matchesStatus && matchesCategory && matchesQuery
  })

  return (
    <div className="glass-card overflow-hidden">
      {/* Table toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-[var(--text-main)] font-semibold text-sm tracking-wide">Rental Inventory</h2>
          <p className="text-[var(--text-muted)] text-[0.72rem] mt-0.5">
            {filtered.length} of {items.length} items shown
            {searchQuery && ` · Matching "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter pills */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface-subtle)] rounded-lg p-1 border border-[var(--border-color)]">
            {[
              { key: 'all',          label: 'All' },
              { key: 'available',    label: 'Available' },
              { key: 'rented',       label: 'Rented' },
              { key: 'dry_cleaning', label: 'Cleaning' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-md text-[0.72rem] font-semibold transition-all ${
                  filter === key
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm border border-[var(--border-color)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onAddItem}
            className="btn-gold text-[0.72rem] gap-1.5 hidden sm:inline-flex py-1.5 px-3"
          >
            <Plus size={13} />
            Add Item
          </button>
        </div>
      </div>

      {/* Category filter tabs bar */}
      <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
        <span className="text-[0.68rem] uppercase font-bold tracking-wider text-[var(--text-muted)] mr-1 flex-shrink-0">
          Category:
        </span>
        {CATEGORY_TABS.map(({ key, label }) => {
          const count = categoryCounts[key] || 0
          const active = categoryFilter === key
          return (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-2.5 py-1 rounded-md text-[0.72rem] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                active
                  ? 'bg-[var(--gold-primary)] text-[#0a0906] font-bold shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`text-[0.62rem] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-[#0a0906]/20 text-[#0a0906]' : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-subtle)] flex items-center justify-center text-[var(--text-subtle)] mb-3">
            <PackageOpen size={24} />
          </div>
          <p className="text-[var(--text-main)] font-semibold text-sm">No items found</p>
          <p className="text-[var(--text-muted)] text-xs mt-1 max-w-sm">
            {searchQuery
              ? `No inventory items match "${searchQuery}". Try a different keyword.`
              : 'No items currently match this status filter.'}
          </p>
          {searchQuery && (
            <button
              onClick={onAddItem}
              className="btn-ghost text-xs mt-4"
            >
              Add New Item Instead
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
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
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span className="text-[var(--text-main)] font-semibold text-[0.84rem]">{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <CategoryBadge category={item.category} />
                    </td>
                    <td>
                      <span className="bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] text-[0.7rem] px-2 py-0.5 rounded font-mono font-semibold">
                        {item.size}
                      </span>
                    </td>
                    <td className="text-[var(--gold-text)] font-bold font-mono text-[0.82rem]">
                      {fmt(item.rental_price_per_day)}
                    </td>
                    <td>
                      {onStatusChange ? (
                        <StatusSelect
                          status={item.status}
                          onStatusChange={(newStatus) => onStatusChange(item.id, newStatus)}
                        />
                      ) : (
                        <StatusBadge status={item.status} />
                      )}
                    </td>
                    <td className="text-[var(--text-muted)] text-[0.78rem] truncate max-w-[160px]">
                      {item.condition_notes || '—'}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          className="btn-icon"
                          onClick={() => onEditItem(item)}
                          aria-label={`Edit ${item.name}`}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => onDeleteItem(item)}
                          aria-label={`Delete ${item.name}`}
                          title="Delete"
                        >
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
          <div className="sm:hidden divide-y divide-[var(--border-color)]">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text-main)] font-semibold text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CategoryBadge category={item.category} />
                    <span className="text-[var(--text-muted)] text-[0.7rem] font-mono">· {item.size}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {onStatusChange ? (
                      <StatusSelect
                        status={item.status}
                        onStatusChange={(newStatus) => onStatusChange(item.id, newStatus)}
                      />
                    ) : (
                      <StatusBadge status={item.status} />
                    )}
                    <span className="text-[var(--gold-text)] text-[0.75rem] font-mono font-bold">
                      {fmt(item.rental_price_per_day)}
                    </span>
                  </div>
                </div>
                {/* Mobile action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="btn-icon"
                    onClick={() => onEditItem(item)}
                    aria-label={`Edit ${item.name}`}
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => onDeleteItem(item)}
                    aria-label={`Delete ${item.name}`}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface-subtle)]/50">
        <p className="text-[var(--text-muted)] text-[0.7rem] font-medium">
          Showing {filtered.length} of {items.length} items
        </p>
        <p className="text-[var(--text-subtle)] text-[0.68rem] italic">
          Looking Elegant Atelier Inventory
        </p>
      </div>
    </div>
  )
}
