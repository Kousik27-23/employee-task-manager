import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = useCallback((data) => {
    const payload = { token: data.token, username: data.username, role: data.role, expiresAt: data.expiresAt }
    localStorage.setItem('auth', JSON.stringify(payload))
    setUser(payload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'Admin', isManager: user?.role === 'Admin' || user?.role === 'Manager' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
