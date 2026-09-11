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

export default function Sidebar({ activeSection, onNavigate, isOpen, onClose, totalItems }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50 flex flex-col
          bg-[var(--bg-surface)] border-r border-[var(--border-color)] shadow-sm
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-[var(--border-color)]">
          <a href="/" className="flex items-start gap-2.5 select-none group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Gem size={14} className="text-white dark:text-[#0a0906]" />
            </div>
            <div className="leading-none">
              <span className="font-editorial text-[var(--text-main)] text-base font-medium tracking-wider block">
                Looking Elegant
              </span>
              <span className="text-[var(--gold-text)] text-[0.55rem] tracking-widest uppercase font-sans font-bold">
                Inventory Central
              </span>
            </div>
          </a>
          <button
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[0.62rem] uppercase tracking-widest text-[var(--text-subtle)] font-bold">
            Main Menu
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {navLinks.map(({ id, label, icon: Icon, badge }) => {
            const count = id === 'inventory' && typeof totalItems === 'number' ? totalItems : badge
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id); onClose(); }}
                className={`nav-item w-full text-left ${activeSection === id ? 'active' : ''}`}
              >
                <Icon size={16} strokeWidth={activeSection === id ? 2.2 : 1.8} />
                <span className="flex-1">{label}</span>
                {count !== undefined && (
                  <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-bold ${
                    activeSection === id
                      ? 'bg-[var(--gold-primary)] text-white dark:text-[#0a0906]'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]'
                  }`}>
                    {count}
                  </span>
                )}
                {activeSection === id && (
                  <ChevronRight size={13} className="text-[var(--gold-text)]" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom: owner info + logout */}
        <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-surface-subtle)]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center text-white dark:text-[#0a0906] font-bold text-sm flex-shrink-0 shadow-sm">
              O
            </div>
            <div className="overflow-hidden">
              <p className="text-[var(--text-main)] text-xs font-semibold leading-tight truncate">Boutique Owner</p>
              <p className="text-[var(--text-muted)] text-[0.68rem] truncate">owner@lookingelg.rw</p>
            </div>
          </div>
          <button className="nav-item w-full text-left hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 group">
            <LogOut size={15} strokeWidth={1.8} className="group-hover:text-red-600 dark:group-hover:text-red-400 text-[var(--text-muted)]" />
            <span className="text-xs font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
