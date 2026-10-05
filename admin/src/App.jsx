import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardStats from './components/DashboardStats'
import InventoryTable from './components/InventoryTable'
import AddItemModal from './components/AddItemModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import OrdersSection from './components/OrdersSection'
import ClientsSection from './components/ClientsSection'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'
import { useInventory } from './hooks/useInventory'
import { useOrders } from './hooks/useOrders'
import { useClients } from './hooks/useClients'
import { Plus, Sparkles, Loader2 } from 'lucide-react'

// ─── Main App ──────────────────────────────────────────────────────
export default function App() {
  // ── Auth ────────────────────────────────────────────────────────
  const { session, loading: authLoading, signIn, signOut } = useAuth()

  // ── Data hooks (Supabase-backed) ────────────────────────────────
  const { items, addItem, updateItem, deleteItem } = useInventory()
  const { orders, addOrder, updateOrderStatus, deleteOrder } = useOrders()
  const { clients, addClient, updateClient, deleteClient } = useClients()

  // ── UI state ────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Theme state (localStorage is fine here — it's a UI preference only)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )
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

  // ── Auth guard: show loading spinner or login page ──────────────
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-app)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[var(--gold-text)]" />
          <p className="text-[var(--text-muted)] text-sm">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Login onSignIn={signIn} />
  }

  // ── Inventory CRUD handlers ─────────────────────────────────────
  const handleOpenAdd = () => {
    setItemToEdit(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setItemToEdit(item)
    setModalOpen(true)
  }

  const handleSaveItem = async (savedItem) => {
    try {
      if (itemToEdit) {
        await updateItem(savedItem.id, savedItem)
      } else {
        await addItem(savedItem)
      }
      setModalOpen(false)
      setItemToEdit(null)
    } catch (err) {
      console.error('Save item error:', err)
      alert('Failed to save item: ' + err.message)
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id)
      setItemToDelete(null)
    } catch (err) {
      console.error('Delete item error:', err)
      alert('Failed to delete item: ' + err.message)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateItem(id, { status: newStatus })
    } catch (err) {
      console.error('Status change error:', err)
      alert('Failed to update status: ' + err.message)
    }
  }

  // ── Orders CRUD handlers ────────────────────────────────────────
  const handleAddOrder = async (newOrder) => {
    try {
      await addOrder(newOrder)
    } catch (err) {
      console.error('Add order error:', err)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (err) {
      console.error('Update order status error:', err)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId)
    } catch (err) {
      console.error('Delete order error:', err)
    }
  }

  // ── Client Book CRUD handlers ───────────────────────────────────
  const handleAddClient = async (newClient) => {
    try {
      await addClient(newClient)
    } catch (err) {
      console.error('Add client error:', err)
    }
  }

  const handleUpdateClient = async (clientId, updatedFields) => {
    try {
      await updateClient(clientId, updatedFields)
    } catch (err) {
      console.error('Update client error:', err)
    }
  }

  const handleDeleteClient = async (clientId) => {
    try {
      await deleteClient(clientId)
    } catch (err) {
      console.error('Delete client error:', err)
    }
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
        onSignOut={signOut}
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

          {/* ─── Dashboard section ─────────────────────────────────────── */}
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
              <DashboardStats items={items} orders={orders} />

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
                  onStatusChange={handleStatusChange}
                  searchQuery={searchQuery}
                />
              </div>
            </>
          )}

          {/* ─── Web Orders section ────────────────────────────────────── */}
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

          {/* ─── Client Register Book ──────────────────────────────────── */}
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

          {/* ─── Inventory section ─────────────────────────────────────── */}
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
                onStatusChange={handleStatusChange}
                searchQuery={searchQuery}
              />
            </>
          )}

          {/* ─── Settings placeholder ──────────────────────────────────── */}
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
