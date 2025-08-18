import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLists, ListItem } from '../context/ListsContext'
import { ChevronLeftIcon, EditIcon } from 'lucide-react'
import AnimationEngine from '../components/randomizer/AnimationEngine'

const RandomizerView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getList } = useLists()
  const list = getList(id || '')

  useEffect(() => {
    if (!list || list.items.length === 0) {
      navigate('/')
    }
  }, [list, navigate])

  const handleSelectionComplete = (selectedItem: ListItem) => {
    // Optional: Handle selection completion (e.g., analytics, history)
    console.log('Selected item:', selectedItem.text)
  }

  if (!list) return null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/list/${list.id}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ChevronLeftIcon size={16} className="mr-1" />
          Back to List
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {list.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {list.items.length} items ready for random selection
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Need to make a choice? We can choose a winner for you! 🎉
          </div>
        </div>

        <div className="mb-8">
          <AnimationEngine
            items={list.items}
            onSelectionComplete={handleSelectionComplete}
          />
        </div>

        <div className="flex justify-center">
          <Link
            to={`/list/${list.id}`}
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
          >
            <EditIcon size={18} className="mr-2" />
            Edit List Items
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RandomizerView