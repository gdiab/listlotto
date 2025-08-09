import React, { useState, useCallback, useRef } from 'react'
import { ListItem } from '../../context/ListsContext'
import SpinnerAnimation from './SpinnerAnimation'
import ResultDisplay from './ResultDisplay'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimationEngineProps {
  items: ListItem[]
  onSelectionComplete?: (item: ListItem) => void
  disabled?: boolean
}

interface AnimationStage {
  name: 'idle' | 'spinning' | 'slowing' | 'result' | 'celebration'
  duration?: number
}

const AnimationEngine: React.FC<AnimationEngineProps> = ({
  items,
  onSelectionComplete,
  disabled = false
}) => {
  const [currentStage, setCurrentStage] = useState<AnimationStage>({ name: 'idle' })
  const [currentItem, setCurrentItem] = useState<ListItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const animationRef = useRef<{
    shuffleCount: number
    totalShuffles: number
    timeoutId: number | null
  }>({
    shuffleCount: 0,
    totalShuffles: 0,
    timeoutId: null
  })

  const resetAnimation = useCallback(() => {
    if (animationRef.current.timeoutId) {
      clearTimeout(animationRef.current.timeoutId)
      animationRef.current.timeoutId = null
    }
    setCurrentStage({ name: 'idle' })
    setCurrentItem(null)
    setSelectedItem(null)
    setIsSpinning(false)
    setShowResult(false)
    animationRef.current.shuffleCount = 0
    animationRef.current.totalShuffles = 0
  }, [])

  const startAnimation = useCallback(() => {
    if (disabled || items.length === 0 || isSpinning) return

    resetAnimation()
    
    setCurrentStage({ name: 'spinning' })
    setIsSpinning(true)

    // Configure animation parameters
    const baseShuffles = 15
    const randomShuffles = Math.floor(Math.random() * 10) // Add randomness
    const totalShuffles = baseShuffles + randomShuffles
    
    animationRef.current.totalShuffles = totalShuffles
    animationRef.current.shuffleCount = 0

    const performShuffle = () => {
      const { shuffleCount, totalShuffles } = animationRef.current
      
      if (shuffleCount >= totalShuffles) {
        // Animation complete
        const finalItem = items[Math.floor(Math.random() * items.length)]
        setCurrentItem(finalItem)
        setSelectedItem(finalItem)
        setIsSpinning(false)
        setCurrentStage({ name: 'result' })
        
        // Show result after brief pause
        setTimeout(() => {
          setShowResult(true)
          setCurrentStage({ name: 'celebration' })
          onSelectionComplete?.(finalItem)
        }, 500)
        
        return
      }

      // Select random item for this shuffle
      const randomIndex = Math.floor(Math.random() * items.length)
      const newCurrentItem = items[randomIndex]
      setCurrentItem(newCurrentItem)

      // Calculate next shuffle timing (progressive slowdown)
      const progress = shuffleCount / totalShuffles
      const minDuration = 80
      const maxDuration = 400
      const currentDuration = minDuration + (maxDuration - minDuration) * Math.pow(progress, 2)

      // Update stage based on progress
      if (progress > 0.7) {
        setCurrentStage({ name: 'slowing' })
      }

      animationRef.current.shuffleCount++
      animationRef.current.timeoutId = setTimeout(performShuffle, currentDuration)
    }

    performShuffle()
  }, [disabled, items, isSpinning, onSelectionComplete, resetAnimation])

  const containerVariants = {
    idle: {
      scale: 1,
      opacity: 1
    },
    spinning: {
      scale: 1.02,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    result: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  }

  const isAnimating = currentStage.name !== 'idle' && currentStage.name !== 'celebration'

  return (
    <div className="flex flex-col items-center space-y-8">
      <motion.div
        variants={containerVariants}
        animate={currentStage.name}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SpinnerAnimation
                items={items}
                currentItem={currentItem}
                isSpinning={isSpinning}
              />
            </motion.div>
          ) : selectedItem ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <ResultDisplay
                selectedItem={selectedItem}
                showConfetti={currentStage.name === 'celebration'}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Control button */}
      <motion.button
        onClick={selectedItem ? resetAnimation : startAnimation}
        disabled={disabled || items.length === 0}
        className={`px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-300 dark:focus:ring-offset-gray-800 transition-all duration-200 ${
          disabled || items.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : isAnimating
            ? 'bg-indigo-400 cursor-not-allowed'
            : selectedItem
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        whileHover={!disabled && !isAnimating ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isAnimating ? { scale: 0.95 } : {}}
      >
        {items.length === 0
          ? 'No items to select'
          : isAnimating
          ? 'Selecting...'
          : selectedItem
          ? 'Pick Again'
          : 'Choose For Me'}
      </motion.button>

      {/* Animation status indicator */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-2 h-2 bg-indigo-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span>
              {currentStage.name === 'spinning'
                ? 'Shuffling items...'
                : currentStage.name === 'slowing'
                ? 'Making final selection...'
                : 'Preparing result...'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AnimationEngine