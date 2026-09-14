import { useState } from 'react'
import { 
  BookOpen, Plus, Search, Edit, Trash2, Phone, User, 
  Calendar, Clock, Download, Printer, Eye, X, Check, ChevronRight
} from 'lucide-react'

export default function ClientsSection({
  clients = [],
  inventoryItems = [],
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  searchQuery = '',
  onSearchChange = () => {}
}) {
  const [localSearch, setLocalSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [selectedClientView, setSelectedClientView] = useState(null)

  // Simplified Form Fields
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [itemsTaken, setItemsTaken] = useState('')
  const [returnDue, setReturnDue] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
  )
  const [status, setStatus] = useState('active_rental')

  const activeSearch = searchQuery || localSearch

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const q = activeSearch.toLowerCase()
    const matchesSearch = !activeSearch ||
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.id_number || '').toLowerCase().includes(q) ||
      (c.phone_number || '').toLowerCase().includes(q) ||
      (c.items_taken || '').toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  // Summary Counters
  const totalClients = clients.length
  const activeRentals = clients.filter(c => c.status === 'active_rental').length

  const handleOpenAdd = () => {
    setEditingClient(null)
    setFullName('')
    setIdNumber('')
    setPhoneNumber('')
    setItemsTaken('')
    setReturnDue(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10))
    setStatus('active_rental')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (client) => {
    setEditingClient(client)
    setFullName(client.full_name || '')
    setIdNumber(client.id_number || '')
    setPhoneNumber(client.phone_number || '')
    setItemsTaken(client.items_taken || '')
    setReturnDue(client.return_due || new Date().toISOString().slice(0, 10))
    setStatus(client.status || 'active_rental')
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!fullName.trim() || !idNumber.trim() || !phoneNumber.trim()) {
      alert('Please fill in Client Name, National ID / Passport, and Phone Number.')
      return
    }

    const payload = {
      id: editingClient ? editingClient.id : `cli-${Date.now()}`,
      full_name: fullName.trim(),
      id_number: idNumber.trim(),
      phone_number: phoneNumber.trim(),
      items_taken: itemsTaken.trim() || 'Rental Outfit',
      return_due: returnDue,
      status: status,
      // System automatically detects and records current timestamp
      recorded_at: editingClient?.recorded_at || new Date().toISOString(),
    }

    if (editingClient) {
      if (onUpdateClient) onUpdateClient(editingClient.id, payload)
    } else {
      if (onAddClient) onAddClient(payload)
    }

    setIsModalOpen(false)
    setEditingClient(null)
  }

  const handleExportCSV = () => {
    if (clients.length === 0) {
      alert('No client records to export.')
      return
    }

    const headers = ['Date & Time Logged', 'Client Name', 'Telephone', 'National ID / Passport', 'Outfit Taken', 'Return Due', 'Status']
    const rows = clients.map(c => [
      new Date(c.recorded_at || c.created_at || Date.now()).toLocaleString(),
      `"${(c.full_name || '').replace(/"/g, '""')}"`,
      `"${(c.phone_number || '').replace(/"/g, '""')}"`,
      `"${(c.id_number || '').replace(/"/g, '""')}"`,
      `"${(c.items_taken || '').replace(/"/g, '""')}"`,
      c.return_due || '',
      c.status || ''
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `looking_elegant_client_book_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="gold-divider" />
          <h1 className="font-editorial text-[var(--text-main)] text-2xl sm:text-3xl font-light tracking-wide flex items-center gap-2.5">
            <BookOpen className="text-[var(--gold-text)]" size={26} strokeWidth={1.8} />
            On-Site Client Register (Digital Book)
          </h1>
          <p className="text-[var(--text-muted)] text-[0.78rem] mt-1 tracking-wide font-medium">
            Quickly record walk-in clients with their National ID, phone, outfit taken, and return schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3"
            title="Download CSV for official records"
          >
            <Download size={14} /> Export Book
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-gold flex items-center gap-1.5 text-xs py-2 px-3.5"
          >
            <Plus size={16} /> Record Client in Book
          </button>
        </div>
      </div>

      {/* Compact 2-Column Cards (Exact Smartphone Pill Style - Crisp White) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
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
            <BookOpen size={18} className="text-[var(--gold-text)]" />
            <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">Total in Book</span>
            <span className="text-xs font-bold font-mono text-[var(--gold-text)]">{totalClients}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('active_rental')}
          className={`rounded-2xl p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between h-[72px] sm:h-auto cursor-pointer active:scale-95 shadow-sm hover:shadow ${
            statusFilter === 'active_rental'
              ? 'bg-white dark:bg-[#161410] border-blue-500 ring-1 ring-blue-500/30'
              : 'bg-white dark:bg-[#161410] border-gray-200/90 dark:border-[var(--border-color)] hover:border-blue-500/50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Clock size={18} className="text-blue-500" />
            <ChevronRight size={15} className="text-gray-400 dark:text-[var(--text-muted)] opacity-60" />
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[var(--text-main)] truncate">Out on Rental</span>
            <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{activeRentals}</span>
          </div>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="glass-card p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by client name, National ID, phone, or outfit taken..."
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
            { id: 'all', label: `All (${totalClients})` },
            { id: 'active_rental', label: `Out on Rental (${activeRentals})` },
            { id: 'returned', label: 'Returned' },
            { id: 'inquiry', label: 'Fittings / Inquiries' }
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

      {/* Simplified Clean Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="text-[var(--text-main)] text-sm font-semibold">
            Book Entries ({filteredClients.length})
          </h2>
          <span className="text-[var(--text-muted)] text-xs">Sorted from most recent</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Telephone</th>
                <th className="py-3 px-4">National ID / Passport</th>
                <th className="py-3 px-4">Outfit Taken</th>
                <th className="py-3 px-4">Return Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
              {filteredClients.map(client => {
                const logDate = new Date(client.recorded_at || client.created_at || Date.now())
                return (
                  <tr key={client.id} className="hover:bg-[var(--bg-surface-subtle)]/50 transition-colors">
                    <td className="py-3.5 px-4 text-[var(--text-muted)] whitespace-nowrap text-xs">
                      {logDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="text-[0.68rem] block text-[var(--text-subtle)]">
                        {logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)] text-sm whitespace-nowrap">
                      {client.full_name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a href={`tel:${client.phone_number}`} className="font-semibold text-xs text-[var(--gold-text)] hover:underline inline-flex items-center gap-1">
                        <Phone size={11} /> {client.phone_number}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded text-[var(--text-main)]">
                        {client.id_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="font-medium text-xs truncate" title={client.items_taken}>
                        {client.items_taken || '—'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium text-[var(--text-muted)]">
                      {client.return_due || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`text-[0.68rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        client.status === 'active_rental'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                          : client.status === 'returned'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {client.status === 'active_rental' ? 'Out' : client.status === 'returned' ? 'Returned' : 'Fitting'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedClientView(client)}
                          className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 rounded-md hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                          title="Edit Record"
                        >
                          <Edit size={15} />
                        </button>
                        {client.status === 'active_rental' && (
                          <button
                            onClick={() => onUpdateClient(client.id, { ...client, status: 'returned' })}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[0.68rem] font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1"
                            title="Mark as Returned"
                          >
                            <Check size={11} /> Returned
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${client.full_name}" from the client book?`)) {
                              onDeleteClient(client.id)
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-500 transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[var(--text-muted)]">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No client records found</p>
                    <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                      {activeSearch ? `No matches for "${activeSearch}"` : 'Click "+ Record Client in Book" to log a client.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: SIMPLE QUICK ENTRY FORM ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)] font-editorial">
                  {editingClient ? 'Edit Client Record' : 'Record Client in Digital Book'}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {editingClient ? 'Update client and rental details' : 'Enter walk-in client details to record in the book'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Paul Nkurunziza"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">
                    Telephone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0788 554 433"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">
                    National ID / Passport Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 1988 8 0039281 0 45"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full px-3 py-2.5 font-mono bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                  <span className="text-[0.65rem] text-[var(--text-subtle)] block mt-0.5">National ID (16 digits) or Passport</span>
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">
                  Outfit / Pieces Taken *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ivory Peak Tuxedo (40R) + Bowtie"
                  value={itemsTaken}
                  onChange={e => setItemsTaken(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">
                    Return Due Date
                  </label>
                  <input
                    type="date"
                    value={returnDue}
                    onChange={e => setReturnDue(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] uppercase font-bold text-[var(--text-muted)] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
                  >
                    <option value="active_rental">Out on Rental</option>
                    <option value="returned">Returned</option>
                    <option value="inquiry">Fitting / Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)]">
                <Clock size={15} className="text-[var(--gold-text)] flex-shrink-0" />
                <span>Date &amp; Time is <strong>automatically logged by the system</strong> when saved.</span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold flex-1"
                >
                  {editingClient ? 'Update Entry' : 'Save to Client Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CLIENT DOSSIER VIEW ─── */}
      {selectedClientView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedClientView(null)}>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)] font-editorial">
                  Client Book Entry
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Logged on {new Date(selectedClientView.recorded_at || selectedClientView.created_at || Date.now()).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedClientView(null)}
                className="p-1 rounded-lg hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[var(--bg-surface-subtle)]/70 rounded-xl p-4 border border-[var(--border-color)] space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Client Full Name</span>
                <span className="text-base font-bold text-[var(--text-main)] font-editorial block mt-0.5">{selectedClientView.full_name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]/50">
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Telephone</span>
                  <a href={`tel:${selectedClientView.phone_number}`} className="font-bold text-[var(--gold-text)] hover:underline block mt-0.5">
                    {selectedClientView.phone_number}
                  </a>
                </div>
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">National ID / Passport</span>
                  <span className="font-mono font-bold text-[var(--text-main)] block mt-0.5">{selectedClientView.id_number}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)]/50">
                <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Outfit Taken</span>
                <span className="font-semibold text-[var(--text-main)] block mt-0.5">{selectedClientView.items_taken}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]/50">
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Return Due Date</span>
                  <span className="font-medium text-xs block mt-0.5">
                    {selectedClientView.return_due || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-subtle)] block">Current Status</span>
                  <span className="font-bold uppercase text-[0.7rem] block mt-0.5 text-blue-600">
                    {selectedClientView.status === 'active_rental' ? 'Out on Rental' : selectedClientView.status === 'returned' ? 'Returned' : 'Fitting'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => setSelectedClientView(null)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const toEdit = selectedClientView
                  setSelectedClientView(null)
                  handleOpenEdit(toEdit)
                }}
                className="btn-secondary flex-1 flex items-center justify-center gap-1"
              >
                <Edit size={14} /> Edit Entry
              </button>
              <button
                onClick={() => window.print()}
                className="btn-gold flex-1 flex items-center justify-center gap-1"
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
