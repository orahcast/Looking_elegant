import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function RentModal({ item, onClose }) {
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
            src={item.image}
            alt={item.name}
            className="w-16 h-20 object-cover rounded-sm"
          />
          <div>
            <p className="font-sans text-[#1a1812] font-medium text-sm">{item.name}</p>
            <p className="text-[#c9a97a] text-xs mt-1">{item.price}</p>
            <span className="text-[#8a7e70] text-[0.55rem] tracking-widest uppercase mt-1 block">
              {item.badge}
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          className="px-6 py-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            alert(`Your reservation for "${item.name}" has been received! We'll contact you shortly.`)
            onClose()
          }}
        >
          <div>
            <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
              Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Jean-Pierre Uwimana"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] placeholder-gray-300 focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
            />
          </div>

          <div>
            <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
              Phone / WhatsApp
            </label>
            <input
              required
              type="tel"
              placeholder="+250 7XX XXX XXX"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] placeholder-gray-300 focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
            />
          </div>

          <div>
            <label className="block text-[#1a1812] text-xs font-medium mb-1.5 tracking-wide uppercase">
              Event Date
            </label>
            <input
              required
              type="date"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-[#1a1812] focus:outline-none focus:border-[#c9a97a] transition-colors rounded-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-[#8a7e70] text-xs tracking-widest uppercase font-medium py-3 hover:border-[#c9a97a] hover:text-[#c9a97a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#1a1812] text-white text-xs tracking-widest uppercase font-medium py-3 hover:bg-[#c9a97a] hover:text-[#1a1812] transition-colors"
            >
              Confirm Reservation
            </button>
          </div>
        </form>
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
