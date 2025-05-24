// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  // 1) Initialize from localStorage (so reloads keep you logged in)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  // 2) login now captures and stores the integer `id`
  const login = async (email, password) => {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      let body
      try { body = await res.json() } catch { }
      throw new Error(body?.detail || 'Giriş sırasında bilinmeyen hata oluştu.')
    }
    const data = await res.json()
    const me = {
      id:   data.id,            // <— newly returned by backend
      email: data.email,
      role:  data.role,
      name:  data.email.split('@')[0],
    }
    setUser(me)
    return data
  }

  // 3) register stays the same (no auto-login)
  const register = async (email, password, role) => {
    const res = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })
    if (!res.ok) {
      let body
      try { body = await res.json() } catch { }
      throw new Error(body?.detail || 'Kayıt sırasında bilinmeyen hata oluştu.')
    }
    return await res.json()
  }

  // 4) logout clears both state and localStorage
  const logout = () => {
    setUser(null)
  }

  // 5) persist to localStorage whenever `user` changes
  useEffect(() => {
    if (user)   localStorage.setItem('user', JSON.stringify(user))
    else        localStorage.removeItem('user')
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
