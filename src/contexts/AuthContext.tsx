import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../services/api'
import { setAccessToken } from '../services/api/client'
import type { User } from '../types'

interface AuthState { user: User | null; login: (e: string, p: string) => Promise<void>; register: (n: string, e: string, p: string) => Promise<void>; logout: () => void }
const Ctx = createContext<AuthState | null>(null)
const KEY = 'aptinexus.user' // profile only; passwords are never stored

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => { try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') } catch { return null } })
  const value = useMemo<AuthState>(() => {
    const done = (r: { user: User; token: string }) => { setAccessToken(r.token); localStorage.setItem(KEY, JSON.stringify(r.user)); setUser(r.user) }
    return {
      user,
      login: async (e, p) => done(await authApi.login(e, p)),
      register: async (n, e, p) => done(await authApi.register(n, e, p)),
      logout: () => { setAccessToken(null); localStorage.removeItem(KEY); setUser(null) },
    }
  }, [user])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside AuthProvider'); return c }
