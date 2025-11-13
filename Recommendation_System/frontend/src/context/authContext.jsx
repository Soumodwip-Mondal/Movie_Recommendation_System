import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load current user if token exists
  useEffect(() => {
    let ignore = false
    async function load() {
      if (!token) { setUser(null); return }
      setLoading(true)
      try {
        const res = await apiFetch('/api/current_user', { headers: { Authorization: `Bearer ${token}` } })
        if (!ignore) setUser(res)
      } catch (e) {
        console.error('Failed to load current user', e)
        if (!ignore) { setUser(null); setToken(null); localStorage.removeItem('token') }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [token])

  async function login({ email, password }) {
    const res = await apiFetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const t = res?.access_token
    if (!t) throw new Error('Login failed')
    localStorage.setItem('token', t)
    setToken(t)
    // load user after login
    const me = await apiFetch('/api/current_user', { headers: { Authorization: `Bearer ${t}` } })
    setUser(me)
    return me
  }

  async function signup({ name, email, password, genres }) {
    console.log('[AUTH] Starting signup...');
    console.log('[AUTH] Data:', { name, email, genres: genres?.length });
    
    try {
      console.log('[AUTH] Calling /api/signup...');
      const res = await apiFetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, genres })
      })
      console.log('[AUTH] Signup response received:', res);
      
      // Auto-login after signup
      console.log('[AUTH] Auto-logging in...');
      await login({ email, password })
      console.log('[AUTH] Login successful!');
      return res
    } catch (error) {
      console.error('[AUTH] Signup error:', error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, loading, login, signup, logout }), [token, user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
