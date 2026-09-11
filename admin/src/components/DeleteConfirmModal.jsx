import { AlertTriangle, Trash2, X } from 'lucide-react'

export default function DeleteConfirmModal({ item, onClose, onConfirm }) {
  if (!item) return null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="modal-panel max-w-md p-6 bg-[var(--bg-surface)] border border-[var(--border-color)]">
        {/* Top icon + Close */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-500">
            <AlertTriangle size={22} strokeWidth={2} />
          </div>
          <button
            className="btn-icon -mr-2 -mt-2 text-[var(--text-subtle)] hover:text-[var(--text-main)]"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-6">
          <h2
            id="delete-dialog-title"
            className="text-[var(--text-main)] text-lg font-semibold tracking-tight"
          >
            Delete Rental Item?
          </h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-[var(--text-main)]">
              "{item.name}"
            </span>{' '}
            from your inventory? This item will be permanently deleted from the catalog.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-ghost flex-1 justify-center py-2.5"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            onClick={() => onConfirm(item.id)}
          >
            <Trash2 size={14} />
            Delete Item
          </button>
        </div>
      </div>
    </div>
  )
}
