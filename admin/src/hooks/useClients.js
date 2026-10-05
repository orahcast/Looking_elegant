import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useClients – Supabase-backed client book management.
 *
 * Strategy: **Optimistic updates** — local state is mutated immediately after
 * each write so the admin UI feels instant with no refresh needed.
 * The Realtime subscription is kept as a safety net for cross-client sync.
 */
export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ── Fetch all clients ────────────────────────────────────────────────────
  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchErr } = await supabase
      .from('clients')
      .select('*')
      .order('recorded_at', { ascending: false })

    if (fetchErr) {
      console.error('useClients fetchClients error:', fetchErr)
      setError(fetchErr.message)
    } else {
      setClients(data || [])
    }
    setLoading(false)
  }, [])

  // ── Initial fetch + realtime subscription (safety net) ───────────────────
  useEffect(() => {
    fetchClients()

    const channel = supabase
      .channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        fetchClients()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchClients])

  // ── Add new client — optimistic insert ───────────────────────────────────
  const addClient = async (clientData) => {
    const { id, ...data } = clientData
    const { data: inserted, error: insertErr } = await supabase
      .from('clients')
      .insert(data)
      .select()
      .single()

    if (insertErr) throw insertErr

    // Immediately prepend to local state
    setClients(prev => [inserted, ...prev])
    return inserted
  }

  // ── Update client — optimistic update ────────────────────────────────────
  const updateClient = async (clientId, updatedFields) => {
    const { data: updated, error: updateErr } = await supabase
      .from('clients')
      .update(updatedFields)
      .eq('id', clientId)
      .select()
      .single()

    if (updateErr) throw updateErr

    // Immediately update local state
    setClients(prev =>
      prev.map(c => (String(c.id) === String(clientId) ? { ...c, ...updated } : c))
    )
    return updated
  }

  // ── Delete client — optimistic remove ────────────────────────────────────
  const deleteClient = async (clientId) => {
    const { error: deleteErr } = await supabase.from('clients').delete().eq('id', clientId)
    if (deleteErr) throw deleteErr

    // Immediately remove from local state
    setClients(prev => prev.filter(c => String(c.id) !== String(clientId)))
  }

  return { clients, loading, error, addClient, updateClient, deleteClient, refetch: fetchClients }
}
