import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardStats from './components/DashboardStats'
import InventoryTable from './components/InventoryTable'
import AddItemModal from './components/AddItemModal'
import { Plus, BarChart3, Package, Sparkles } from 'lucide-react'

// ── Quick-action card for Dashboard overview ─────────────────────────────────
function QuickAction({ icon: Icon, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-4 text-left hover:border-[#c9a97a]/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 w-full"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
        style={{ background: `${color}18` }}
      >
        <Icon size={16} style={{ color }} strokeWidth={1.8} />
      </div>
      <p className="text-white/80 text-sm font-medium leading-tight">{label}</p>
      <p className="text-white/30 text-[0.65rem] mt-0.5">{sub}</p>
    </button>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0906]">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          activeSection={activeSection}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* ── Dashboard section ─────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <>
              {/* Page heading */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="gold-divider" />
                  <h1 className="font-editorial text-white text-2xl sm:text-3xl font-light tracking-wide">
                    Inventory Overview
                  </h1>
                  <p className="text-white/30 text-[0.72rem] mt-1 tracking-wide">
                    Wednesday, {new Date().toLocaleDateString('en-RW', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  id="add-item-btn"
                  className="btn-gold self-start sm:self-auto"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus size={15} />
                  Add New Item
                </button>
              </div>

              {/* Stats */}
              <DashboardStats />

              {/* Quick actions */}
              <div>
                <h2 className="text-white/40 text-[0.65rem] uppercase tracking-widest mb-3 font-medium">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <QuickAction
                    icon={Plus}
                    label="Add New Item"
                    sub="List a new rental piece"
                    color="#c9a97a"
                    onClick={() => setModalOpen(true)}
                  />
                  <QuickAction
                    icon={Package}
                    label="View Inventory"
                    sub="Manage all stock"
                    color="#60a5fa"
                    onClick={() => setActiveSection('inventory')}
                  />
                  <QuickAction
                    icon={BarChart3}
                    label="Reports"
                    sub="Coming in Week 3"
                    color="#a78bfa"
                    onClick={() => {}}
                  />
                </div>
              </div>

              {/* Recent inventory preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white/40 text-[0.65rem] uppercase tracking-widest font-medium">
                    Recent Inventory
                  </h2>
                  <button
                    className="text-[#c9a97a] text-[0.68rem] hover:underline underline-offset-2"
                    onClick={() => setActiveSection('inventory')}
                  >
                    View all →
                  </button>
                </div>
                <InventoryTable onAddItem={() => setModalOpen(true)} />
              </div>
            </>
          )}

          {/* ── Inventory section ──────────────────────────────── */}
          {activeSection === 'inventory' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="gold-divider" />
                  <h1 className="font-editorial text-white text-2xl sm:text-3xl font-light tracking-wide">
                    Rental Inventory
                  </h1>
                  <p className="text-white/30 text-[0.72rem] mt-1 tracking-wide">
                    Full catalog management
                  </p>
                </div>
                <button
                  id="inventory-add-btn"
                  className="btn-gold self-start sm:self-auto"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus size={15} />
                  Add New Item
                </button>
              </div>
              <InventoryTable onAddItem={() => setModalOpen(true)} />
            </>
          )}

          {/* ── Settings placeholder ───────────────────────────── */}
          {activeSection === 'settings' && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#c9a97a]/8 border border-[#c9a97a]/15 flex items-center justify-center">
                <Sparkles size={28} className="text-[#c9a97a]/50" />
              </div>
              <div>
                <h2 className="font-editorial text-white text-2xl font-light mb-1">Coming Soon</h2>
                <p className="text-white/30 text-sm max-w-xs">
                  Settings will be available in a future sprint.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Item Modal */}
      {modalOpen && <AddItemModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
