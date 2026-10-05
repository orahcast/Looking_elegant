import { useState, useEffect } from 'react'
import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function RentModal({ item, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', eventDate: '', rentalDays: 1 })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Generate order number: LE-XXXX
      const orderNumber = `LE-${Math.floor(1000 + Math.random() * 9000)}`

      const rentalDays   = Math.max(1, parseInt(form.rentalDays) || 1)
      const pricePerDay  = Number(item.rental_price_per_day) || 0
      const totalPrice   = rentalDays * pricePerDay

      const { error: insertError } = await supabase.from('orders').insert({
        order_number:    orderNumber,
        customer_name:   form.name,
        customer_phone:  form.phone,
        customer_email:  form.email || null,
        order_type:      'Delivery',
        items: [
          {
            item_id:               item.id,
            name:                  item.name,
            category:              item.category,
            size:                  item.size,
            rental_price_per_day:  pricePerDay,
            rental_days:           rentalDays,
            total_price:           totalPrice,
          },
        ],
        total_amount:    totalPrice,
        deposit_amount:  Math.round(totalPrice * 0.3),
        order_status:    'pending',
        payment_status:  'Pending',
        start_date:      form.eventDate || null,
        created_at:      new Date().toISOString(),
      })

      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err) {
      console.error('Order submission error:', err)
      setError(err.message || 'Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,9,6,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInScale 0.3s ease' }}
      >
        {/* ── Success state ──────────────────────────────────────────── */}
        {submitted ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-sans text-[#1a1812] font-semibold text-base mb-1">
                Reservation Received!
              </h3>
              <p className="text-[#8a7e70] text-sm font-light leading-relaxed">
                Thank you, <strong>{form.name}</strong>. We've received your reservation for{' '}
                <strong>{item.name}</strong> and will contact you at{' '}
                <strong>{form.phone}</strong> shortly to confirm.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-[#1a1812] text-white text-xs tracking-widest uppercase font-medium py-3 px-8 hover:bg-[#c9a97a] hover:text-[#1a1812] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-sans text-[#1a1812] font-semibold text-base">
                  Rent this Item
                </h3>
                <p className="text-[#8a7e70] text-xs mt-0.5 font-light">
                  Fill in your details and we'll confirm availability.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#8a7e70] hover:text-[#1a1812] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Item preview */}
            <div className="flex items-center gap-4 px-6 py-4 bg-[#faf8f3] border-b border-gray-100">
              <img
                src={item.image_url || item.image || `https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&q=80`}
                alt={item.name}
                className="w-16 h-20 object-cover rounded-sm flex-shrink-0"
              />
              <div>
                <p className="font-sans text-[#1a1812] font-medium text-sm">{item.name}</p>
                <p className="text-[#c9a97a] text-xs mt-1">
                  {item.rental_price_per_day
                    ? `From RWF ${Number(item.rental_price_per_day).toLocaleString()}/Day`
                    : item.price}
                </p>
                {item.size && (
                  <span className="text-[#8a7e70] text-[0.6rem] uppercase mt-1 block tracking-widest">
                    Size {item.size}
                  </span>
                )}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-6 mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded px-3 py-2.5">
                <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs leading-snug">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="px-6 py-5 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jean-Pierre Uwimana"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] placeholder-gray-300 focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
                  Phone / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+250 7XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] placeholder-gray-300 focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
                  Email (optional)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] placeholder-gray-300 focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => set('eventDate', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
                    Rental Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.rentalDays}
                    onChange={(e) => set('rentalDays', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
                  />
                </div>
              </div>

              {/* Live price preview */}
              {item.rental_price_per_day && (
                <div className="flex items-center justify-between bg-[#faf8f3] border border-gray-100 rounded-sm px-4 py-3">
                  <span className="text-[#8a7e70] text-xs uppercase tracking-wide font-medium">Estimated Total</span>
                  <span className="text-[#1a1812] text-sm font-semibold">
                    RWF {(Math.max(1, parseInt(form.rentalDays) || 1) * Number(item.rental_price_per_day)).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 border border-gray-200 text-[#8a7e70] text-xs tracking-widest uppercase font-medium py-3 hover:border-[#c9a97a] hover:text-[#c9a97a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1a1812] text-white text-xs tracking-widest uppercase font-medium py-3 hover:bg-[#c9a97a] hover:text-[#1a1812] transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Confirm Reservation'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
