import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('yf_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  function login(email, password) {
    // Demo auth: any non-empty email/password works
    if (!email || !password) return { success: false, error: 'Email and password required' }
    const demoUser = {
      id: 'demo_user_1',
      name: 'Aakash Kainhla',
      email,
      role: 'Admin',
      orgName: 'Himalayan Trails Tour Operator',
    }
    localStorage.setItem('yf_user', JSON.stringify(demoUser))
    setUser(demoUser)
    return { success: true }
  }

  function logout() {
    localStorage.removeItem('yf_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
