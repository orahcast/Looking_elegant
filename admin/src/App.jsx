import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardStats from './components/DashboardStats'
import InventoryTable from './components/InventoryTable'
import AddItemModal from './components/AddItemModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import { INITIAL_ITEMS } from './data/initialItems'
import { Plus, BarChart3, Package, Sparkles } from 'lucide-react'

// ── Quick-action card for Dashboard overview ─────────────────────────────────
function QuickAction({ icon: Icon, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-4 text-left hover:border-[var(--gold-primary)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 w-full group cursor-pointer"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
        style={{ background: `${color}18` }}
      >
        <Icon size={17} style={{ color }} strokeWidth={2} />
      </div>
      <p className="text-[var(--text-main)] text-sm font-semibold leading-tight">{label}</p>
      <p className="text-[var(--text-muted)] text-[0.72rem] mt-0.5">{sub}</p>
    </button>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Inventory state with localStorage persistence
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('looking_elegant_inventory')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {
        console.error('Failed to parse saved inventory', e)
      }
    }
    return INITIAL_ITEMS
  })

  useEffect(() => {
    localStorage.setItem('looking_elegant_inventory', JSON.stringify(items))
  }, [items])

  // Theme state: persisted in localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('looking_elegant_admin_theme')
    return saved === 'dark'
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('looking_elegant_admin_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('looking_elegant_admin_theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  // Handlers for Add, Edit, Delete
  const handleOpenAdd = () => {
    setItemToEdit(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setItemToEdit(item)
    setModalOpen(true)
  }

  const handleSaveItem = (itemData) => {
    if (itemData.id) {
      // Edit existing item
      setItems((prev) =>
        prev.map((item) => (item.id === itemData.id ? { ...item, ...itemData } : item))
      )
    } else {
      // Add new item with unique id
      const newItem = {
        ...itemData,
        id: String(Date.now()),
      }
      setItems((prev) => [newItem, ...prev])
    }
  }

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setItemToDelete(null)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalItems={items.length}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with search & dark mode toggle */}
        <Header
          activeSection={activeSection}
          onMenuToggle={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[var(--bg-app)]">

          {/* ── Dashboard section ─────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <>
              {/* Page heading */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="gold-divider" />
                  <h1 className="font-editorial text-[var(--text-main)] text-2xl sm:text-3xl font-light tracking-wide">
                    Inventory Overview
                  </h1>
                  <p className="text-[var(--text-muted)] text-[0.78rem] mt-1 tracking-wide font-medium">
                    {new Date().toLocaleDateString('en-RW', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  id="add-item-btn"
                  className="btn-gold self-start sm:self-auto"
                  onClick={handleOpenAdd}
                >
                  <Plus size={15} />
                  Add New Item
                </button>
              </div>

              {/* Dynamic Stats */}
              <DashboardStats items={items} />

              {/* Quick actions */}
              <div>
                <h2 className="text-[var(--text-subtle)] text-[0.68rem] uppercase tracking-widest mb-3 font-bold">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <QuickAction
                    icon={Plus}
                    label="Add New Item"
                    sub="List a new rental piece"
                    color="#b8935a"
                    onClick={handleOpenAdd}
                  />
                  <QuickAction
                    icon={Package}
                    label="View Inventory"
                    sub={`Browse all ${items.length} items`}
                    color="#2563eb"
                    onClick={() => setActiveSection('inventory')}
                  />
                  <QuickAction
                    icon={BarChart3}
                    label="Reports"
                    sub="Coming in Week 3"
                    color="#7c3aed"
                    onClick={() => {}}
                  />
                </div>
              </div>

              {/* Recent inventory preview with functional actions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[var(--text-subtle)] text-[0.68rem] uppercase tracking-widest font-bold">
                    Recent Inventory
                  </h2>
                  <button
                    className="text-[var(--gold-text)] text-[0.75rem] font-bold hover:underline underline-offset-2"
                    onClick={() => setActiveSection('inventory')}
                  >
                    View all →
                  </button>
                </div>
                <InventoryTable
                  items={items}
                  onAddItem={handleOpenAdd}
                  onEditItem={handleOpenEdit}
                  onDeleteItem={setItemToDelete}
                  searchQuery={searchQuery}
                />
              </div>
            </>
          )}

          {/* ── Inventory section ──────────────────────────────── */}
          {activeSection === 'inventory' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="gold-divider" />
                  <h1 className="font-editorial text-[var(--text-main)] text-2xl sm:text-3xl font-light tracking-wide">
                    Rental Inventory
                  </h1>
                  <p className="text-[var(--text-muted)] text-[0.78rem] mt-1 tracking-wide font-medium">
                    Full catalog management ({items.length} total items)
                  </p>
                </div>
                <button
                  id="inventory-add-btn"
                  className="btn-gold self-start sm:self-auto"
                  onClick={handleOpenAdd}
                >
                  <Plus size={15} />
                  Add New Item
                </button>
              </div>
              <InventoryTable
                items={items}
                onAddItem={handleOpenAdd}
                onEditItem={handleOpenEdit}
                onDeleteItem={setItemToDelete}
                searchQuery={searchQuery}
              />
            </>
          )}

          {/* ── Settings placeholder ───────────────────────────── */}
          {activeSection === 'settings' && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--gold-badge-bg)] border border-[var(--gold-badge-border)] flex items-center justify-center">
                <Sparkles size={28} className="text-[var(--gold-text)]" />
              </div>
              <div>
                <h2 className="font-editorial text-[var(--text-main)] text-2xl font-light mb-1">Coming Soon</h2>
                <p className="text-[var(--text-muted)] text-sm max-w-xs">
                  Settings will be available in a future sprint.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add & Edit Item Modal */}
      {modalOpen && (
        <AddItemModal
          itemToEdit={itemToEdit}
          onSave={handleSaveItem}
          onClose={() => {
            setModalOpen(false)
            setItemToEdit(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <DeleteConfirmModal
          item={itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteItem}
        />
      )}
    </div>
  )
}
