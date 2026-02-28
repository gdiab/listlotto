import React, { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

export interface ListItem {
  id: string
  text: string
  createdAt: number
  weight?: number // Default is 1 when undefined
}

export interface List {
  id: string
  title: string
  items: ListItem[]
  createdAt: number
  updatedAt: number
  isArchived: boolean
  useWeights?: boolean // When true, item weights affect randomization
  archivedAt?: number | null
  sortOrder?: number | null
}

interface ListsContextType {
  lists: List[]
  isLoading: boolean
  getList: (id: string) => List | undefined
  createList: (title: string) => Promise<List>
  updateList: (id: string, updates: Partial<Omit<List, 'id'>>) => Promise<void>
  deleteList: (id: string) => Promise<void>
  addItem: (listId: string, text: string) => Promise<void>
  updateItem: (listId: string, itemId: string, text: string) => Promise<void>
  removeItem: (listId: string, itemId: string) => Promise<void>
  reorderItems: (listId: string, startIndex: number, endIndex: number) => Promise<void>
  archiveList: (id: string) => Promise<void>
  unarchiveList: (id: string) => Promise<void>
  getRandomItem: (listId: string) => ListItem | null
  reorderLists: (orderedActiveListIds: string[]) => Promise<void>
  // Weight management
  updateItemWeight: (listId: string, itemId: string, weight: number) => Promise<void>
  toggleUseWeights: (listId: string) => Promise<void>
  resetWeights: (listId: string) => Promise<void>
}

const ListsContext = createContext<ListsContextType | undefined>(undefined)

export const ListsProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { user, isGuest } = useAuth()
  const [lists, setLists] = useState<List[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load lists from database or localStorage
  useEffect(() => {
    const loadLists = async () => {
      setIsLoading(true)
      try {
        if (user && !isGuest) {
          // Load from Supabase for authenticated users
          const { data, error } = await supabase
            .from('lists')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error loading lists:', error)
            return
          }

          if (data) {
            // Convert Supabase format to our List interface
            const convertedLists: List[] = data.map((row) => ({
              id: row.id,
              title: row.title,
              items: row.items || [],
              createdAt: new Date(row.created_at).getTime(),
              updatedAt: new Date(row.updated_at).getTime(),
              isArchived: row.is_archived,
              useWeights: row.use_weights ?? false,
              archivedAt: row.archived_at ? new Date(row.archived_at).getTime() : null,
              sortOrder: row.sort_order ?? null
            }))
            setLists(convertedLists)
          }
        } else if (isGuest) {
          // Load from localStorage for guests
          const savedLists = localStorage.getItem('lists_guest')
          if (savedLists) {
            setLists(JSON.parse(savedLists))
          } else {
            // Create sample list for new guests
            const sampleList: List = {
              id: 'sample-list',
              title: 'Places to Eat',
              items: [
                {
                  id: 'item1',
                  text: 'Pizza Palace',
                  createdAt: Date.now(),
                },
                {
                  id: 'item2',
                  text: 'Burger Bistro',
                  createdAt: Date.now(),
                },
                {
                  id: 'item3',
                  text: 'Taco Temple',
                  createdAt: Date.now(),
                },
                {
                  id: 'item4',
                  text: 'Sushi Spot',
                  createdAt: Date.now(),
                },
              ],
              createdAt: Date.now(),
              updatedAt: Date.now(),
              isArchived: false,
            }
            setLists([sampleList])
          }
        }
      } catch (error) {
        console.error('Error loading lists:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLists()
  }, [user, isGuest])

  // Save lists to localStorage for guests
  useEffect(() => {
    if (isGuest && lists.length > 0) {
      localStorage.setItem('lists_guest', JSON.stringify(lists))
    }
  }, [lists, isGuest])

  const getList = (id: string) => {
    return lists.find((list) => list.id === id)
  }

  const createList = async (title: string): Promise<List> => {
    // New lists go to top of custom order
    const activeLists = lists.filter(l => !l.isArchived)
    const minOrder = activeLists.reduce(
      (min, l) => (l.sortOrder != null && l.sortOrder < min ? l.sortOrder : min),
      0
    )

    const newList: List = {
      id: `list_${Date.now()}`,
      title,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
      useWeights: false,
      archivedAt: null,
      sortOrder: minOrder - 1,
    }

    if (user && !isGuest) {
      // Ensure user exists in public.users table (fallback for trigger failures)
      try {
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            name: user.name,
            avatar_url: user.photoUrl
          }, {
            onConflict: 'id'
          })

        if (upsertError) {
          console.error('Error ensuring user exists:', upsertError)
        }
      } catch (userError) {
        console.error('Failed to ensure user exists:', userError)
      }

      // Save to Supabase for authenticated users
      const { data, error } = await supabase
        .from('lists')
        .insert({
          user_id: user.id,
          title,
          items: [],
          is_archived: false,
          use_weights: false,
          archived_at: null,
          sort_order: minOrder - 1
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating list:', error)
        throw error
      }

      if (data) {
        const createdList: List = {
          id: data.id,
          title: data.title,
          items: data.items || [],
          createdAt: new Date(data.created_at).getTime(),
          updatedAt: new Date(data.updated_at).getTime(),
          isArchived: data.is_archived,
          useWeights: data.use_weights ?? false,
          archivedAt: data.archived_at ? new Date(data.archived_at).getTime() : null,
          sortOrder: data.sort_order ?? null
        }
        setLists((prev) => [createdList, ...prev])
        return createdList
      }
    } else {
      // Local storage for guests
      setLists((prev) => [newList, ...prev])
    }
    
    return newList
  }

  const updateList = async (id: string, updates: Partial<Omit<List, 'id'>>) => {
    if (user && !isGuest) {
      // Update in Supabase for authenticated users
      const supabaseUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      }

      if (updates.title) supabaseUpdates.title = updates.title
      if (updates.items !== undefined) supabaseUpdates.items = updates.items
      if (updates.isArchived !== undefined) supabaseUpdates.is_archived = updates.isArchived
      if (updates.useWeights !== undefined) supabaseUpdates.use_weights = updates.useWeights
      if ('archivedAt' in updates) {
        supabaseUpdates.archived_at = updates.archivedAt
          ? new Date(updates.archivedAt).toISOString()
          : null
      }
      if ('sortOrder' in updates) supabaseUpdates.sort_order = updates.sortOrder

      const { error } = await supabase
        .from('lists')
        .update(supabaseUpdates)
        .eq('id', id)

      if (error) {
        console.error('Error updating list:', error)
        throw error
      }
    }

    // Update local state
    setLists((prev) =>
      prev.map((list) =>
        list.id === id
          ? {
              ...list,
              ...updates,
              updatedAt: Date.now(),
            }
          : list,
      ),
    )
  }

  const deleteList = async (id: string) => {
    if (user && !isGuest) {
      // Delete from Supabase for authenticated users
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting list:', error)
        throw error
      }
    }

    // Update local state
    setLists((prev) => prev.filter((list) => list.id !== id))
  }

  const addItem = async (listId: string, text: string) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    const newItem: ListItem = {
      id: `item_${Date.now()}`,
      text,
      createdAt: Date.now(),
    }

    const updatedItems = [...targetList.items, newItem]

    if (user && !isGuest) {
      // Update in Supabase for authenticated users
      const { error } = await supabase
        .from('lists')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error adding item:', error)
        throw error
      }
    }

    // Update local state
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: updatedItems,
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const updateItem = async (listId: string, itemId: string, text: string) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    const updatedItems = targetList.items.map((item) =>
      item.id === itemId ? { ...item, text } : item
    )

    if (user && !isGuest) {
      // Update in Supabase for authenticated users
      const { error } = await supabase
        .from('lists')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error updating item:', error)
        throw error
      }
    }

    // Update local state
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: updatedItems,
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const removeItem = async (listId: string, itemId: string) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    const updatedItems = targetList.items.filter((item) => item.id !== itemId)

    if (user && !isGuest) {
      // Update in Supabase for authenticated users
      const { error } = await supabase
        .from('lists')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error removing item:', error)
        throw error
      }
    }

    // Update local state
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: updatedItems,
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const reorderItems = async (
    listId: string,
    startIndex: number,
    endIndex: number,
  ) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    const newItems = Array.from(targetList.items)
    const [removed] = newItems.splice(startIndex, 1)
    newItems.splice(endIndex, 0, removed)

    if (user && !isGuest) {
      // Update in Supabase for authenticated users
      const { error } = await supabase
        .from('lists')
        .update({ 
          items: newItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error reordering items:', error)
        throw error
      }
    }

    // Update local state
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: newItems,
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const archiveList = async (id: string) => {
    await updateList(id, {
      isArchived: true,
      archivedAt: Date.now(),
      sortOrder: null,
    })
  }

  const unarchiveList = async (id: string) => {
    // Place unarchived list at top of custom order
    const activeLists = lists.filter(l => !l.isArchived && l.id !== id)
    const minOrder = activeLists.reduce(
      (min, l) => (l.sortOrder != null && l.sortOrder < min ? l.sortOrder : min),
      0
    )
    await updateList(id, {
      isArchived: false,
      archivedAt: null,
      sortOrder: minOrder - 1,
    })
  }

  const reorderLists = async (orderedActiveListIds: string[]) => {
    // Optimistic local update: assign sortOrder based on position
    const orderMap = new Map(orderedActiveListIds.map((id, i) => [id, i]))

    setLists((prev) =>
      prev.map((list) => {
        const newOrder = orderMap.get(list.id)
        if (newOrder !== undefined) {
          return { ...list, sortOrder: newOrder }
        }
        return list
      })
    )

    if (user && !isGuest) {
      // Batch update sort_order for all active lists
      const updates = orderedActiveListIds.map((id, index) => ({
        id,
        sort_order: index,
        updated_at: new Date().toISOString(),
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('lists')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)

        if (error) {
          console.error('Error reordering list:', error)
        }
      }
    }
  }

  const updateItemWeight = async (listId: string, itemId: string, weight: number) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    // Ensure weight is at least 1
    const safeWeight = Math.max(1, Math.round(weight))

    const updatedItems = targetList.items.map((item) =>
      item.id === itemId ? { ...item, weight: safeWeight } : item
    )

    if (user && !isGuest) {
      const { error } = await supabase
        .from('lists')
        .update({
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error updating item weight:', error)
        throw error
      }
    }

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: updatedItems, updatedAt: Date.now() }
          : list
      )
    )
  }

  const toggleUseWeights = async (listId: string) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    const newUseWeights = !targetList.useWeights

    // When turning off weights, reset all items to weight 1
    let updatedItems = targetList.items
    if (!newUseWeights) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedItems = targetList.items.map(({ weight, ...rest }) => rest)
    }

    if (user && !isGuest) {
      const { error } = await supabase
        .from('lists')
        .update({
          use_weights: newUseWeights,
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error toggling use weights:', error)
        throw error
      }
    }

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, useWeights: newUseWeights, items: updatedItems, updatedAt: Date.now() }
          : list
      )
    )
  }

  const resetWeights = async (listId: string) => {
    const targetList = lists.find(list => list.id === listId)
    if (!targetList) return

    // Remove weight property from all items
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedItems = targetList.items.map(({ weight, ...rest }) => rest)

    if (user && !isGuest) {
      const { error } = await supabase
        .from('lists')
        .update({
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId)

      if (error) {
        console.error('Error resetting weights:', error)
        throw error
      }
    }

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: updatedItems, updatedAt: Date.now() }
          : list
      )
    )
  }

  const getRandomItem = (listId: string) => {
    const list = getList(listId)
    if (!list || list.items.length === 0) return null

    // Use weighted selection if enabled
    if (list.useWeights) {
      const totalWeight = list.items.reduce((sum, item) => sum + (item.weight ?? 1), 0)
      let random = Math.random() * totalWeight

      for (const item of list.items) {
        random -= item.weight ?? 1
        if (random <= 0) {
          return item
        }
      }
      // Fallback to last item (shouldn't happen, but just in case)
      return list.items[list.items.length - 1]
    }

    // Uniform distribution when weights disabled
    const randomIndex = Math.floor(Math.random() * list.items.length)
    return list.items[randomIndex]
  }

  return (
    <ListsContext.Provider
      value={{
        lists,
        isLoading,
        getList,
        createList,
        updateList,
        deleteList,
        addItem,
        updateItem,
        removeItem,
        reorderItems,
        archiveList,
        unarchiveList,
        getRandomItem,
        reorderLists,
        updateItemWeight,
        toggleUseWeights,
        resetWeights,
      }}
    >
      {children}
    </ListsContext.Provider>
  )
}

export const useLists = (): ListsContextType => {
  const context = useContext(ListsContext)
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider')
  }
  return context
}