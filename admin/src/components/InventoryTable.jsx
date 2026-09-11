import { useState } from 'react'
import { Edit2, Trash2, Filter, ArrowUpDown, PackageOpen, Plus } from 'lucide-react'

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

// ── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => `RWF ${Number(n || 0).toLocaleString()}`

// ── Component ────────────────────────────────────────────────────────────────
export default function InventoryTable({
  items = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  searchQuery = '',
}) {
  const [filter, setFilter] = useState('all')

  // Filter by status tab & search query
  const filtered = items.filter((i) => {
    const matchesStatus = filter === 'all' || i.status === filter
    const query = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !query ||
      i.name.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query) ||
      i.size.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
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
                    <td className="text-[var(--text-muted)]">{item.category}</td>
                    <td>
                      <span className="bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] text-[0.7rem] px-2 py-0.5 rounded font-mono font-semibold">
                        {item.size}
                      </span>
                    </td>
                    <td className="text-[var(--gold-text)] font-bold font-mono text-[0.82rem]">
                      {fmt(item.rental_price_per_day)}
                    </td>
                    <td><StatusBadge status={item.status} /></td>
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
                  <p className="text-[var(--text-muted)] text-[0.72rem]">
                    {item.category} · {item.size}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={item.status} />
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
