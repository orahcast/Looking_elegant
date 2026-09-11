import { Menu, Bell, Search, RefreshCw, Sun, Moon } from 'lucide-react'

const pageTitles = {
  dashboard: { title: 'Dashboard', subtitle: "Welcome back — here’s your inventory at a glance." },
  inventory: { title: 'Inventory', subtitle: 'Manage your full rental catalog in real time.' },
  settings:  { title: 'Settings',  subtitle: 'Configure your store preferences.' },
}

export default function Header({
  activeSection,
  onMenuToggle,
  isDark,
  onToggleTheme,
  searchQuery = '',
  onSearchChange,
}) {
  const { title, subtitle } = pageTitles[activeSection] || pageTitles.dashboard

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3.5 bg-[var(--bg-surface)] backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-200">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1.5 -ml-1"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="hidden sm:block min-w-0">
        <h1 className="font-editorial text-[var(--text-main)] text-lg font-light tracking-wide leading-tight">
          {title}
        </h1>
        <p className="text-[var(--text-muted)] text-[0.72rem] tracking-wide mt-0.5 truncate">
          {subtitle}
        </p>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-sm ml-auto sm:ml-6">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search inventory…"
            id="inventory-search"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-lg pl-8 pr-3 py-2 text-[0.82rem] text-[var(--text-main)] placeholder-[var(--text-subtle)] outline-none focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/15 transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme Toggle Button (Light / Dark Mode) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--gold-primary)] transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm"
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={17} className="text-amber-400 animate-spin-slow" />
          ) : (
            <Moon size={17} className="text-slate-700" />
          )}
        </button>

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
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--gold-primary)] rounded-full border border-[var(--bg-surface)]" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 cursor-pointer ml-1 shadow-sm">
          O
        </div>
      </div>
    </header>
  )
}
