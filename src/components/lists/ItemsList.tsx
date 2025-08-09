import React from 'react'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ListItem } from '../../context/ListsContext'
import {
  GripVerticalIcon,
  XIcon,
} from 'lucide-react'

interface SortableItemProps {
  item: ListItem
  isEditing: boolean
  editingText: string
  onEditItem: (item: ListItem) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onRemoveItem: (itemId: string) => void
  onEditingTextChange: (text: string) => void
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  isEditing,
  editingText,
  onEditItem,
  onSaveEdit,
  onCancelEdit,
  onRemoveItem,
  onEditingTextChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-700 rounded-md ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      {isEditing ? (
        <div className="flex items-center p-3">
          <div className="mr-2 w-6" />
          <input
            type="text"
            value={editingText}
            onChange={(e) => onEditingTextChange(e.target.value)}
            className="flex-1 px-3 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit()
              if (e.key === 'Escape') onCancelEdit()
            }}
          />
          <div className="ml-2 flex space-x-1">
            <button
              onClick={onSaveEdit}
              className="px-2 py-1 text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center p-3">
          <div
            {...attributes}
            {...listeners}
            className="mr-2 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <GripVerticalIcon size={16} />
          </div>
          <span
            className="flex-1 text-gray-900 dark:text-white cursor-pointer"
            onClick={() => onEditItem(item)}
          >
            {item.text}
          </span>
          <div className="ml-2 flex space-x-1">
            <button
              onClick={() => onEditItem(item)}
              className="px-2 py-1 text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              Edit
            </button>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

interface ItemsListProps {
  items: ListItem[]
  editingItemId: string | null
  editingItemText: string
  onEditItem: (item: ListItem) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onRemoveItem: (itemId: string) => void
  onEditingTextChange: (text: string) => void
}

const ItemsList: React.FC<ItemsListProps> = ({
  items,
  editingItemId,
  editingItemText,
  onEditItem,
  onSaveEdit,
  onCancelEdit,
  onRemoveItem,
  onEditingTextChange,
}) => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <SortableItem
          key={item.id}
          item={item}
          isEditing={editingItemId === item.id}
          editingText={editingItemText}
          onEditItem={onEditItem}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onRemoveItem={onRemoveItem}
          onEditingTextChange={onEditingTextChange}
        />
      ))}
    </ul>
  )
}

export default ItemsList