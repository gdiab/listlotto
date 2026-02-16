import React from 'react'
import { motion } from 'framer-motion'
import { ListItem } from '../../context/ListsContext'

interface SpinnerAnimationProps {
  items: ListItem[]
  currentItem: ListItem | null
  isSpinning: boolean
  onComplete?: () => void
  useWeights?: boolean
}

const SpinnerAnimation: React.FC<SpinnerAnimationProps> = ({
  items,
  currentItem,
  isSpinning,
  onComplete: _onComplete,
  useWeights = false
}) => {
  // Calculate font scale based on weight (1x to 1.4x)
  const getFontScale = () => {
    if (!useWeights || !currentItem) return 1
    const maxWeight = Math.max(...items.map(i => i.weight ?? 1))
    if (maxWeight <= 1) return 1
    const itemWeight = currentItem.weight ?? 1
    // Scale from 1.0 (weight 1) to 1.4 (max weight)
    return 1 + ((itemWeight - 1) / (maxWeight - 1)) * 0.4
  }

  const fontScale = getFontScale()
  const isBoosted = useWeights && (currentItem?.weight ?? 1) > 1
  const spinnerVariants = {
    spinning: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        rotate: {
          duration: 0.8,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    idle: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.8
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Spinning outer ring */}
      <motion.div
        className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full"
        variants={spinnerVariants}
        animate={isSpinning ? "spinning" : "idle"}
      />
      
      {/* Inner content area */}
      <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
        {currentItem ? (
          <motion.div
            key={currentItem.id}
            variants={itemVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center px-4"
          >
            <motion.div
              className={`text-lg font-semibold break-words transition-all ${
                isBoosted
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-gray-900 dark:text-white'
              }`}
              style={{
                fontSize: `${fontScale}rem`,
              }}
              animate={{
                scale: isBoosted ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              {currentItem.text}
            </motion.div>
            {isSpinning && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Shuffling...
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center px-4">
            <div className="text-gray-400 dark:text-gray-500">
              {isSpinning ? 'Starting...' : 'Ready'}
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      {isSpinning && (
        <>
          <motion.div
            className="absolute -top-2 left-1/2 w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ marginLeft: '-8px' }}
          />
          <motion.div
            className="absolute -bottom-2 left-1/2 w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{ marginLeft: '-8px' }}
          />
        </>
      )}
    </div>
  )
}

export default SpinnerAnimation