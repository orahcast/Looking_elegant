import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Collection', href: '#collection' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'The Fit Guide', href: '#fit-guide' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 lg:px-16 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0906]/95 backdrop-blur-md py-3 shadow-xl'
            : 'bg-transparent py-5'
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none select-none">
          <span className="font-editorial text-white text-xl font-light tracking-widest uppercase">
            Looking Elegant
          </span>
          <span className="text-[#c9a97a] text-[0.5rem] tracking-widest3 uppercase font-sans font-medium mt-0.5">
            Atelier
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="nav-link">{l.label}</a>
            </li>
          ))}
        </ul>

        {/* Book Fitting CTA */}
        <div className="hidden md:block">
          <button
            className="btn-outline-gold"
            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Fitting
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <button
          className="text-white mb-10 block ml-auto"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        <div className="mb-8">
          <span className="font-editorial text-white text-lg font-light tracking-widest uppercase block">
            Looking Elegant
          </span>
          <span className="text-[#c9a97a] text-[0.5rem] tracking-widest3 uppercase font-sans font-medium">
            Atelier
          </span>
        </div>
        <ul className="flex flex-col gap-7">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="nav-link text-sm"
                onClick={() => setDrawerOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="btn-outline-gold mt-10 w-full text-center">
          Book Fitting
        </button>
      </div>
    </>
  )
}
