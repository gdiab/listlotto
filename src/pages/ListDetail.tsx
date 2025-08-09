import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLists, ListItem } from '../context/ListsContext'
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
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers'
import {
  ChevronLeftIcon,
  ShuffleIcon,
} from 'lucide-react'
import ItemsList from '../components/lists/ItemsList'
import AddItemForm from '../components/lists/AddItemForm'

const ListDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getList, updateList, addItem, updateItem, removeItem, reorderItems } =
    useLists()
  
  const list = getList(id || '')
  const [title, setTitle] = useState('')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItemText, setEditingItemText] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (list) {
      setTitle(list.title)
    } else {
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

  const handleAddItem = (text: string) => {
    if (list) {
      addItem(list.id, text)
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!list || !over || active.id === over.id) {
      return
    }

    const oldIndex = list.items.findIndex((item) => item.id === active.id)
    const newIndex = list.items.findIndex((item) => item.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderItems(list.id, oldIndex, newIndex)
    }
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
                Items ({list.items.length})
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

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={list.items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <ItemsList
                  items={list.items}
                  editingItemId={editingItemId}
                  editingItemText={editingItemText}
                  onEditItem={handleEditItem}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onRemoveItem={(itemId) => removeItem(list.id, itemId)}
                  onEditingTextChange={setEditingItemText}
                />
              </SortableContext>
            </DndContext>
          </div>
        )}

        <AddItemForm onAddItem={handleAddItem} />
      </div>
    </div>
  )
}

export default ListDetail