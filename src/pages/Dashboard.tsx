import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLists, List } from '../context/ListsContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ListCard from '../components/lists/ListCard'
import ListRow from '../components/lists/ListRow'
import EmptyState from '../components/common/EmptyState'
import BulkOperations from '../components/lists/BulkOperations'
import ListTemplates from '../components/lists/ListTemplates'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import {
  restrictToParentElement,
} from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import {
  PlusIcon,
  SearchIcon,
  ArchiveIcon,
  UploadIcon,
  LayoutTemplateIcon,
  ChevronDownIcon,
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
} from 'lucide-react'

import type {
  ViewMode,
  ActiveSortMode,
  ArchivedSortMode,
  DashboardPreferences,
} from '../types'

const DEFAULT_PREFS: DashboardPreferences = {
  viewMode: 'card',
  activeSortMode: 'updated',
  archivedSortMode: 'archived_recent',
}

const GUEST_PREFS_KEY = 'dashboard_preferences_guest'

// --- Sortable wrappers ---

function SortableCardWrapper({
  list,
  onArchive,
  onUnarchive,
  onDelete,
  showReorderControls,
}: {
  list: List
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onDelete: (id: string) => void
  showReorderControls: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id, disabled: !showReorderControls })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 'auto' as const,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {showReorderControls && (
        <div
          {...listeners}
          className="absolute top-2 left-2 z-10 cursor-grab bg-white/80 dark:bg-gray-700/80 rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
          aria-label="Drag to reorder"
        >
          <ArrowUpDownIcon size={14} />
        </div>
      )}
      <ListCard
        list={list}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
      />
    </div>
  )
}

function SortableRowWrapper({
  list,
  onArchive,
  onUnarchive,
  onDelete,
  showReorderControls,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  list: List
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onDelete: (id: string) => void
  showReorderControls: boolean
  isFirst: boolean
  isLast: boolean
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id, disabled: !showReorderControls })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ListRow
        list={list}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
        showReorderControls={showReorderControls}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        dragHandleProps={showReorderControls ? listeners : undefined}
      />
    </div>
  )
}

// --- Main component ---

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { lists, createList, deleteList, archiveList, unarchiveList, addItem, reorderLists } =
    useLists()
  const { user, isGuest } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showCreateDropdown, setShowCreateDropdown] = useState(false)

  // Dashboard preferences
  const [prefs, setPrefs] = useState<DashboardPreferences>(DEFAULT_PREFS)
  const [prefsLoaded, setPrefsLoaded] = useState(false)

  // Load preferences
  useEffect(() => {
    const loadPrefs = async () => {
      if (user && !isGuest) {
        try {
          const { data } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', user.id)
            .single()

          if (data?.preferences) {
            const dbPrefs = (data.preferences as Record<string, unknown>)
              .dashboard as DashboardPreferences | undefined
            if (dbPrefs) {
              setPrefs({ ...DEFAULT_PREFS, ...dbPrefs })
            }
          }
        } catch (err) {
          console.error('Error loading preferences:', err)
        }
      } else if (isGuest) {
        try {
          const stored = localStorage.getItem(GUEST_PREFS_KEY)
          if (stored) {
            setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) })
          }
        } catch {
          // ignore malformed JSON
        }
      }
      setPrefsLoaded(true)
    }

    loadPrefs()
  }, [user, isGuest])

  // Save preferences
  const savePrefs = useCallback(
    async (newPrefs: DashboardPreferences) => {
      setPrefs(newPrefs)

      if (user && !isGuest) {
        try {
          // Read current preferences, merge dashboard key
          const { data } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', user.id)
            .single()

          const existing = (data?.preferences as Record<string, unknown>) ?? {}
          await supabase
            .from('users')
            .update({
              preferences: { ...existing, dashboard: newPrefs },
            })
            .eq('id', user.id)
        } catch (err) {
          console.error('Error saving preferences:', err)
        }
      } else if (isGuest) {
        localStorage.setItem(GUEST_PREFS_KEY, JSON.stringify(newPrefs))
      }
    },
    [user, isGuest],
  )

  const setViewMode = (mode: ViewMode) => savePrefs({ ...prefs, viewMode: mode })
  const setActiveSortMode = (mode: ActiveSortMode) =>
    savePrefs({ ...prefs, activeSortMode: mode })
  const setArchivedSortMode = (mode: ArchivedSortMode) =>
    savePrefs({ ...prefs, archivedSortMode: mode })

  // Sorting
  const sortLists = useCallback(
    (items: List[]): List[] => {
      const sorted = [...items]
      if (showArchived) {
        switch (prefs.archivedSortMode) {
          case 'archived_recent':
            sorted.sort((a, b) => {
              const aAt = a.archivedAt ?? a.updatedAt
              const bAt = b.archivedAt ?? b.updatedAt
              return bAt - aAt
            })
            break
          case 'updated':
            sorted.sort((a, b) => b.updatedAt - a.updatedAt)
            break
          case 'alpha':
            sorted.sort((a, b) =>
              a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
            )
            break
        }
      } else {
        switch (prefs.activeSortMode) {
          case 'updated':
            sorted.sort((a, b) => b.updatedAt - a.updatedAt)
            break
          case 'alpha':
            sorted.sort((a, b) =>
              a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
            )
            break
          case 'custom':
            sorted.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            break
        }
      }
      return sorted
    },
    [showArchived, prefs.activeSortMode, prefs.archivedSortMode],
  )

  const filteredLists = useMemo(() => {
    const filtered = lists.filter((list) => {
      const matchesSearch =
        list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.items.some((item) =>
          item.text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      const matchesArchiveFilter = showArchived
        ? list.isArchived
        : !list.isArchived
      return matchesSearch && matchesArchiveFilter
    })
    return sortLists(filtered)
  }, [lists, searchQuery, showArchived, sortLists])

  // Reorder controls gating
  const canReorder =
    !showArchived &&
    prefs.activeSortMode === 'custom' &&
    searchQuery === ''

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !canReorder) return

    const oldIndex = filteredLists.findIndex((l) => l.id === active.id)
    const newIndex = filteredLists.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(filteredLists, oldIndex, newIndex)
    reorderLists(reordered.map((l) => l.id))
  }

  const handleMoveUp = (id: string) => {
    const idx = filteredLists.findIndex((l) => l.id === id)
    if (idx <= 0) return
    const reordered = arrayMove(filteredLists, idx, idx - 1)
    reorderLists(reordered.map((l) => l.id))
  }

  const handleMoveDown = (id: string) => {
    const idx = filteredLists.findIndex((l) => l.id === id)
    if (idx === -1 || idx >= filteredLists.length - 1) return
    const reordered = arrayMove(filteredLists, idx, idx + 1)
    reorderLists(reordered.map((l) => l.id))
  }

  // Handlers
  const handleCreateList = async () => {
    if (newListTitle.trim()) {
      const newList = await createList(newListTitle.trim())
      setNewListTitle('')
      setIsCreating(false)
      navigate(`/list/${newList.id}`)
    }
  }

  const handleTemplateSelect = async (template: {
    name: string
    items: string[]
  }) => {
    const newList = await createList(template.name)
    for (const item of template.items) {
      await addItem(newList.id, item)
    }
    navigate(`/list/${newList.id}`)
  }

  const handleBulkImport = async (items: string[]) => {
    if (!newListTitle.trim()) {
      setNewListTitle('Imported List')
    }
    const newList = await createList(newListTitle.trim() || 'Imported List')
    for (const item of items) {
      await addItem(newList.id, item)
    }
    setNewListTitle('')
    setIsCreating(false)
    navigate(`/list/${newList.id}`)
  }

  // Sort option labels
  const activeSortOptions: { value: ActiveSortMode; label: string }[] = [
    { value: 'updated', label: 'Updated' },
    { value: 'alpha', label: 'A-Z' },
    { value: 'custom', label: 'Custom' },
  ]

  const archivedSortOptions: { value: ArchivedSortMode; label: string }[] = [
    { value: 'archived_recent', label: 'Recently Archived' },
    { value: 'updated', label: 'Updated' },
    { value: 'alpha', label: 'A-Z' },
  ]

  if (!prefsLoaded) return null

  // --- Render list content ---
  const renderListContent = () => {
    if (filteredLists.length === 0) {
      if (lists.length > 0) {
        return (
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
        )
      }
      return (
        <EmptyState
          title="Welcome to ListLotto!"
          description="Create your first list to get started with random selections."
          actionLabel="Create your first list"
          onAction={() => setIsCreating(true)}
        />
      )
    }

    const listIds = filteredLists.map((l) => l.id)

    if (prefs.viewMode === 'list') {
      // List view
      const rows = filteredLists.map((list, idx) => (
        <SortableRowWrapper
          key={list.id}
          list={list}
          onArchive={archiveList}
          onUnarchive={unarchiveList}
          onDelete={deleteList}
          showReorderControls={canReorder}
          isFirst={idx === 0}
          isLast={idx === filteredLists.length - 1}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      ))

      if (canReorder) {
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={listIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {rows}
              </div>
            </SortableContext>
          </DndContext>
        )
      }

      return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {rows}
        </div>
      )
    }

    // Card view
    const cards = filteredLists.map((list) => (
      <SortableCardWrapper
        key={list.id}
        list={list}
        onArchive={archiveList}
        onUnarchive={unarchiveList}
        onDelete={deleteList}
        showReorderControls={canReorder}
      />
    ))

    if (canReorder) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={listIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards}
            </div>
          </SortableContext>
        </DndContext>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards}
      </div>
    )
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
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              showArchived
                ? 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ArchiveIcon size={16} className="mr-2" />
            {showArchived ? 'Viewing Archived' : 'Show Archived'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              <PlusIcon size={16} className="mr-2" />
              Create List
              <ChevronDownIcon size={16} className="ml-1" />
            </button>

            {showCreateDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsCreating(true)
                    setShowCreateDropdown(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                >
                  <PlusIcon size={16} className="mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Empty List</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Start from scratch
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowTemplates(true)
                    setShowCreateDropdown(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                >
                  <LayoutTemplateIcon
                    size={16}
                    className="mr-3 text-gray-400"
                  />
                  <div>
                    <div className="font-medium">From Template</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Pre-made lists
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowBulkOperations(true)
                    setShowCreateDropdown(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center border-t border-gray-100 dark:border-gray-700"
                >
                  <UploadIcon size={16} className="mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Import Items</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Paste multiple items
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search + View toggle + Sort controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
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

        {/* Sort control */}
        <div className="flex items-center gap-2">
          <select
            value={
              showArchived ? prefs.archivedSortMode : prefs.activeSortMode
            }
            onChange={(e) => {
              if (showArchived) {
                setArchivedSortMode(e.target.value as ArchivedSortMode)
              } else {
                setActiveSortMode(e.target.value as ActiveSortMode)
              }
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Sort order"
          >
            {(showArchived ? archivedSortOptions : activeSortOptions).map(
              (opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ),
            )}
          </select>

          {/* View toggle */}
          <div className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 ${
                prefs.viewMode === 'card'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
              }`}
              aria-label="Card view"
              aria-pressed={prefs.viewMode === 'card'}
            >
              <LayoutGridIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                prefs.viewMode === 'list'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
              }`}
              aria-label="List view"
              aria-pressed={prefs.viewMode === 'list'}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Reorder hint */}
      {!showArchived &&
        prefs.activeSortMode === 'custom' &&
        searchQuery !== '' && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
            Clear your search to drag-and-drop reorder lists.
          </p>
        )}

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
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
                  newListTitle.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-400 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {renderListContent()}

      {/* Modals */}
      {showBulkOperations && (
        <BulkOperations
          onImportItems={handleBulkImport}
          onClose={() => setShowBulkOperations(false)}
        />
      )}

      {showTemplates && (
        <ListTemplates
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Click outside handler for dropdown */}
      {showCreateDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCreateDropdown(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
