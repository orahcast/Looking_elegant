import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useInventory (website) – fetches only 'available' items from Supabase
 * for display on the public collection page.
 */
export function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('useInventory (website) error:', error)
        setError(error.message)
      } else {
        setItems(data || [])
      }
      setLoading(false)
    }

    fetchItems()

    // Subscribe to realtime changes so the collection updates if admin
    // marks an item available/rented without the user needing to refresh
    const channel = supabase
      .channel('public-inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        fetchItems()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { items, loading, error }
}
