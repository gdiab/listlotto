import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ListsProvider } from './context/ListsContext'
import Dashboard from './pages/Dashboard'
import ListDetail from './pages/ListDetail'
import RandomizerView from './pages/RandomizerView'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'
import { Header } from './components/common/Header'
import { useAuth } from './context/AuthContext'

const AppContent: React.FC = () => {
  const { user, isGuest, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isAuthenticated = user || isGuest

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {isAuthenticated && <Header />}
      
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/list/:id" 
          element={isAuthenticated ? <ListDetail /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/randomize/:id" 
          element={isAuthenticated ? <RandomizerView /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ListsProvider>
          <Router>
            <AppContent />
          </Router>
        </ListsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App