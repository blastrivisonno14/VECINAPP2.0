import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type User = { id: number; email: string; role: string; name?: string; commerceId?: number }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem('vecin_user')
    return s ? JSON.parse(s) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vecin_token'))

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
    const res = await axios.post(`${BACKEND}/auth/login`, { email, password })
    const token = res.data.token
    setToken(token)
    // fetch me
    const me = await axios.get(`${BACKEND}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
    if (me && me.data) setUser(me.data)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
