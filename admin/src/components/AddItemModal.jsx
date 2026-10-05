import { useState, useEffect } from 'react'
import { X, ImagePlus, Loader2, Check, Upload, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['Suit', 'Tuxedo', 'Shoes', 'Accessory']
const STATUSES = [
  { value: 'available',    label: '🟢  Available' },
  { value: 'rented',       label: '🔵  Rented' },
  { value: 'dry_cleaning', label: '🟡  At Dry Cleaning' },
]

const FALLBACK_IMAGES = {
  Suit: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5d8e?w=400&q=80',
  Tuxedo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
  Shoes: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&q=80',
  Accessory: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
}

const DEFAULT_FORM = {
  name: '',
  category: 'Suit',
  size: '',
  rental_price_per_day: '',
  status: 'available',
  condition_notes: '',
  image_url: '',
}

export default function AddItemModal({ onClose, onSave, itemToEdit = null }) {
  const isEditing = Boolean(itemToEdit)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (itemToEdit) {
      setForm({
        name: itemToEdit.name || '',
        category: itemToEdit.category || 'Suit',
        size: itemToEdit.size || '',
        rental_price_per_day: itemToEdit.rental_price_per_day || '',
        status: itemToEdit.status || 'available',
        condition_notes: itemToEdit.condition_notes || '',
        image_url: itemToEdit.image_url || '',
      })
      if (itemToEdit.image_url) {
        setPhotoPreview(itemToEdit.image_url)
      }
    } else {
      setForm(DEFAULT_FORM)
      setPhotoPreview(null)
    }
  }, [itemToEdit])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // ── Upload photo to Supabase Storage ──────────────────────────────────────
  const uploadImageToStorage = async (file) => {
    setUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      setUploadProgress(80)

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename)

      setUploadProgress(100)
      return publicUrl
    } finally {
      setUploading(false)
    }
  }

  const handlePhotoChange = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.')
      return
    }

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPhotoPreview(e.target.result)
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    try {
      const publicUrl = await uploadImageToStorage(file)
      set('image_url', publicUrl)
      setPhotoPreview(publicUrl)
    } catch (err) {
      console.error('Image upload failed:', err)
      setUploadError(err.message || 'Upload failed. The image preview is shown but may not save correctly.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handlePhotoChange(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (uploading) return // wait for upload to finish
    setSaving(true)

    const finalData = {
      ...form,
      rental_price_per_day: Number(form.rental_price_per_day) || 0,
      image_url: form.image_url || FALLBACK_IMAGES[form.category] || FALLBACK_IMAGES.Suit,
    }

    if (isEditing) {
      finalData.id = itemToEdit.id
    }

    await onSave(finalData)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-panel">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-surface)] z-10">
          <div>
            <div className="gold-divider" />
            <h2 id="modal-title" className="font-editorial text-[var(--text-main)] text-xl font-medium tracking-wide">
              {isEditing ? 'Edit Rental Item' : 'Add New Rental Item'}
            </h2>
            <p className="text-[var(--text-muted)] text-[0.72rem] tracking-wide mt-0.5">
              {isEditing ? 'Update the details for this rental piece' : 'Fill in the details below to list a new piece'}
            </p>
          </div>
          <button
            className="btn-icon text-[var(--text-muted)] hover:text-[var(--text-main)]"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 bg-[var(--bg-surface)]">
          {/* Photo upload */}
          <div>
            <label className="field-label">Photo</label>
            <div
              className={`upload-zone ${isDragging ? 'border-[var(--gold-primary)] bg-[var(--gold-badge-bg)]' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && document.getElementById('photo-input').click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && !uploading && document.getElementById('photo-input').click()}
              aria-label="Upload photo"
              style={{ cursor: uploading ? 'wait' : 'pointer' }}
            >
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files[0])}
                disabled={uploading}
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={28} className="animate-spin text-[var(--gold-text)]" />
                  <p className="text-[var(--text-main)] text-[0.82rem] font-medium">Uploading to cloud…</p>
                  <div className="w-32 h-1.5 bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--gold-primary)] rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[var(--text-muted)] text-[0.68rem]">{uploadProgress}%</p>
                </div>
              ) : photoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-[var(--border-color)] shadow-sm"
                  />
                  <p className="text-[var(--gold-text)] text-[0.72rem] font-semibold">Click to change photo</p>
                  {form.image_url && form.image_url.startsWith('https://') && (
                    <p className="text-emerald-600 dark:text-emerald-400 text-[0.65rem] flex items-center gap-1">
                      <Check size={10} /> Saved to cloud storage
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--gold-badge-bg)] border border-[var(--gold-badge-border)] flex items-center justify-center">
                    <ImagePlus size={20} className="text-[var(--gold-text)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-main)] text-[0.82rem] font-medium">
                      Drag & drop or <span className="text-[var(--gold-text)] font-bold underline">browse</span>
                    </p>
                    <p className="text-[var(--text-muted)] text-[0.7rem] mt-0.5">
                      JPG, PNG or WebP · Max 5 MB · Saved to Supabase Storage
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="flex items-start gap-2 mt-2 text-red-600 dark:text-red-400">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                <p className="text-[0.72rem]">{uploadError}</p>
              </div>
            )}
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
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
          <div className="flex items-center gap-2.5 pt-2 pb-safe border-t border-[var(--border-color)]">
            <button
              type="button"
              className="btn-ghost flex-1 justify-center"
              onClick={onClose}
              disabled={saving || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold flex-1 justify-center"
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading…
                </>
              ) : isEditing ? (
                <>
                  <Check size={15} />
                  Save Changes
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
