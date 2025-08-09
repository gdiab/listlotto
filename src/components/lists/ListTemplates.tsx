import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UtensilsIcon, 
  FilmIcon, 
  MapPinIcon, 
  GamepadIcon,
  BookIcon,
  MusicIcon,
  XIcon,
  PlusIcon
} from 'lucide-react'

interface ListTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  items: string[]
  category: 'food' | 'entertainment' | 'places' | 'activities' | 'education'
}

interface ListTemplatesProps {
  onSelectTemplate: (template: ListTemplate) => void
  onClose: () => void
}

const templates: ListTemplate[] = [
  {
    id: 'restaurants',
    name: 'Popular Restaurants',
    description: 'Can\'t decide where to eat? Let us pick!',
    icon: <UtensilsIcon size={24} />,
    category: 'food',
    items: [
      'Italian Bistro',
      'Sushi Palace',
      'Mexican Grill',
      'Chinese Garden',
      'Thai Spice',
      'American Diner',
      'French Cafe',
      'Indian Curry House',
      'Greek Taverna',
      'BBQ Smokehouse'
    ]
  },
  {
    id: 'movies',
    name: 'Movie Night Genres',
    description: 'What type of movie should you watch?',
    icon: <FilmIcon size={24} />,
    category: 'entertainment',
    items: [
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Sci-Fi',
      'Romance',
      'Thriller',
      'Documentary',
      'Animated',
      'Mystery'
    ]
  },
  {
    id: 'weekend-activities',
    name: 'Weekend Activities',
    description: 'Fun things to do on your day off',
    icon: <GamepadIcon size={24} />,
    category: 'activities',
    items: [
      'Go for a hike',
      'Visit a museum',
      'Try a new recipe',
      'Read a book',
      'Go to the beach',
      'Have a picnic',
      'Visit friends',
      'Go shopping',
      'Watch a movie',
      'Play board games'
    ]
  },
  {
    id: 'travel-destinations',
    name: 'Dream Destinations',
    description: 'Where should your next vacation be?',
    icon: <MapPinIcon size={24} />,
    category: 'places',
    items: [
      'Paris, France',
      'Tokyo, Japan',
      'New York City',
      'London, England',
      'Rome, Italy',
      'Sydney, Australia',
      'Rio de Janeiro',
      'Barcelona, Spain',
      'Amsterdam, Netherlands',
      'Bali, Indonesia'
    ]
  },
  {
    id: 'workout-types',
    name: 'Workout Options',
    description: 'Mix up your fitness routine',
    icon: <GamepadIcon size={24} />,
    category: 'activities',
    items: [
      'Cardio',
      'Weight Training',
      'Yoga',
      'Pilates',
      'Running',
      'Swimming',
      'Cycling',
      'Rock Climbing',
      'Dancing',
      'Martial Arts'
    ]
  },
  {
    id: 'book-genres',
    name: 'Book Genres',
    description: 'What should you read next?',
    icon: <BookIcon size={24} />,
    category: 'education',
    items: [
      'Mystery',
      'Romance',
      'Science Fiction',
      'Fantasy',
      'Biography',
      'Self-Help',
      'History',
      'Thriller',
      'Literary Fiction',
      'Non-Fiction'
    ]
  },
  {
    id: 'music-genres',
    name: 'Music Moods',
    description: 'What music fits your current mood?',
    icon: <MusicIcon size={24} />,
    category: 'entertainment',
    items: [
      'Pop',
      'Rock',
      'Jazz',
      'Classical',
      'Hip-Hop',
      'Electronic',
      'Folk',
      'R&B',
      'Indie',
      'Country'
    ]
  },
  {
    id: 'study-topics',
    name: 'Study Sessions',
    description: 'What subject should you focus on today?',
    icon: <BookIcon size={24} />,
    category: 'education',
    items: [
      'Mathematics',
      'Science',
      'History',
      'Language Arts',
      'Programming',
      'Art',
      'Music Theory',
      'Philosophy',
      'Psychology',
      'Economics'
    ]
  }
]

const ListTemplates: React.FC<ListTemplatesProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'activities', name: 'Activities' },
    { id: 'places', name: 'Places' },
    { id: 'education', name: 'Learning' }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleSelectTemplate = (template: ListTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Choose a Template
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Start with pre-made lists for common scenarios
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="flex overflow-hidden">
          {/* Category sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-700 p-4 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Categories
            </h4>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all bg-white dark:bg-gray-800"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-base font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {template.description}
                      </p>
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {template.items.length} items included:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.items.slice(0, 4).map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {item}
                            </span>
                          ))}
                          {template.items.length > 4 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{template.items.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
                      <PlusIcon size={14} className="mr-1" />
                      Use Template
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No templates found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ListTemplates