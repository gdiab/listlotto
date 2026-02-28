import React from 'react'
import { Link } from 'react-router-dom'
import { List } from '../../context/ListsContext'
import {
  ArchiveIcon,
  TrashIcon,
  EditIcon,
  ShuffleIcon,
  GripVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from 'lucide-react'

interface ListRowProps {
  list: List
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onDelete: (id: string) => void
  showReorderControls?: boolean
  isFirst?: boolean
  isLast?: boolean
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  dragHandleProps?: Record<string, unknown>
}

const ListRow: React.FC<ListRowProps> = ({
  list,
  onArchive,
  onUnarchive,
  onDelete,
  showReorderControls = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}) => {
  const formattedDate = new Date(list.updatedAt).toLocaleDateString()

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${
        list.isArchived ? 'opacity-70' : ''
      }`}
    >
      {showReorderControls && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            {...(dragHandleProps || {})}
            className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
            aria-label="Drag to reorder"
          >
            <GripVerticalIcon size={16} />
          </button>
          <div className="flex flex-col">
            <button
              onClick={() => onMoveUp?.(list.id)}
              disabled={isFirst}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Move up"
            >
              <ChevronUpIcon size={14} />
            </button>
            <button
              onClick={() => onMoveDown?.(list.id)}
              disabled={isLast}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Move down"
            >
              <ChevronDownIcon size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Link
          to={`/list/${list.id}`}
          className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
        >
          {list.title}
        </Link>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {list.items.length} {list.items.length === 1 ? 'item' : 'items'} &middot; {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link
          to={`/list/${list.id}`}
          className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded"
          aria-label={`Edit ${list.title}`}
        >
          <EditIcon size={16} />
        </Link>
        {list.items.length > 0 && (
          <Link
            to={`/randomize/${list.id}`}
            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded"
            aria-label={`Randomize ${list.title}`}
          >
            <ShuffleIcon size={16} />
          </Link>
        )}
        {list.isArchived ? (
          <button
            onClick={() => onUnarchive(list.id)}
            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded"
            aria-label="Unarchive list"
          >
            <ArchiveIcon size={16} />
          </button>
        ) : (
          <button
            onClick={() => onArchive(list.id)}
            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded"
            aria-label="Archive list"
          >
            <ArchiveIcon size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(list.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded"
          aria-label="Delete list"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </div>
  )
}

export default ListRow
