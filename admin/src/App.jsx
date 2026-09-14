import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardStats from './components/DashboardStats'
import InventoryTable from './components/InventoryTable'
import AddItemModal from './components/AddItemModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import OrdersSection from './components/OrdersSection'
import ClientsSection from './components/ClientsSection'
import { INITIAL_ITEMS } from './data/initialItems'
import { INITIAL_ORDERS } from './data/initialOrders'
import { INITIAL_CLIENTS } from './data/initialClients'
import { Plus, Sparkles } from 'lucide-react'

// ─── Main App ──────────────────────────────────────────────────────
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

  // Orders state with localStorage persistence
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('looking_elegant_orders')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {
        console.error('Failed to parse saved orders', e)
      }
    }
    return INITIAL_ORDERS
  })

  useEffect(() => {
    localStorage.setItem('looking_elegant_orders', JSON.stringify(orders))
  }, [orders])

  // Clients state (physical notebook replacement) with localStorage persistence
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('looking_elegant_clients')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {
        console.error('Failed to parse saved clients', e)
      }
    }
    return INITIAL_CLIENTS
  })

  useEffect(() => {
    localStorage.setItem('looking_elegant_clients', JSON.stringify(clients))
  }, [clients])

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('looking_elegant_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('looking_elegant_theme', 'light')
    }
  }

  // Inventory item CRUD
  const handleOpenAdd = () => {
    setItemToEdit(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setItemToEdit(item)
    setModalOpen(true)
  }

  const handleSaveItem = (savedItem) => {
    if (itemToEdit) {
      setItems((prev) =>
        prev.map((i) => (i.id === savedItem.id ? savedItem : i))
      )
    } else {
      setItems((prev) => [savedItem, ...prev])
    }
    setModalOpen(false)
    setItemToEdit(null)
  }

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setItemToDelete(null)
  }

  // Web Orders CRUD
  const handleAddOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev])
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
    )
  }

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  // Client Book CRUD
  const handleAddClient = (newClient) => {
    setClients((prev) => [newClient, ...prev])
  }

  const handleUpdateClient = (clientId, updatedFields) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updatedFields } : c))
    )
  }

  const handleDeleteClient = (clientId) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId))
  }

  const pendingOrdersCount = orders.filter((o) => o.order_status === 'pending').length

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)]">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onSelectSection={setActiveSection}
        isOpen={sidebarOpen}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCloseSidebar={() => setSidebarOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        ordersCount={pendingOrdersCount}
        totalClientsCount={clients.length}
        clientsCount={clients.length}
        totalItems={items.length}
      />

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <Header
          activeSection={activeSection}
          onMenuToggle={() => setSidebarOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[var(--bg-app)]">

          {/* ─── Dashboard section ────────────────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <>
              {/* Page heading */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="gold-divider" />
                  <h1 className="font-editorial text-[var(--text-main)] text-2xl sm:text-3xl font-light tracking-wide">
                    Boutique Overview
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

              {/* Recent inventory preview */}
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

          {/* ─── Web Orders section (Section 1 requested) ────────────────── */}
          {activeSection === 'orders' && (
            <OrdersSection
              orders={orders}
              inventoryItems={items}
              onAddOrder={handleAddOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {/* ─── Client Register Book (Section 2 requested) ──────────────── */}
          {activeSection === 'clients' && (
            <ClientsSection
              clients={clients}
              inventoryItems={items}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {/* ─── Inventory section ────────────────────────────────────────── */}
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

          {/* ─── Settings placeholder ────────────────────────────────────── */}
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
