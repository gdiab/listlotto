import React, { useMemo, useState } from 'react'
import { useLists } from '../context/ListsContext'
import { useAuth } from '../context/AuthContext'
import ListCard from '../components/lists/ListCard'
import EmptyState from '../components/common/EmptyState'
import BulkOperations from '../components/lists/BulkOperations'
import ListTemplates from '../components/lists/ListTemplates'
import { 
  PlusIcon, 
  SearchIcon, 
  ArchiveIcon, 
  UploadIcon, 
  LayoutTemplateIcon,
  ChevronDownIcon
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { lists, createList, deleteList, archiveList, unarchiveList, addItem } =
    useLists()
  const { user, isGuest } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showCreateDropdown, setShowCreateDropdown] = useState(false)

  const filteredLists = useMemo(() => {
    return lists.filter((list) => {
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
  }, [lists, searchQuery, showArchived])

  const handleCreateList = async () => {
    if (newListTitle.trim()) {
      const newList = await createList(newListTitle.trim())
      setNewListTitle('')
      setIsCreating(false)
      window.location.href = `/list/${newList.id}`
    }
  }

  const handleTemplateSelect = async (template: { name: string; items: string[] }) => {
    const newList = await createList(template.name)
    for (const item of template.items) {
      await addItem(newList.id, item)
    }
    window.location.href = `/list/${newList.id}`
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
    window.location.href = `/list/${newList.id}`
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
                    <div className="text-xs text-gray-500 dark:text-gray-400">Start from scratch</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowTemplates(true)
                    setShowCreateDropdown(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                >
                  <LayoutTemplateIcon size={16} className="mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">From Template</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pre-made lists</div>
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
                    <div className="text-xs text-gray-500 dark:text-gray-400">Paste multiple items</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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