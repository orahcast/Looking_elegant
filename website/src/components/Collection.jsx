import { useEffect, useRef } from 'react'

const products = [
  {
    id: 1,
    name: 'Charcoal Grey 3-Piece Suit',
    price: 'From RWF 25,000/Day',
    image: '/images/suit_charcoal.jpg',
    badge: 'TAILORED FIT INCLUDED',
  },
  {
    id: 2,
    name: 'Brown Leather Brogues',
    price: 'From RWF 15,000/Day',
    image: '/images/shoes_brogues.jpg',
    badge: 'HAND-POLISHED',
  },
  {
    id: 3,
    name: 'Midnight Navy Slim-Fit',
    price: 'From RWF 25,000/Day',
    image: '/images/suit_navy.jpg',
    badge: 'TAILORED FIT INCLUDED',
  },
  {
    id: 4,
    name: 'Patent Leather Derbies',
    price: 'From RWF 18,000/Day',
    image: '/images/shoes_patent.jpg',
    badge: 'HAND-POLISHED',
  },
  {
    id: 5,
    name: 'Classic Black Tuxedo',
    price: 'From RWF 30,000/Day',
    image: '/images/suit_tuxedo.jpg',
    badge: 'TAILORED FIT INCLUDED',
  },
  {
    id: 6,
    name: 'Tan Suede Loafers',
    price: 'From RWF 15,000/Day',
    image: '/images/shoes_loafers.jpg',
    badge: 'HAND-POLISHED',
  },
]

export default function Collection({ onRent }) {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="collection" className="bg-[#faf8f3] py-20 lg:py-28">
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="product-card fade-up"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-sans text-[#1a1812] text-sm font-medium mb-1">
                  {product.name}
                </h3>
                <p className="text-[#8a7e70] text-xs font-light mb-3">
                  {product.price}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#8a7e70] text-[0.55rem] tracking-widest uppercase font-medium">
                    {product.badge}
                  </span>
                  <button
                    className="btn-rent"
                    onClick={() => onRent(product)}
                    id={`rent-btn-${product.id}`}
                  >
                    Rent
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
