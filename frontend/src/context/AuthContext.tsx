import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type User = { id: number; email: string; role: string; name?: string; commerceId?: number }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem('vecin_user')
    return s ? JSON.parse(s) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vecin_token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('vecin_user', JSON.stringify(user))
    else localStorage.removeItem('vecin_user')
  }, [user])

  useEffect(() => {
    if (token) localStorage.setItem('vecin_token', token)
    else localStorage.removeItem('vecin_token')
  }, [token])

  const login = async (email: string, password: string) => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    setLoading(true)
    try {
      const res = await axios.post(`${BACKEND}/auth/login`, { email, password })
      const access = res.data.accessToken || res.data.token
      setToken(access)
      const me = await axios.get(`${BACKEND}/auth/me`, { headers: { Authorization: `Bearer ${access}` } }).catch(() => null)
      if (me && me.data) setUser(me.data)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
