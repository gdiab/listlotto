import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'

interface AddItemFormProps {
  onAddItem: (text: string) => void
  placeholder?: string
  disabled?: boolean
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  onAddItem,
  placeholder = "Add a new item...",
  disabled = false,
}) => {
  const [newItemText, setNewItemText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemText.trim()) {
      onAddItem(newItemText.trim())
      setNewItemText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!newItemText.trim() || disabled}
          className={`px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
            newItemText.trim() && !disabled
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-400 cursor-not-allowed'
          }`}
        >
          <PlusIcon size={20} />
        </button>
      </div>
    </form>
  )
}

export default AddItemForm