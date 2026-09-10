import { useState } from 'react'
import { X, Upload, ImagePlus, Loader2 } from 'lucide-react'

const CATEGORIES = ['Suit', 'Tuxedo', 'Shoes', 'Accessory']
const STATUSES = [
  { value: 'available',    label: '🟢  Available' },
  { value: 'rented',       label: '🔵  Rented' },
  { value: 'dry_cleaning', label: '🟡  At Dry Cleaning' },
]

const DEFAULT_FORM = {
  name: '',
  category: '',
  size: '',
  rental_price_per_day: '',
  status: 'available',
  condition_notes: '',
}

export default function AddItemModal({ onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handlePhotoChange = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handlePhotoChange(file)
  }

  const handleSave = (e) => {
    e.preventDefault()
    // Week 2: will submit to Supabase here
    setSaving(true)
    setTimeout(() => { setSaving(false); onClose() }, 1200)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-panel">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 sticky top-0 bg-[#111009] z-10">
          <div>
            <div className="gold-divider" />
            <h2 id="modal-title" className="font-editorial text-white text-lg font-light tracking-wide">
              Add New Rental Item
            </h2>
            <p className="text-white/30 text-[0.65rem] tracking-wide mt-0.5">
              Fill in the details below to list a new piece
            </p>
          </div>
          <button
            className="btn-icon text-white/40"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Photo upload */}
          <div>
            <label className="field-label">Photo</label>
            <div
              className={`upload-zone ${isDragging ? 'border-[#c9a97a]/60 bg-[#c9a97a]/8' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('photo-input').click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('photo-input').click()}
              aria-label="Upload photo"
            >
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files[0])}
              />
              {photoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-28 h-28 object-cover rounded-lg border border-[#c9a97a]/20"
                  />
                  <p className="text-[#c9a97a] text-[0.7rem]">Click to change photo</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#c9a97a]/8 border border-[#c9a97a]/15 flex items-center justify-center">
                    <ImagePlus size={20} className="text-[#c9a97a]/60" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[0.75rem] font-medium">
                      Drag & drop or <span className="text-[#c9a97a]">browse</span>
                    </p>
                    <p className="text-white/20 text-[0.65rem] mt-0.5">
                      JPG, PNG or WebP · Max 5 MB
                    </p>
                  </div>
                  <p className="text-white/15 text-[0.6rem] italic mt-1">
                    Will link to Supabase Storage in Week 2
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="item-name" className="field-label">Item Name *</label>
            <input
              id="item-name"
              type="text"
              className="field-input"
              placeholder="e.g. Midnight Navy 3-Piece Suit"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          {/* Category + Size row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="item-category" className="field-label">Category *</label>
              <select
                id="item-category"
                className="field-input"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                required
              >
                <option value="" disabled>Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="item-size" className="field-label">Size *</label>
              <input
                id="item-size"
                type="text"
                className="field-input font-mono"
                placeholder="e.g. 42R or 43"
                value={form.size}
                onChange={(e) => set('size', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Price + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="item-price" className="field-label">Price / Day (RWF) *</label>
              <input
                id="item-price"
                type="number"
                min="0"
                step="500"
                className="field-input font-mono"
                placeholder="15000"
                value={form.rental_price_per_day}
                onChange={(e) => set('rental_price_per_day', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="item-status" className="field-label">Status</label>
              <select
                id="item-status"
                className="field-input"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                {STATUSES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition notes */}
          <div>
            <label htmlFor="item-condition" className="field-label">Condition Notes</label>
            <textarea
              id="item-condition"
              rows={3}
              className="field-input resize-none"
              placeholder="e.g. Minor scuff on left lapel, otherwise excellent…"
              value={form.condition_notes}
              onChange={(e) => set('condition_notes', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-1 pb-safe">
            <button
              type="button"
              className="btn-ghost flex-1"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold flex-1 justify-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Add to Inventory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
