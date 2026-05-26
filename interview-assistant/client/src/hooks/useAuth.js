import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mock_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('mock_token') || null)

  const saveAuth = (userData, tokenStr) => {
    setUser(userData)
    setToken(tokenStr)
    localStorage.setItem('mock_user', JSON.stringify(userData))
    localStorage.setItem('mock_token', tokenStr)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('mock_user')
    localStorage.removeItem('mock_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, saveAuth, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
