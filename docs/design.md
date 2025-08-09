Use this as a guide for designing FE


```index.tsx
import './index.css'
import React from "react";
import { render } from "react-dom";
import { App } from "./App";

render(<App />, document.getElementById("root"));

```
```App.tsx
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ListsProvider } from './context/ListsContext'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import ListDetail from './pages/ListDetail'
import RandomizerView from './pages/RandomizerView'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Header from './components/Header'
export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ListsProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Header />
              <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/list/:id" element={<ListDetail />} />
                  <Route path="/randomize/:id" element={<RandomizerView />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ListsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

```
```tailwind.config.js
export default {}
```
```index.css
/* PLEASE NOTE: THESE TAILWIND IMPORTS SHOULD NEVER BE DELETED */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
/* DO NOT DELETE THESE TAILWIND IMPORTS, OTHERWISE THE STYLING WILL NOT RENDER AT ALL */
```
```context/ThemeContext.tsx
import React, { useEffect, useState, createContext, useContext } from 'react'
type Theme = 'light' | 'dark'
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export const ThemeProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })
  useEffect(() => {
    // Update document with theme class
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

```
```context/AuthContext.tsx
import React, { useEffect, useState, createContext, useContext } from 'react'
export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
}
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isGuest: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  continueAsGuest: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user')
      const guestMode = localStorage.getItem('guestMode')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      if (guestMode === 'true') {
        setIsGuest(true)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])
  const login = async () => {
    // For MVP, simulate Google login
    setIsLoading(true)
    try {
      // Mock user data
      const mockUser: User = {
        id: 'user123',
        name: 'Demo User',
        email: 'demo@example.com',
        photoUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
      }
      setUser(mockUser)
      setIsGuest(false)
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.removeItem('guestMode')
    } catch (error) {
      console.error('Login failed', error)
    } finally {
      setIsLoading(false)
    }
  }
  const logout = async () => {
    setIsLoading(true)
    try {
      setUser(null)
      setIsGuest(false)
      localStorage.removeItem('user')
      localStorage.removeItem('guestMode')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setIsLoading(false)
    }
  }
  const continueAsGuest = () => {
    setIsGuest(true)
    localStorage.setItem('guestMode', 'true')
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        login,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

```
```context/ListsContext.tsx
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

```
```components/Header.tsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import {
  MenuIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  SettingsIcon,
} from 'lucide-react'
const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, isGuest, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                ListLotto
              </span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/' ? 'border-indigo-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/settings' ? 'border-indigo-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}`}
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {theme === 'dark' ? (
                <SunIcon size={20} />
              ) : (
                <MoonIcon size={20} />
              )}
            </button>
            {user ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                  {user.photoUrl ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.photoUrl}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <UserIcon
                        size={16}
                        className="text-indigo-600 dark:text-indigo-300"
                      />
                    </div>
                  )}
                  <button
                    onClick={logout}
                    className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : isGuest ? (
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Sign in
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Sign in
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {theme === 'dark' ? (
                <SunIcon size={20} />
              ) : (
                <MoonIcon size={20} />
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === '/' ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:bg-gray-700 dark:text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === '/settings' ? 'border-indigo-500 text-indigo-700 bg-indigo-50 dark:bg-gray-700 dark:text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  {user.photoUrl ? (
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.photoUrl}
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <UserIcon
                        size={20}
                        className="text-indigo-600 dark:text-indigo-300"
                      />
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 w-full text-left"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4">
                <Link
                  to="/login"
                  className="block text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
export default Header

```
```components/ListCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { List } from '../context/ListsContext'
import {
  ArrowRightIcon,
  ArchiveIcon,
  TrashIcon,
  EditIcon,
  ShuffleIcon,
} from 'lucide-react'
interface ListCardProps {
  list: List
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onDelete: (id: string) => void
}
const ListCard: React.FC<ListCardProps> = ({
  list,
  onArchive,
  onUnarchive,
  onDelete,
}) => {
  const formattedDate = new Date(list.updatedAt).toLocaleDateString()
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${list.isArchived ? 'opacity-70' : ''}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
            {list.title}
          </h3>
          <div className="flex space-x-2">
            {list.isArchived ? (
              <button
                onClick={() => onUnarchive(list.id)}
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                aria-label="Unarchive list"
              >
                <ArchiveIcon size={18} />
              </button>
            ) : (
              <button
                onClick={() => onArchive(list.id)}
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                aria-label="Archive list"
              >
                <ArchiveIcon size={18} />
              </button>
            )}
            <button
              onClick={() => onDelete(list.id)}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              aria-label="Delete list"
            >
              <TrashIcon size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Updated: {formattedDate} • {list.items.length} items
        </p>
        <div className="max-h-24 overflow-hidden mb-4">
          <ul className="text-sm text-gray-600 dark:text-gray-300">
            {list.items.slice(0, 3).map((item) => (
              <li key={item.id} className="truncate">
                {item.text}
              </li>
            ))}
            {list.items.length > 3 && (
              <li className="text-gray-400 dark:text-gray-500">
                +{list.items.length - 3} more...
              </li>
            )}
          </ul>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={`/list/${list.id}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <EditIcon size={16} className="mr-1" />
            Edit List
          </Link>
          {list.items.length > 0 && (
            <Link
              to={`/randomize/${list.id}`}
              className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              <ShuffleIcon size={16} className="mr-1" />
              Randomize
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
export default ListCard

```
```components/EmptyState.tsx
import React from 'react'
import { ListIcon } from 'lucide-react'
interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
        <ListIcon size={32} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}
export default EmptyState

```
```pages/Dashboard.tsx
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLists } from '../context/ListsContext'
import { useAuth } from '../context/AuthContext'
import ListCard from '../components/ListCard'
import EmptyState from '../components/EmptyState'
import { PlusIcon, SearchIcon, ArchiveIcon, ListIcon } from 'lucide-react'
const Dashboard = () => {
  const { lists, createList, deleteList, archiveList, unarchiveList } =
    useLists()
  const { user, isGuest } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const filteredLists = useMemo(() => {
    return lists.filter((list) => {
      // Filter by search query
      const matchesSearch =
        list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.items.some((item) =>
          item.text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      // Filter by archived status
      const matchesArchiveFilter = showArchived
        ? list.isArchived
        : !list.isArchived
      return matchesSearch && matchesArchiveFilter
    })
  }, [lists, searchQuery, showArchived])
  const handleCreateList = () => {
    if (newListTitle.trim()) {
      const newList = createList(newListTitle.trim())
      setNewListTitle('')
      setIsCreating(false)
      // Navigate to the new list
      window.location.href = `/list/${newList.id}`
    }
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Lists
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user
              ? `Welcome back, ${user.name}`
              : isGuest
                ? 'Guest Mode'
                : 'Welcome to ListLotto'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${showArchived ? 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          >
            <ArchiveIcon size={16} className="mr-2" />
            {showArchived ? 'Viewing Archived' : 'Show Archived'}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <PlusIcon size={16} className="mr-2" />
            Create New List
          </button>
        </div>
      </div>
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lists..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {/* Create new list dialog */}
      {isCreating && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create New List
            </h3>
            <div className="mb-4">
              <label
                htmlFor="list-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                List Title
              </label>
              <input
                type="text"
                id="list-title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white sm:text-sm"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setNewListTitle('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateList}
                disabled={!newListTitle.trim()}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${newListTitle.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-400 cursor-not-allowed'}`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lists grid */}
      {filteredLists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onArchive={archiveList}
              onUnarchive={unarchiveList}
              onDelete={deleteList}
            />
          ))}
        </div>
      ) : lists.length > 0 ? (
        <EmptyState
          title="No lists found"
          description={
            searchQuery
              ? "We couldn't find any lists matching your search."
              : showArchived
                ? "You don't have any archived lists."
                : "You don't have any active lists."
          }
          actionLabel={
            searchQuery
              ? 'Clear search'
              : showArchived
                ? 'View active lists'
                : 'Create a list'
          }
          onAction={() => {
            if (searchQuery) setSearchQuery('')
            else if (showArchived) setShowArchived(false)
            else setIsCreating(true)
          }}
        />
      ) : (
        <EmptyState
          title="Welcome to ListLotto!"
          description="Create your first list to get started with random selections."
          actionLabel="Create your first list"
          onAction={() => setIsCreating(true)}
        />
      )}
    </div>
  )
}
export default Dashboard

```
```pages/ListDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLists, ListItem } from '../context/ListsContext'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  PlusIcon,
  XIcon,
  GripIcon,
  ChevronLeftIcon,
  ShuffleIcon,
} from 'lucide-react'
const ListDetail = () => {
  const { id } = useParams<{
    id: string
  }>()
  const navigate = useNavigate()
  const { getList, updateList, addItem, updateItem, removeItem, reorderItems } =
    useLists()
  const list = getList(id || '')
  const [title, setTitle] = useState('')
  const [newItemText, setNewItemText] = useState('')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItemText, setEditingItemText] = useState('')
  useEffect(() => {
    if (list) {
      setTitle(list.title)
    } else {
      // List not found, redirect to dashboard
      navigate('/')
    }
  }, [list, navigate])
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleTitleBlur = () => {
    if (list && title.trim() !== list.title) {
      updateList(list.id, {
        title: title.trim() || 'Untitled List',
      })
    }
  }
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (list && newItemText.trim()) {
      addItem(list.id, newItemText.trim())
      setNewItemText('')
    }
  }
  const handleEditItem = (item: ListItem) => {
    setEditingItemId(item.id)
    setEditingItemText(item.text)
  }
  const handleSaveEdit = () => {
    if (list && editingItemId && editingItemText.trim()) {
      updateItem(list.id, editingItemId, editingItemText.trim())
    }
    setEditingItemId(null)
    setEditingItemText('')
  }
  const handleCancelEdit = () => {
    setEditingItemId(null)
    setEditingItemText('')
  }
  const handleDragEnd = (result: any) => {
    if (!result.destination || !list) return
    reorderItems(list.id, result.source.index, result.destination.index)
  }
  if (!list) return null
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ChevronLeftIcon size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-500 dark:hover:border-gray-600 dark:focus:border-indigo-500 focus:outline-none w-full"
            placeholder="List Title"
          />
        </div>
        {list.items.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Items
              </h3>
              {list.items.length > 1 && (
                <Link
                  to={`/randomize/${list.id}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <ShuffleIcon size={16} className="mr-1" />
                  Randomize
                </Link>
              )}
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="items">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {list.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-gray-50 dark:bg-gray-700 rounded-md"
                          >
                            {editingItemId === item.id ? (
                              <div className="flex items-center p-3">
                                <input
                                  type="text"
                                  value={editingItemText}
                                  onChange={(e) =>
                                    setEditingItemText(e.target.value)
                                  }
                                  className="flex-1 px-3 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit()
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                />
                                <div className="ml-2 flex space-x-1">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center p-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 cursor-move"
                                >
                                  <GripIcon
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </div>
                                <span className="flex-1 text-gray-900 dark:text-white">
                                  {item.text}
                                </span>
                                <div className="ml-2 flex space-x-1">
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => removeItem(list.id, item.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                  >
                                    <XIcon size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        <form onSubmit={handleAddItem} className="mt-6">
          <div className="flex">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add a new item..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${newItemText.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-400 cursor-not-allowed'}`}
            >
              <PlusIcon size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ListDetail

```
```pages/RandomizerView.tsx
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLists, ListItem } from '../context/ListsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, EditIcon } from 'lucide-react'
import confetti from 'canvas-confetti'
const RandomizerView = () => {
  const { id } = useParams<{
    id: string
  }>()
  const navigate = useNavigate()
  const { getList } = useLists()
  const list = getList(id || '')
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)
  const [shufflingItems, setShufflingItems] = useState<ListItem[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!list || list.items.length === 0) {
      navigate('/')
    } else {
      setShufflingItems(list.items)
    }
  }, [list, navigate])
  const triggerConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      })
    }
  }
  const startSelection = () => {
    if (isSelecting || !list || list.items.length === 0) return
    setIsSelecting(true)
    setSelectedItem(null)
    setShowCelebration(false)
    // Shuffle animation
    let shuffleCount = 0
    const totalShuffles = 20 + Math.floor(Math.random() * 10) // Random number of shuffles
    const minDuration = 50
    const maxDuration = 300
    const shuffle = () => {
      const randomIndex = Math.floor(Math.random() * list.items.length)
      const currentItem = list.items[randomIndex]
      setShufflingItems((prev) => [
        ...prev.filter((item) => item.id !== currentItem.id),
        currentItem,
      ])
      shuffleCount++
      if (shuffleCount < totalShuffles) {
        // Gradually slow down the shuffling
        const progress = shuffleCount / totalShuffles
        const duration = minDuration + (maxDuration - minDuration) * progress
        setTimeout(shuffle, duration)
      } else {
        // Selection complete
        setSelectedItem(currentItem)
        setIsSelecting(false)
        setShowCelebration(true)
        setTimeout(triggerConfetti, 300)
      }
    }
    shuffle()
  }
  if (!list) return null
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/list/${list.id}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ChevronLeftIcon size={16} className="mr-1" />
          Back to List
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {list.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {list.items.length} items • Click the button to randomly select an
            item
          </p>
        </div>
        <div className="flex justify-center mb-10">
          <div
            ref={confettiRef}
            className="relative w-full max-w-md h-60 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence>
              {selectedItem ? (
                <motion.div
                  key="selected"
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  className={`text-center p-6 ${showCelebration ? 'animate-pulse' : ''}`}
                >
                  <div className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {selectedItem.text}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Your randomly selected item
                  </div>
                </motion.div>
              ) : isSelecting ? (
                <motion.div key="shuffling" className="text-center p-6">
                  <div className="text-xl font-medium text-gray-900 dark:text-white animate-bounce">
                    {shufflingItems[shufflingItems.length - 1]?.text || '...'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Selecting...
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" className="text-center p-6">
                  <div className="text-xl font-medium text-gray-400 dark:text-gray-500">
                    Click the button below to start
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={startSelection}
            disabled={isSelecting}
            className={`px-6 py-3 rounded-md text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${isSelecting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {selectedItem ? 'Pick Again' : 'Choose For Me'}
          </button>
          <Link
            to={`/list/${list.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <EditIcon size={16} className="mr-2" />
            Edit List
          </Link>
        </div>
      </div>
    </div>
  )
}
export default RandomizerView

```
```pages/Settings.tsx
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon, LogOutIcon, UserIcon } from 'lucide-react'
const Settings = () => {
  const { user, isGuest, login, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Account Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account
          </h2>
          {user ? (
            <div className="flex items-center">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="h-12 w-12 rounded-full mr-4"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                  <UserIcon
                    size={24}
                    className="text-indigo-600 dark:text-indigo-300"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                <LogOutIcon size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          ) : isGuest ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-gray-900 dark:text-white">
                  You're using ListLotto as a guest
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your lists are stored locally on this device only
                </p>
              </div>
              <button
                onClick={login}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-md font-medium text-gray-900 dark:text-white">
                Sign in to save your lists
              </p>
              <button
                onClick={login}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Sign In with Google
              </button>
            </div>
          )}
        </div>
        {/* Appearance Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-md font-medium text-gray-900 dark:text-white">
                Theme
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {theme === 'dark'
                  ? 'Dark mode is enabled'
                  : 'Light mode is enabled'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              {theme === 'dark' ? (
                <>
                  <SunIcon size={16} className="mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <MoonIcon size={16} className="mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
        {/* About Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">ListLotto v2.0</p>
            <p>
              A modern, responsive web application that allows you to create,
              manage, and save lists of items, with a unique feature that
              randomly selects items from lists with an engaging, theatrical
              presentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Settings

```
```pages/Login.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogInIcon, UserIcon } from 'lucide-react'
const Login = () => {
  const { login, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const handleLogin = async () => {
    await login()
    navigate('/')
  }
  const handleGuestMode = () => {
    continueAsGuest()
    navigate('/')
  }
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to ListLotto
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          The fun and easy way to make random selections
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <LogInIcon
                size={28}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Save your lists and access them from any device
            </p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <LogInIcon size={18} className="mr-2" />
            Sign in with Google
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>
          <button
            onClick={handleGuestMode}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <UserIcon size={18} className="mr-2" />
            Continue as Guest
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Guest data is stored locally on this device only
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login

```