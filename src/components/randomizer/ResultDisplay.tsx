import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ListItem } from '../../context/ListsContext'

interface ResultDisplayProps {
  selectedItem: ListItem
  onCelebration?: () => void
  showConfetti?: boolean
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  selectedItem,
  onCelebration,
  showConfetti = true
}) => {
  const confettiRef = useRef<HTMLDivElement>(null)
  const hasTriggeredConfetti = useRef(false)

  useEffect(() => {
    if (showConfetti && selectedItem && !hasTriggeredConfetti.current) {
      triggerConfetti()
      hasTriggeredConfetti.current = true
      onCelebration?.()
    }
  }, [selectedItem, showConfetti, onCelebration])

  // Reset confetti flag when item changes
  useEffect(() => {
    hasTriggeredConfetti.current = false
  }, [selectedItem.id])

  const triggerConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // Multi-stage confetti celebration
      const fireConfetti = (particleCount: number, spread: number, delay = 0) => {
        setTimeout(() => {
          confetti({
            particleCount,
            spread,
            origin: {
              x: x / window.innerWidth,
              y: y / window.innerHeight,
            },
            colors: ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981']
          })
        }, delay)
      }

      // Burst sequence
      fireConfetti(50, 60, 0)
      fireConfetti(30, 80, 200)
      fireConfetti(20, 100, 400)
    }
  }

  const resultVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const shimmerVariants = {
    shimmer: {
      background: [
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
      ],
      backgroundPosition: ["-100%", "100%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div
        ref={confettiRef}
        className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-8 shadow-2xl border border-indigo-200 dark:border-indigo-700"
      >
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Winner badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full mb-4 shadow-lg"
            variants={pulseVariants}
            animate="pulse"
          >
            🎉 Winner! 🎉
          </motion.div>

          {/* Selected item with shimmer effect */}
          <div className="relative overflow-hidden">
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-indigo-300 dark:border-indigo-600"
              variants={shimmerVariants}
              animate="shimmer"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedItem.text}
              </div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                Your randomly selected item
              </div>
            </motion.div>
          </div>

          {/* Celebration text */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              🎊 There's your answer! 🎊
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Selected from {selectedItem.text} options
            </p>
          </motion.div>
        </motion.div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-70"
              initial={{
                x: Math.random() * 100 + "%",
                y: "100%",
                scale: 0
              }}
              animate={{
                y: "-10%",
                scale: [0, 1, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                left: `${10 + i * 15}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResultDisplay