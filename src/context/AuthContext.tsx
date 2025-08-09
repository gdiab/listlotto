import React, { useEffect, useState, createContext, useContext } from 'react'

export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isGuest: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  continueAsGuest: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user')
      const guestMode = localStorage.getItem('guestMode')
      
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      if (guestMode === 'true') {
        setIsGuest(true)
      }
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async () => {
    // For MVP, simulate Google login
    setIsLoading(true)
    try {
      // Mock user data
      const mockUser: User = {
        id: 'user123',
        name: 'Demo User',
        email: 'demo@example.com',
        photoUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
      }
      
      setUser(mockUser)
      setIsGuest(false)
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.removeItem('guestMode')
    } catch (error) {
      console.error('Login failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      setUser(null)
      setIsGuest(false)
      localStorage.removeItem('user')
      localStorage.removeItem('guestMode')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const continueAsGuest = () => {
    setIsGuest(true)
    localStorage.setItem('guestMode', 'true')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        login,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}