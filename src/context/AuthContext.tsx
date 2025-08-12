import React, { useEffect, useState, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

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
    const checkAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const supabaseUser = session.user
          setUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
            photoUrl: supabaseUser.user_metadata?.avatar_url
          })
        } else {
          // Check for guest mode
          const guestMode = localStorage.getItem('guestMode')
          if (guestMode === 'true') {
            setIsGuest(true)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true)
        
        if (session?.user) {
          const supabaseUser = session.user
          setUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
            photoUrl: supabaseUser.user_metadata?.avatar_url
          })
          setIsGuest(false)
          localStorage.removeItem('guestMode')
        } else {
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })
      
      if (error) {
        console.error('Login failed:', error.message)
        throw error
      }
      
      // The auth state change will be handled by the onAuthStateChange listener
    } catch (error) {
      console.error('Login failed', error)
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout failed:', error.message)
        throw error
      }
      
      // Clear guest mode and user state
      setUser(null)
      setIsGuest(false)
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