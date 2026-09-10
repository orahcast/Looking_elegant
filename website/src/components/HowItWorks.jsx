import { useEffect, useRef } from 'react'

const steps = [
  {
    number: '01',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a97a" strokeWidth="1.4">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
        <path d="M16 3v4M8 3v4M2 11h20"/>
      </svg>
    ),
    title: 'Select Your Look',
    description:
      'Explore our meticulously curated digital wardrobe of Italian-woven suits and handcrafted leather footwear.',
  },
  {
    number: '02',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a97a" strokeWidth="1.4">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: 'Book Online',
    description:
      'Reserve your items for your wedding or big ceremony day. Easily schedule a complimentary fitting session.',
  },
  {
    number: '03',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a97a" strokeWidth="1.4">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'Pick Up & Perfect',
    description:
      'Drop by our physical atelier for custom length adjustments, collect your pristine set, and wear with absolute confidence.',
  },
]

export default function HowItWorks() {
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="bg-[#f0ece3] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#c9a97a]" />
            <span className="text-[#c9a97a] text-[0.6rem] tracking-widest3 uppercase font-sans font-medium">
              The Ceremony Process
            </span>
            <div className="w-6 h-px bg-[#c9a97a]" />
          </div>
          <h2 className="font-editorial text-4xl lg:text-5xl font-light text-[#1a1812]">
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => (cardRefs.current[i] = el)}
              className="process-card fade-up"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Top row: icon + number */}
              <div className="flex items-start justify-between mb-6">
                <div className="p-2 border border-[#c9a97a]/30 rounded-sm">
                  {step.icon}
                </div>
                <span className="font-editorial text-4xl text-[#c9a97a]/30 font-light leading-none">
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-sans text-[#1a1812] text-base font-semibold mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#5a5448] text-sm font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
