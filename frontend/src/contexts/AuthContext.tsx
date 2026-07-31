import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Session, User } from '../types'

interface AuthValue { user: User | null; loading: boolean; login(email: string, password: string): Promise<void>; logout(): void }
const AuthContext = createContext<AuthValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const logout = () => {
    localStorage.removeItem('ajaia_token')
    queryClient.clear()
    setUser(null)
  }
  useEffect(() => {
    const restore = async () => {
      if (!localStorage.getItem('ajaia_token')) return setLoading(false)
      try { setUser((await api.get<User>('/auth/me')).data) } catch { logout() } finally { setLoading(false) }
    }
    void restore()
    window.addEventListener('ajaia:unauthorized', logout)
    return () => window.removeEventListener('ajaia:unauthorized', logout)
  }, [])
  const login = async (email: string, password: string) => {
    const { data } = await api.post<Session>('/auth/login', { email, password })
    queryClient.clear()
    localStorage.setItem('ajaia_token', data.access_token)
    setUser(data.user)
  }
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
