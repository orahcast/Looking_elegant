import { useState } from 'react'
import { 
  ShoppingBag, Search, Plus, Eye, Trash2, CheckCircle2, Clock, 
  MapPin, Phone, User, Calendar, X, Printer, Filter, AlertCircle,
  CreditCard, ChevronRight, Sparkles
} from 'lucide-react'

const formatRWF = (val) => {
  let num = Number(val) || 0
  if (Math.abs(num - Math.round(num)) < 0.1) { num = Math.round(num); }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num) + ' RWF'
}

export default function OrdersSection({
  orders = [],
  inventoryItems = [],
  onAddOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  searchQuery = '',
  onSearchChange = () => {}
}) {
  const [localSearch, setLocalSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add Order Form State
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custEmail, setCustEmail] = useState('')
  const [custAddress, setCustAddress] = useState('')
  const [orderType, setOrderType] = useState('Delivery')
  const [paymentMethod, setPaymentMethod] = useState('MTN Mobile Money (MoMo)')
  const [paymentStatus, setPaymentStatus] = useState('Paid')
  const [orderStatus, setOrderStatus] = useState('pending')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
  )
  const [notes, setNotes] = useState('')
  const [selectedItems, setSelectedItems] = useState([
    { item_id: '', name: '', category: '', size: '', rental_days: 3, rental_price_per_day: 0, total_price: 0 }
  ])

  const activeSearch = searchQuery || localSearch

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter
    const q = activeSearch.toLowerCase()
    const matchesSearch = !activeSearch ||
      (order.customer_name || '').toLowerCase().includes(q) ||
      (order.customer_phone || '').toLowerCase().includes(q) ||
      (order.customer_address || '').toLowerCase().includes(q) ||
      (order.order_number || '').toLowerCase().includes(q) ||
      (order.items || []).some(i => (i.name || '').toLowerCase().includes(q))
    return matchesStatus && matchesSearch
  })

  // KPI calculations
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.order_status === 'pending').length
  const activeRentals = orders.filter(o => o.order_status === 'confirmed' || o.order_status === 'delivered').length
  const totalRevenue = orders
    .filter(o => o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)

  // Item row operations
  const handleAddItemRow = () => {
    setSelectedItems(prev => [
      ...prev,
      { item_id: '', name: '', category: '', size: '', rental_days: 3, rental_price_per_day: 0, total_price: 0 }
    ])
  }

  const handleRemoveItemRow = (idx) => {
    if (selectedItems.length <= 1) return
    setSelectedItems(prev => prev.filter((_, i) => i !== idx))
  }

  const handleItemSelectChange = (idx, itemId) => {
    const prod = inventoryItems.find(p => String(p.id) === String(itemId))
    setSelectedItems(prev => {
      const updated = [...prev]
      if (prod) {
        const days = updated[idx].rental_days || 3
        const price = Number(prod.rental_price_per_day) || 0
        updated[idx] = {
          ...updated[idx],
          item_id: prod.id,
          name: prod.name,
          category: prod.category,
          size: prod.size,
          rental_price_per_day: price,
          total_price: days * price
        }
      }
      return updated
    })
  }

  const handleDaysChange = (idx, daysVal) => {
    const days = Math.max(1, parseInt(daysVal) || 1)
    setSelectedItems(prev => {
      const updated = [...prev]
      updated[idx].rental_days = days
      updated[idx].total_price = days * (updated[idx].rental_price_per_day || 0)
      return updated
    })
  }

  const calculateFormTotal = () => {
    return selectedItems.reduce((sum, i) => sum + (Number(i.total_price) || 0), 0)
  }

  const handleCreateOrder = (e) => {
    e.preventDefault()
    if (!custName.trim() || !custPhone.trim()) {
      alert('Please fill in customer name and phone number.')
      return
    }

    const validItems = selectedItems.filter(i => i.name.trim() !== '')
    if (validItems.length === 0) {
      alert('Please select at least one rental piece from inventory.')
      return
    }

    const totalAmt = validItems.reduce((sum, i) => sum + i.total_price, 0)
    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: `LE-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: custName.trim(),
      customer_phone: custPhone.trim(),
      customer_email: custEmail.trim() || '—',
      customer_address: custAddress.trim() || 'Store Pickup / In-Boutique',
      order_type: orderType,
      items: validItems,
      total_amount: totalAmt,
      deposit_amount: Math.round(totalAmt * 0.3),
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      order_status: orderStatus,
      start_date: startDate,
      return_date: returnDate,
      notes: notes.trim(),
      created_at: new Date().toISOString()
    }

    if (onAddOrder) {
      onAddOrder(newOrder)
    }

    setIsAddModalOpen(false)
    setCustName('')
    setCustPhone('')
    setCustEmail('')
    setCustAddress('')
    setNotes('')
    setSelectedItems([{ item_id: '', name: '', category: '', size: '', rental_days: 3, rental_price_per_day: 0, total_price: 0 }])
  }

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
      case 'completed':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20'
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="gold-divider" />
          <h1 className="font-editorial text-[var(--text-main)] text-2xl sm:text-3xl font-light tracking-wide flex items-center gap-2.5">
            <ShoppingBag className="text-[var(--gold-text)]" size={26} strokeWidth={1.8} />
            Online Web Orders
          </h1>
          <p className="text-[var(--text-muted)] text-[0.78rem] mt-1 tracking-wide font-medium">
            Manage customer online rental orders, chosen outfits, delivery requests &amp; payments
          </p>
        </div>

        <button
          className="btn-gold self-start sm:self-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={15} />
          Record New Web Order
        </button>
      </div>

      {/* Compact 2-Column Smartphone Pill Cards - Crisp White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`rounded-2xl p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between h-[72px] sm:h-auto cursor-pointer active:scale-95 shadow-sm hover:shadow ${
            statusFilter === 'all'
              ? 'bg-white dark:bg-[#161410] border-[var(--gold-primary)] ring-1 ring-[var(--gold-primary)]/30'
              : 'bg-white dark:bg-[#161410] border-gray-200/90 dark:border-[var(--border-color)] hover:border-[var(--gold-primary)]/50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <ShoppingBag size={18} className="text-[var(--gold-text)]" />
            <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">Web Orders</span>
            <span className="text-xs font-bold font-mono text-[var(--gold-text)]">{totalOrders}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`rounded-2xl p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between h-[72px] sm:h-auto cursor-pointer active:scale-95 shadow-sm hover:shadow ${
            statusFilter === 'pending'
              ? 'bg-white dark:bg-[#161410] border-amber-500 ring-1 ring-amber-500/30'
              : 'bg-white dark:bg-[#161410] border-gray-200/90 dark:border-[var(--border-color)] hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Clock size={18} className="text-amber-500" />
            <div className="flex items-center gap-1">
              {pendingOrders > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
              <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
            </div>
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">Pending</span>
            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">{pendingOrders}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('confirmed')}
          className={`rounded-2xl p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between h-[72px] sm:h-auto cursor-pointer active:scale-95 shadow-sm hover:shadow ${
            statusFilter === 'confirmed'
              ? 'bg-white dark:bg-[#161410] border-blue-500 ring-1 ring-blue-500/30'
              : 'bg-white dark:bg-[#161410] border-gray-200/90 dark:border-[var(--border-color)] hover:border-blue-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <CheckCircle2 size={18} className="text-blue-500" />
            <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">Confirmed</span>
            <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{activeRentals}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className="rounded-2xl p-3 sm:p-3.5 text-left border border-gray-200/90 dark:border-[var(--border-color)] bg-white dark:bg-[#161410] hover:border-emerald-500/50 transition-all flex flex-col justify-between h-[72px] sm:h-auto cursor-pointer active:scale-95 shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between w-full">
            <CreditCard size={18} className="text-emerald-500" />
            <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">Total Value</span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate ml-1">{formatRWF(totalRevenue)}</span>
          </div>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-card p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by customer name, phone, address, piece or order #..."
            value={activeSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value)
              onSearchChange(e.target.value)
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold-primary)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `All (${totalOrders})` },
            { id: 'pending', label: `Pending (${pendingOrders})` },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'completed', label: 'Completed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-[var(--gold-primary)] text-white dark:text-[#0a0906]'
                  : 'bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--gold-primary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="text-[var(--text-main)] text-sm font-semibold">
            Orders Received ({filteredOrders.length})
          </h2>
          <span className="text-[var(--text-muted)] text-xs">Sorted by newest</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Rented</th>
                <th className="py-3 px-4">Rental Window</th>
                <th className="py-3 px-4 text-right">Total (RWF)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
              {filteredOrders.map(order => {
                const itemsSummary = (order.items || [])
                  .map(i => `${i.name} (${i.size || 'Standard'})`)
                  .join(', ')

                return (
                  <tr key={order.id} className="hover:bg-[var(--bg-surface-subtle)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--gold-text)] whitespace-nowrap">
                      #{order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)] whitespace-nowrap text-xs">
                      {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      <span className="text-[0.68rem] block text-[var(--text-subtle)]">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold">{order.customer_name}</div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <Phone size={11} />
                        <a href={`tel:${order.customer_phone}`} className="hover:underline">
                          {order.customer_phone}
                        </a>
                      </div>
                      {order.customer_address && (
                        <div className="text-[0.68rem] text-[var(--text-subtle)] flex items-center gap-1 mt-0.5 max-w-[200px] truncate" title={order.customer_address}>
                          <MapPin size={10} /> {order.customer_address}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <p className="truncate font-medium text-xs text-[var(--text-main)]" title={itemsSummary}>
                        {itemsSummary}
                      </p>
                      <span className="text-[0.68rem] text-[var(--text-muted)]">
                        {(order.items || []).length} piece{(order.items || []).length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1 text-[var(--text-main)] font-medium">
                        <Calendar size={12} className="text-[var(--gold-text)]" />
                        <span>{order.start_date || 'TBD'}</span>
                        <span className="text-[var(--text-muted)]">→</span>
                        <span>{order.return_date || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-sm whitespace-nowrap">
                      {formatRWF(order.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`text-[0.68rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getBadgeStyle(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                          title="View Order Details"
                        >
                          <Eye size={15} />
                        </button>
                        {order.order_status === 'pending' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'confirmed')}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-[0.68rem] font-bold hover:bg-blue-700 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {order.order_status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[0.68rem] font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Delivered
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Delete order #${order.order_number} for ${order.customer_name}?`)) {
                              onDeleteOrder(order.id)
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-500 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[var(--text-muted)]">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No web orders found</p>
                    <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                      {activeSearch ? `No matches for "${activeSearch}"` : 'Website orders will appear here as clients submit them.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: ORDER DETAILS ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-main)] font-editorial">
                    Order #{selectedOrder.order_number}
                  </h3>
                  <span className={`text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getBadgeStyle(selectedOrder.order_status)}`}>
                    {selectedOrder.order_status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Ordered on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-[var(--bg-surface-subtle)]/60 rounded-xl p-4 border border-[var(--border-color)] space-y-2 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Customer Name</span>
                  <span className="font-semibold text-[var(--text-main)]">{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Telephone</span>
                  <a href={`tel:${selectedOrder.customer_phone}`} className="font-semibold text-[var(--gold-text)] hover:underline">
                    {selectedOrder.customer_phone}
                  </a>
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-color)]/50">
                <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Delivery / Fitting Destination</span>
                <span className="font-medium text-[var(--text-main)]">{selectedOrder.customer_address}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]/50">
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Payment Method</span>
                  <span className="font-medium">{selectedOrder.payment_method || 'MoMo'}</span>
                </div>
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Payment Status</span>
                  <span className="font-semibold text-emerald-600">{selectedOrder.payment_status || 'Paid'}</span>
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">Pieces Rented</h4>
              <div className="border border-[var(--border-color)] rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left">Outfit / Piece</th>
                      <th className="py-2 px-2 text-center">Days</th>
                      <th className="py-2 px-3 text-right">Daily Rate</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {(selectedOrder.items || []).map((item, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3">
                          <span className="font-semibold block text-[var(--text-main)]">{item.name}</span>
                          <span className="text-[0.68rem] text-[var(--text-muted)]">{item.category} · Size {item.size || 'Standard'}</span>
                        </td>
                        <td className="py-2 px-2 text-center font-bold">{item.rental_days || 3}</td>
                        <td className="py-2 px-3 text-right text-[var(--text-muted)]">{formatRWF(item.rental_price_per_day)}</td>
                        <td className="py-2 px-3 text-right font-bold text-[var(--gold-text)]">{formatRWF(item.total_price)}</td>
                      </tr>
                    ))}
                    <tr className="bg-[var(--bg-surface-subtle)]/80 font-bold border-t border-[var(--border-color)] text-sm">
                      <td colSpan="3" className="py-2 px-3 text-right">Total Order Price:</td>
                      <td className="py-2 px-3 text-right text-[var(--gold-text)]">{formatRWF(selectedOrder.total_amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <strong className="block mb-0.5">Order &amp; Fitting Notes:</strong>
                {selectedOrder.notes}
              </div>
            )}

            {/* Quick Status Updater */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Update Order Status</span>
              <div className="grid grid-cols-4 gap-1.5">
                {['pending', 'confirmed', 'delivered', 'completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateOrderStatus(selectedOrder.id, st)
                      setSelectedOrder(prev => ({ ...prev, order_status: st }))
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                      selectedOrder.order_status === st
                        ? 'bg-[var(--gold-primary)] text-white border-[var(--gold-primary)]'
                        : 'bg-[var(--bg-app)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--gold-primary)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="btn-gold flex-1 flex items-center justify-center gap-1.5"
              >
                <Printer size={15} />
                Print Order Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD WEB ORDER ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)] font-editorial">
                  Record Web / Phone Order
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Manual intake of incoming online or phone reservation</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian Habimana"
                    value={custName}
                    onChange={e => setCustName(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Telephone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0788 123 456"
                    value={custPhone}
                    onChange={e => setCustPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Delivery / Fitting Address</label>
                <input
                  type="text"
                  placeholder="e.g. KG 125 St, House 14, Kimironko, Kigali"
                  value={custAddress}
                  onChange={e => setCustAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Rental Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Return Due Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
              </div>

              {/* Items selector */}
              <div className="border-t border-[var(--border-color)] pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[0.72rem] uppercase font-bold text-[var(--text-main)]">
                    Items Selected ({selectedItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-[var(--gold-text)] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Piece
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[var(--bg-surface-subtle)] p-2 rounded-lg border border-[var(--border-color)]">
                      <select
                        value={item.item_id}
                        onChange={e => handleItemSelectChange(idx, e.target.value)}
                        className="flex-1 text-xs bg-[var(--bg-app)] border border-[var(--border-color)] rounded px-2 py-1.5 text-[var(--text-main)]"
                        required
                      >
                        <option value="">Select piece from catalog...</option>
                        {inventoryItems.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.size}) - {formatRWF(p.rental_price_per_day)}/day
                          </option>
                        ))}
                      </select>

                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          placeholder="Days"
                          value={item.rental_days}
                          onChange={e => handleDaysChange(idx, e.target.value)}
                          className="w-full text-center text-xs bg-[var(--bg-app)] border border-[var(--border-color)] rounded px-1 py-1.5"
                          title="Rental days"
                        />
                      </div>

                      <div className="w-24 text-right font-bold text-xs text-[var(--gold-text)]">
                        {formatRWF(item.total_price)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={selectedItems.length <= 1}
                        className="text-rose-500 hover:text-rose-700 disabled:opacity-30 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center bg-[var(--bg-surface-subtle)] p-3 rounded-xl mt-3 border border-[var(--border-color)]">
                  <span className="font-semibold text-xs text-[var(--text-muted)]">Calculated Total:</span>
                  <span className="font-bold text-base text-[var(--gold-text)]">{formatRWF(calculateFormTotal())}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)]"
                  >
                    <option value="MTN Mobile Money (MoMo)">MTN Mobile Money (MoMo)</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Bank Card">Credit / Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Initial Status</label>
                  <select
                    value={orderStatus}
                    onChange={e => setOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered / Handed Over</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">Special Notes / Fitting Requests</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Needs trouser hem taken up, delivery before Friday 2pm"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)]"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold flex-1"
                >
                  Save Web Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
