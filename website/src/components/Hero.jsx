import { useEffect, useRef } from 'react'

export default function Hero() {
  const tagRef = useRef(null)
  const h1Ref = useRef(null)
  const pRef = useRef(null)
  const btnsRef = useRef(null)

  useEffect(() => {
    const els = [tagRef.current, h1Ref.current, pRef.current, btnsRef.current]
    els.forEach((el, i) => {
      if (!el) return
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 300 + i * 180)
    })
  }, [])

  const fadeStyle = {
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <img
        src="/images/hero.jpg"
        alt="Looking Elegant Atelier — Luxury Suit Rental"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0906]/90 via-[#0a0906]/65 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0906]/60 via-transparent to-[#0a0906]/20" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-3xl pt-28 pb-20">
        {/* Tag */}
        <div ref={tagRef} style={fadeStyle} className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-[#c9a97a]" />
          <span className="text-[#c9a97a] text-[0.6rem] tracking-widest3 uppercase font-sans font-medium">
            The Luxury Rental Atelier
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={h1Ref}
          style={fadeStyle}
          className="font-editorial text-white text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6"
        >
          Rent the Best,<br />
          Look Your Best.<br />
          <span className="italic font-light">Premium Suits &amp; Shoes</span>
          <br />for Your Big Day.
        </h1>

        {/* Subtext */}
        <p
          ref={pRef}
          style={fadeStyle}
          className="text-white/70 text-sm leading-relaxed max-w-md mb-10 font-sans font-light"
        >
          Experience perfect tailoring, raw silk finishes, and authentic calfskin
          leather without the boutique ownership tag. Hand-selected for grooms
          and esteemed gentlemen.
        </p>

        {/* CTA buttons */}
        <div ref={btnsRef} style={fadeStyle} className="flex flex-wrap gap-4 items-center">
          <button
            className="btn-primary"
            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse Collection
          </button>
          <button
            className="btn-ghost"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
            </svg>
            Book local styling appointment
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-px h-10 bg-white/50 animate-pulse" />
        <span className="text-white/50 text-[0.55rem] tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
