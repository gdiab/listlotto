import React, { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

export interface ListItem {
  id: string
  text: string
  createdAt: number
}

export interface List {
  id: string
  title: string
  items: ListItem[]
  createdAt: number
  updatedAt: number
  isArchived: boolean
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
              isArchived: row.is_archived
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
    const newList: List = {
      id: `list_${Date.now()}`,
      title,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
    }

    if (user && !isGuest) {
      // Debug authentication state
      console.log('Creating list for user:', user)
      console.log('User ID:', user.id)
      
      // Check current auth session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session user ID:', session?.user?.id)
      console.log('Session matches user:', session?.user?.id === user.id)

      // Save to Supabase for authenticated users
      const { data, error } = await supabase
        .from('lists')
        .insert({
          user_id: user.id,
          title,
          items: [],
          is_archived: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating list:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data) {
        const createdList: List = {
          id: data.id,
          title: data.title,
          items: data.items || [],
          createdAt: new Date(data.created_at).getTime(),
          updatedAt: new Date(data.updated_at).getTime(),
          isArchived: data.is_archived
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
      const supabaseUpdates: any = {
        updated_at: new Date().toISOString()
      }
      
      if (updates.title) supabaseUpdates.title = updates.title
      if (updates.items !== undefined) supabaseUpdates.items = updates.items
      if (updates.isArchived !== undefined) supabaseUpdates.is_archived = updates.isArchived

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
    })
  }

  const unarchiveList = async (id: string) => {
    await updateList(id, {
      isArchived: false,
    })
  }

  const getRandomItem = (listId: string) => {
    const list = getList(listId)
    if (!list || list.items.length === 0) return null
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