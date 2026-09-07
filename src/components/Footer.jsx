const closetLinks = [
  { label: 'About Atelier', href: '#about' },
  { label: 'FAQ & Guide', href: '#faq' },
  { label: 'Contact Stylist', href: '#contact' },
  { label: 'Terms of Wear', href: '#terms' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="about" className="bg-[#0e0c08] text-white/70">

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand column */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <span className="font-editorial text-white text-xl font-light tracking-widest uppercase block">
              The Gentleman's Closet
            </span>
            <span className="text-[#c9a97a] text-[0.5rem] tracking-widest uppercase font-sans font-medium">
              At the centre of your finest hours
            </span>
          </div>
          <p className="text-white/45 text-xs leading-relaxed font-light max-w-xs mt-4">
            Providing fine, hand-adjusted suiting and leather dress shoes to gentlemen who command elegance, stature, and quiet sophistication.
          </p>
        </div>

        {/* Links column */}
        <div>
          <h4 className="text-white text-[0.6rem] tracking-widest2 uppercase font-medium mb-5">
            The Closet
          </h4>
          <ul className="space-y-3">
            {closetLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-white/50 text-xs font-light hover:text-[#c9a97a] transition-colors duration-200"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours column */}
        <div>
          <h4 className="text-white text-[0.6rem] tracking-widest2 uppercase font-medium mb-5">
            Atelier Hours
          </h4>
          <div className="space-y-1 text-xs font-light text-white/50">
            <p>Monday – Saturday</p>
            <p className="text-white font-medium text-sm">9:00 AM – 7:00 PM</p>
            <p className="mt-3 text-white/35">Closed on Sundays &amp; Government Holidays</p>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a97a]/30 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-[0.6rem] font-light">
          © {year} The Gentleman's Closet.{' '}
          <a href="#" className="hover:text-[#c9a97a] transition-colors">Contact for a no-obligation enquiry.</a>
        </p>
        <div className="flex items-center gap-6">
          {['Instagram', 'Pinterest', 'Journal'].map((s) => (
            <a
              key={s}
              href="#"
              className="text-white/35 text-[0.58rem] tracking-widest uppercase font-medium hover:text-[#c9a97a] transition-colors duration-200"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
