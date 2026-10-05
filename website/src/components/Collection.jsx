import { useEffect, useRef } from 'react'
import { useInventory } from '../hooks/useInventory'

// ── Category → badge label map ───────────────────────────────────────────────
const BADGE_MAP = {
  Suit:      'TAILORED FIT INCLUDED',
  Tuxedo:    'TAILORED FIT INCLUDED',
  Shoes:     'HAND-POLISHED',
  Accessory: 'PREMIUM ACCESSORY',
}

// ── Skeleton card for loading state ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="product-card animate-pulse">
      <div className="overflow-hidden bg-[#e8e4dc] aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[#e8e4dc] rounded w-3/4" />
        <div className="h-2.5 bg-[#e8e4dc] rounded w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-2 bg-[#e8e4dc] rounded w-1/3" />
          <div className="h-7 bg-[#e8e4dc] rounded w-14" />
        </div>
      </div>
    </div>
  )
}

export default function Collection({ onRent }) {
  const { items, loading, error } = useInventory()
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  // Intersection observer for fade-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.12 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items]) // re-observe when items change

  const formatPrice = (pricePerDay) =>
    `From RWF ${Number(pricePerDay).toLocaleString()}/Day`

  return (
    <section id="collection" className="bg-[#faf8f3] py-20 lg:py-28" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#c9a97a]" />
              <span className="text-[#c9a97a] text-[0.6rem] tracking-widest3 uppercase font-sans font-medium">
                Curated Garments
              </span>
            </div>
            <h2 className="font-editorial text-4xl lg:text-5xl font-light text-[#1a1812]">
              The Signature Curation
            </h2>
          </div>
          <p className="text-[#5a5448] text-sm leading-relaxed max-w-xs mt-6 md:mt-0 font-light">
            Every suit undergoes structural steaming and master tailoring,
            paired with hand-polished leather oxfords and suites.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-[#8a7e70] text-sm">
              Unable to load collection. Please refresh the page.
            </p>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : items.length === 0 && !error
            ? (
              <div className="col-span-3 text-center py-16">
                <p className="text-[#8a7e70] text-sm">
                  No pieces currently available — check back soon.
                </p>
              </div>
            )
            : items.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="product-card fade-up"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.image_url || `https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80`}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-sans text-[#1a1812] text-sm font-medium mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[#8a7e70] text-xs font-light mb-3">
                    {formatPrice(item.rental_price_per_day)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a7e70] text-[0.55rem] tracking-widest uppercase font-medium">
                      {BADGE_MAP[item.category] || item.category}
                    </span>
                    <button
                      className="btn-rent"
                      onClick={() => onRent(item)}
                      id={`rent-btn-${item.id}`}
                    >
                      Rent
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}
