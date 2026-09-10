import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Gem,
} from 'lucide-react'

const navLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package, badge: 24 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeSection, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50 flex flex-col
          bg-[#0a0906] border-r border-white/5
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
          <a href="/" className="flex items-start gap-2.5 select-none group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center flex-shrink-0 shadow-gold">
              <Gem size={14} className="text-[#0a0906]" />
            </div>
            <div className="leading-none">
              <span className="font-editorial text-white text-base font-light tracking-wider block">
                Looking Elegant
              </span>
              <span className="text-[#c9a97a] text-[0.5rem] tracking-widest uppercase font-sans font-medium">
                Inventory Central
              </span>
            </div>
          </a>
          <button
            className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[0.58rem] uppercase tracking-widest text-white/20 font-medium">
            Main Menu
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navLinks.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); onClose(); }}
              className={`nav-item w-full text-left ${activeSection === id ? 'active' : ''}`}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span className="flex-1 font-medium">{label}</span>
              {badge && (
                <span className="text-[0.6rem] bg-[#c9a97a]/10 text-[#c9a97a] border border-[#c9a97a]/20 rounded-full px-1.5 py-0.5 font-semibold">
                  {badge}
                </span>
              )}
              {activeSection === id && (
                <ChevronRight size={13} className="text-[#c9a97a] opacity-70" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom: owner info + logout */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center text-[#0a0906] font-bold text-sm flex-shrink-0">
              O
            </div>
            <div className="overflow-hidden">
              <p className="text-white/80 text-xs font-medium leading-tight truncate">Boutique Owner</p>
              <p className="text-white/30 text-[0.62rem] truncate">owner@lookingelg.rw</p>
            </div>
          </div>
          <button className="nav-item w-full text-left hover:text-red-400 hover:bg-red-500/8 group">
            <LogOut size={15} strokeWidth={1.8} className="group-hover:text-red-400" />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
