// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      let body
      try {
        body = await res.json()
      } catch {
        throw new Error('Giriş sırasında bilinmeyen hata oluştu.')
      }
      const message = body.detail || 'Giriş başarısız.'
      throw new Error(message)
    }
    const data = await res.json()
    setUser({
      email: data.email,
      role: data.role,
      name: data.email.split('@')[0]
    })
    return data
  }

  const register = async (email, password, role) => {
    const res = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })
    if (!res.ok) {
      let body
      try {
        body = await res.json()
      } catch {
        throw new Error('Kayıt sırasında bilinmeyen hata oluştu.')
      }
      const message = body.detail || 'Kayıt başarısız.'
      throw new Error(message)
    }
    return await res.json()
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
