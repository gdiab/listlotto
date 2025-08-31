import React from 'react'
import { Link } from 'react-router-dom'
import { List } from '../../context/ListsContext'
import {
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
  const editPath = `/list/${list.id}`

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
        list.isArchived ? 'opacity-70' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
            <Link
              to={editPath}
              aria-label={`Edit ${list.title}`}
              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded-sm"
            >
              {list.title}
            </Link>
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

        <Link
          to={editPath}
          aria-label={`Edit ${list.title}`}
          className="block mb-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 cursor-pointer"
        >
          <div className="max-h-24 overflow-hidden">
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
        </Link>

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
