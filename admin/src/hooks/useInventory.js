import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useInventory – Supabase-backed inventory management.
 *
 * Strategy: **Optimistic updates** — local state is mutated immediately after
 * each write so the admin UI feels instant with no refresh needed.
 * The Realtime subscription is kept as a safety net to pick up changes
 * made from other clients (e.g. the website, another admin tab).
 */
export function useInventory() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  // ── Fetch all inventory items ────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchErr } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchErr) {
      console.error('useInventory fetchItems error:', fetchErr)
      setError(fetchErr.message)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }, [])

  // ── Initial fetch + realtime subscription (safety net) ───────────────────
  useEffect(() => {
    fetchItems()

    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        fetchItems()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchItems])

  // ── Add new item — optimistic insert ─────────────────────────────────────
  const addItem = async (itemData) => {
    const { id, ...data } = itemData // strip any temp id
    const { data: inserted, error: insertErr } = await supabase
      .from('inventory')
      .insert(data)
      .select()
      .single()

    if (insertErr) throw insertErr

    // Immediately prepend to local state
    setItems(prev => [inserted, ...prev])
    return inserted
  }

  // ── Update existing item — optimistic update ──────────────────────────────
  const updateItem = async (id, itemData) => {
    const { data: updated, error: updateErr } = await supabase
      .from('inventory')
      .update({ ...itemData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateErr) throw updateErr

    // Immediately replace the item in local state
    setItems(prev => prev.map(i => (String(i.id) === String(id) ? updated : i)))
    return updated
  }

  // ── Delete item — optimistic remove ──────────────────────────────────────
  const deleteItem = async (id) => {
    const { error: deleteErr } = await supabase.from('inventory').delete().eq('id', id)
    if (deleteErr) throw deleteErr

    // Immediately remove from local state
    setItems(prev => prev.filter(i => String(i.id) !== String(id)))
  }

  return { items, loading, error, addItem, updateItem, deleteItem, refetch: fetchItems }
}
