import { useState, useEffect, useRef, useMemo } from 'react'
import { useInventory } from '../hooks/useInventory'

// ── Category → badge label map ───────────────────────────────────────────────
const BADGE_MAP = {
  Suit:          "Men's Tailored Fit",
  'Men Suit':    "Men's Tailored Fit",
  'Women Suit':  "Women's Couture Fit",
  'Women Suits': "Women's Couture Fit",
  Tuxedo:        'Black Tie Fit',
  Blazer:        'Bespoke Cut',
  Shoes:         'Hand-Polished',
  Shoe:          'Hand-Polished',
  Accessory:     'Atelier Acc.',
}

// ── Category definitions ────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all', label: 'All Pieces' },
  { key: 'men_suit', label: "Men's Suits" },
  { key: 'women_suit', label: "Women's Suits" },
  { key: 'tuxedo', label: 'Tuxedos' },
  { key: 'blazer', label: 'Blazers' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'accessory', label: 'Accessories' },
]

// ── Skeleton card for loading state ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="product-card animate-pulse rounded-sm">
      <div className="card-image-wrap bg-[#e8e4dc]" />
      <div className="p-3.5 sm:p-4 space-y-2">
        <div className="h-3 bg-[#e8e4dc] rounded w-3/4" />
        <div className="h-2.5 bg-[#e8e4dc] rounded w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-2 bg-[#e8e4dc] rounded w-1/3" />
          <div className="h-6 bg-[#e8e4dc] rounded w-12" />
        </div>
      </div>
    </div>
  )
}

const INITIAL_PAGE_SIZE = 8
const LOAD_MORE_STEP = 8

export default function Collection({ onRent }) {
  const { items, loading, error } = useInventory()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE)
  const cardRefs = useRef([])

  // Calculate available counts per category
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

  // Filter items according to active category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items
    return items.filter((item) => {
      const cat = (item.category || '').toLowerCase()
      if (selectedCategory === 'women_suit') return cat.includes('women')
      if (selectedCategory === 'men_suit' || selectedCategory === 'suit') {
        return cat.includes('suit') && !cat.includes('women') && !cat.includes('tux')
      }
      if (selectedCategory === 'tuxedo') return cat.includes('tux')
      if (selectedCategory === 'blazer') return cat.includes('blaz')
      if (selectedCategory === 'shoes') return cat.includes('shoe')
      if (selectedCategory === 'accessory') return cat.includes('access')
      return cat === selectedCategory
    })
  }, [items, selectedCategory])

  // Reset pagination on category change
  const handleCategorySelect = (key) => {
    setSelectedCategory(key)
    setVisibleCount(INITIAL_PAGE_SIZE)
  }

  // Displayed slice
  const displayedItems = filteredItems.slice(0, visibleCount)
  const hasMore = visibleCount < filteredItems.length
  const remainingCount = filteredItems.length - visibleCount

  // Intersection observer for fade-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [displayedItems])

  const formatPrice = (pricePerDay) =>
    pricePerDay ? `RWF ${Number(pricePerDay).toLocaleString()}/day` : 'Inquire for rental'

  return (
    <section id="collection" className="bg-[#faf8f3] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#c9a97a]" />
              <span className="text-[#c9a97a] text-[0.6rem] tracking-widest uppercase font-sans font-medium">
                Atelier Wardrobe
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1812]">
              The Signature Curation
            </h2>
          </div>
          <p className="text-[#5a5448] text-xs sm:text-sm leading-relaxed max-w-sm mt-4 md:mt-0 font-light">
            Each piece is meticulously steamed, tailor-fitted to your measurements,
            and paired with hand-finished accessories for your finest occasions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.key] || 0
            const active = selectedCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => handleCategorySelect(cat.key)}
                className={`whitespace-nowrap px-4 py-2 text-xs tracking-wider uppercase transition-all duration-200 rounded-sm flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#1a1812] text-white shadow-sm font-medium'
                    : 'bg-white/80 border border-gray-200/80 text-[#8a7e70] hover:text-[#1a1812] hover:border-[#c9a97a]'
                }`}
              >
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[0.6rem] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-[#c9a97a] text-[#1a1812] font-semibold' : 'bg-gray-100 text-[#8a7e70]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-16 bg-white border border-red-100 rounded-sm p-6 max-w-md mx-auto">
            <p className="text-red-700 text-sm mb-3">
              Unable to load collection from atelier inventory.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline-gold text-xs"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Product grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : displayedItems.length === 0 && !error
            ? (
              <div className="col-span-full text-center py-20 bg-white/60 border border-dashed border-[#e2d9cd] rounded-sm p-8">
                <p className="font-editorial text-2xl text-[#1a1812] font-light mb-1">
                  No Pieces Found in this Category
                </p>
                <p className="text-[#8a7e70] text-xs font-light max-w-xs mx-auto mb-5">
                  We frequently rotate our garments. Try exploring another category or contact our stylist directly.
                </p>
                <button
                  onClick={() => handleCategorySelect('all')}
                  className="btn-outline-gold text-xs px-6 py-2"
                >
                  View All Pieces
                </button>
              </div>
            )
            : displayedItems.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="product-card fade-up rounded-sm border border-gray-100/80 bg-white"
                style={{ transitionDelay: `${(i % 4) * 60}ms` }}
              >
                {/* Image & badge */}
                <div className="card-image-wrap">
                  <img
                    src={item.image_url || `https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80`}
                    alt={item.name}
                    loading="lazy"
                  />
                  {item.size && (
                    <div className="absolute top-2 left-2 bg-[#0a0906]/80 backdrop-blur-sm text-white text-[0.55rem] sm:text-[0.6rem] tracking-widest uppercase font-medium px-2 py-0.5 rounded-sm">
                      Size {item.size}
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-sans text-[#1a1812] text-xs sm:text-sm font-medium leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[#c9a97a] text-[0.7rem] sm:text-xs font-medium mt-1">
                      {formatPrice(item.rental_price_per_day)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                    <span className="text-[#8a7e70] text-[0.55rem] tracking-wider uppercase font-medium truncate max-w-[85px] sm:max-w-none">
                      {BADGE_MAP[item.category] || ((item.category || '').toLowerCase().includes('women') ? "Women's Couture Fit" : (item.category || '').toLowerCase().includes('suit') ? "Men's Tailored Fit" : item.category) || 'Atelier'}
                    </span>
                    <button
                      className="btn-rent text-[0.55rem] sm:text-[0.62rem] px-2.5 sm:px-3 py-1 sm:py-1.5"
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

        {/* ── Scalable Pagination / Load More Section ──────────────────── */}
        {!loading && filteredItems.length > INITIAL_PAGE_SIZE && (
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center text-center">
            {/* Counter */}
            <p className="text-[#8a7e70] text-xs font-light tracking-wide mb-2">
              Displaying <strong className="text-[#1a1812] font-semibold">{displayedItems.length}</strong> of{' '}
              <strong className="text-[#1a1812] font-semibold">{filteredItems.length}</strong> garments
            </p>

            {/* Luxury visual progress bar */}
            <div className="w-48 sm:w-64 h-1 bg-[#e8e4dc] overflow-hidden rounded-full mb-6">
              <div
                className="h-full bg-[#c9a97a] transition-all duration-500 ease-out"
                style={{ width: `${(displayedItems.length / filteredItems.length) * 100}%` }}
              />
            </div>

            {hasMore ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                  className="btn-primary text-xs px-8 py-3 tracking-widest"
                >
                  Discover More Pieces (+{Math.min(LOAD_MORE_STEP, remainingCount)})
                </button>
                <button
                  onClick={() => setVisibleCount(filteredItems.length)}
                  className="btn-outline-gold text-xs px-6 py-3 tracking-widest"
                >
                  View All ({filteredItems.length})
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-gray-200/80 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a97a]" />
                <span className="text-[#8a7e70] text-xs font-light">
                  All {filteredItems.length} garments in this curation are displayed.
                </span>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
