import React, { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

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
  getList: (id: string) => List | undefined
  createList: (title: string) => List
  updateList: (id: string, updates: Partial<Omit<List, 'id'>>) => void
  deleteList: (id: string) => void
  addItem: (listId: string, text: string) => void
  updateItem: (listId: string, itemId: string, text: string) => void
  removeItem: (listId: string, itemId: string) => void
  reorderItems: (listId: string, startIndex: number, endIndex: number) => void
  archiveList: (id: string) => void
  unarchiveList: (id: string) => void
  getRandomItem: (listId: string) => ListItem | null
}

const ListsContext = createContext<ListsContextType | undefined>(undefined)

export const ListsProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { user, isGuest } = useAuth()
  const [lists, setLists] = useState<List[]>([])

  // Load lists from localStorage on mount
  useEffect(() => {
    const storageKey = user
      ? `lists_${user.id}`
      : isGuest
        ? 'lists_guest'
        : null

    if (storageKey) {
      const savedLists = localStorage.getItem(storageKey)
      if (savedLists) {
        setLists(JSON.parse(savedLists))
      } else if (isGuest || user) {
        // Create sample list for new users
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
  }, [user, isGuest])

  // Save lists to localStorage whenever they change
  useEffect(() => {
    if (!lists.length) return

    const storageKey = user
      ? `lists_${user.id}`
      : isGuest
        ? 'lists_guest'
        : null

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(lists))
    }
  }, [lists, user, isGuest])

  const getList = (id: string) => {
    return lists.find((list) => list.id === id)
  }

  const createList = (title: string) => {
    const newList: List = {
      id: `list_${Date.now()}`,
      title,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
    }
    setLists((prev) => [...prev, newList])
    return newList
  }

  const updateList = (id: string, updates: Partial<Omit<List, 'id'>>) => {
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

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id))
  }

  const addItem = (listId: string, text: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: [
              ...list.items,
              {
                id: `item_${Date.now()}`,
                text,
                createdAt: Date.now(),
              },
            ],
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const updateItem = (listId: string, itemId: string, text: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    text,
                  }
                : item,
            ),
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const removeItem = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
            updatedAt: Date.now(),
          }
        }
        return list
      }),
    )
  }

  const reorderItems = (
    listId: string,
    startIndex: number,
    endIndex: number,
  ) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          const newItems = Array.from(list.items)
          const [removed] = newItems.splice(startIndex, 1)
          newItems.splice(endIndex, 0, removed)
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

  const archiveList = (id: string) => {
    updateList(id, {
      isArchived: true,
    })
  }

  const unarchiveList = (id: string) => {
    updateList(id, {
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