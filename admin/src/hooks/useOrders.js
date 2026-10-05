import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useOrders – Supabase-backed orders management.
 *
 * Strategy: **Optimistic updates** — local state is mutated immediately after
 * each write so the admin UI feels instant with no refresh needed.
 * The Realtime subscription picks up changes from other sources
 * (e.g. new orders submitted from the website).
 *
 * Business logic:
 *  - confirmed / delivered  → inventory items set to 'rented'   (hidden from website)
 *  - completed  / cancelled → inventory items set to 'available' (back on website)
 */
export function useOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ── Fetch all orders ─────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchErr) {
      console.error('useOrders fetchOrders error:', fetchErr)
      setError(fetchErr.message)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }, [])

  // ── Initial fetch + realtime subscription (safety net) ───────────────────
  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchOrders])

  // ── Sync inventory items when order status changes ───────────────────────
  const syncInventoryForOrder = async (order, newStatus) => {
    if (!order?.items?.length) return

    const itemIds = order.items.map(i => i.item_id).filter(Boolean)
    if (!itemIds.length) return

    let targetStatus = null
    if (newStatus === 'confirmed' || newStatus === 'delivered') {
      targetStatus = 'rented'
    } else if (newStatus === 'completed' || newStatus === 'cancelled') {
      targetStatus = 'available'
    }

    if (!targetStatus) return

    const { error: syncErr } = await supabase
      .from('inventory')
      .update({ status: targetStatus, updated_at: new Date().toISOString() })
      .in('id', itemIds)

    if (syncErr) {
      console.error('syncInventoryForOrder error:', syncErr)
      throw syncErr
    }
  }

  // ── Add new order — optimistic insert ────────────────────────────────────
  const addOrder = async (orderData) => {
    const { id, ...data } = orderData
    const { data: inserted, error: insertErr } = await supabase
      .from('orders')
      .insert(data)
      .select()
      .single()

    if (insertErr) throw insertErr

    // Immediately prepend to local state
    setOrders(prev => [inserted, ...prev])
    return inserted
  }

  // ── Update order status — optimistic update + inventory sync ─────────────
  const updateOrderStatus = async (orderId, newStatus) => {
    // Get the full order from local cache for inventory sync
    const order = orders.find(o => String(o.id) === String(orderId))

    const { data: updated, error: updateErr } = await supabase
      .from('orders')
      .update({ order_status: newStatus })
      .eq('id', orderId)
      .select()
      .single()

    if (updateErr) throw updateErr

    // Immediately update local order state
    setOrders(prev =>
      prev.map(o => (String(o.id) === String(orderId) ? { ...o, order_status: newStatus } : o))
    )

    // Sync inventory items (non-blocking)
    syncInventoryForOrder(order, newStatus).catch(e =>
      console.error('Non-fatal inventory sync error:', e)
    )

    return updated
  }

  // ── Full order update ────────────────────────────────────────────────────
  const updateOrder = async (orderId, fields) => {
    const { data: updated, error: updateErr } = await supabase
      .from('orders')
      .update(fields)
      .eq('id', orderId)
      .select()
      .single()

    if (updateErr) throw updateErr

    // Immediately update local state
    setOrders(prev =>
      prev.map(o => (String(o.id) === String(orderId) ? { ...o, ...updated } : o))
    )
    return updated
  }

  // ── Delete order — optimistic remove ─────────────────────────────────────
  const deleteOrder = async (orderId) => {
    const { error: deleteErr } = await supabase.from('orders').delete().eq('id', orderId)
    if (deleteErr) throw deleteErr

    // Immediately remove from local state
    setOrders(prev => prev.filter(o => String(o.id) !== String(orderId)))
  }

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders,
  }
}
