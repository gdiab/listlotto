import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useLists } from '../context/ListsContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, isGuest, logout } = useAuth()
  const { lists } = useLists()

  const activeLists = lists.filter(list => !list.isArchived)
  const archivedLists = lists.filter(list => list.isArchived)
  const totalItems = lists.reduce((acc, list) => acc + list.items.length, 0)

  const handleLogout = async () => {
    await logout()
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('lists_') || key === 'theme' || key === 'user' || key === 'guestMode') {
          localStorage.removeItem(key)
        }
      })
      window.location.reload()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h2>
          <div className="space-y-4">
            {user && (
              <>
                <div className="flex items-center space-x-4">
                  {user.photoUrl && (
                    <img
                      className="h-16 w-16 rounded-full"
                      src={user.photoUrl}
                      alt={user.name}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {isGuest && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-yellow-400 dark:text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Guest Mode Active
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      Your data is stored locally and will be lost if you clear your browser data.
                      Consider signing in to save your lists permanently.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Theme
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Currently using {theme} mode
              </p>
            </div>
            <Button onClick={toggleTheme} variant="secondary">
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Usage Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeLists.length}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                Active Lists
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalItems}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300">
                Total Items
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {archivedLists.length}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-300">
                Archived Lists
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-red-400 dark:text-red-500 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Clear All Data
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    This will permanently delete all your lists, items, and settings. 
                    This action cannot be undone.
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={clearAllData}
                      variant="danger"
                      size="sm"
                    >
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Session
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Sign Out
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                End your current session and return to the login screen
              </p>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}