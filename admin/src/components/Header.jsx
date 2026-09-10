import { Menu, Bell, Search, RefreshCw } from 'lucide-react'

const pageTitles = {
  dashboard: { title: 'Dashboard', subtitle: "Welcome back \u2014 here\u2019s your inventory at a glance." },
  inventory: { title: 'Inventory', subtitle: 'Manage your full rental catalog in real time.' },
  settings:  { title: 'Settings',  subtitle: 'Configure your store preferences.' },
}

export default function Header({ activeSection, onMenuToggle }) {
  const { title, subtitle } = pageTitles[activeSection] || pageTitles.dashboard

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3.5 bg-[#0a0906]/90 backdrop-blur-md border-b border-white/5">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden text-white/50 hover:text-white transition-colors p-1.5 -ml-1"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Page title – hidden on mobile when search is wide */}
      <div className="hidden sm:block min-w-0">
        <h1 className="font-editorial text-white text-lg font-light tracking-wide leading-tight">
          {title}
        </h1>
        <p className="text-white/30 text-[0.68rem] tracking-wide mt-0.5 truncate">
          {subtitle}
        </p>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-sm ml-auto sm:ml-6">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search inventory…"
            id="inventory-search"
            className="w-full bg-white/4 border border-white/7 rounded-lg pl-8 pr-3 py-2 text-[0.8rem] text-white/70 placeholder-white/20 outline-none focus:border-[#c9a97a]/40 focus:ring-2 focus:ring-[#c9a97a]/8 transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Refresh */}
        <button
          className="btn-icon"
          aria-label="Refresh data"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <button
          className="btn-icon relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#c9a97a] rounded-full border border-[#0a0906]" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center text-[#0a0906] font-bold text-xs flex-shrink-0 cursor-pointer ml-1">
          O
        </div>
      </div>
    </header>
  )
}
