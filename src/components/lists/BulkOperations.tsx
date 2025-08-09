import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileTextIcon, UploadIcon, XIcon, CheckIcon } from 'lucide-react'

interface BulkOperationsProps {
  onImportItems: (items: string[]) => void
  onClose: () => void
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  onImportItems,
  onClose
}) => {
  const [importText, setImportText] = useState('')
  const [importMode, setImportMode] = useState<'lines' | 'comma'>('lines')

  const handleImport = () => {
    if (!importText.trim()) return

    let items: string[]
    if (importMode === 'lines') {
      items = importText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    } else {
      items = importText
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    }

    if (items.length > 0) {
      onImportItems(items)
      setImportText('')
      onClose()
    }
  }

  const previewItems = () => {
    if (!importText.trim()) return []
    
    if (importMode === 'lines') {
      return importText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, 5) // Preview first 5 items
    } else {
      return importText
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, 5)
    }
  }

  const totalItems = importMode === 'lines' 
    ? importText.split('\n').filter(line => line.trim().length > 0).length
    : importText.split(',').filter(item => item.trim().length > 0).length

  const examples = {
    lines: `Pizza Palace
Burger Bistro  
Taco Temple
Sushi Spot`,
    comma: `Pizza Palace, Burger Bistro, Taco Temple, Sushi Spot`
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Import Multiple Items
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quickly add multiple items to your list
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Import mode selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Import Format
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setImportMode('lines')}
                className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
                  importMode === 'lines'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <FileTextIcon size={20} className="text-indigo-600 dark:text-indigo-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      One per line
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Each line becomes an item
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setImportMode('comma')}
                className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
                  importMode === 'comma'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-indigo-600 dark:text-indigo-400 mr-3 font-mono text-lg">
                    ,
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Comma separated
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Items separated by commas
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Import textarea */}
          <div>
            <label
              htmlFor="import-text"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Paste your items here
            </label>
            <textarea
              id="import-text"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={examples[importMode]}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
            />
          </div>

          {/* Preview */}
          {importText.trim() && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Preview ({totalItems} items)
              </h4>
              <div className="space-y-1">
                {previewItems().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckIcon size={16} className="text-green-500 mr-2" />
                    {item}
                  </div>
                ))}
                {totalItems > 5 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    +{totalItems - 5} more items...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!importText.trim() || totalItems === 0}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
                !importText.trim() || totalItems === 0
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <UploadIcon size={16} className="mr-2" />
              Import {totalItems} item{totalItems !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BulkOperations