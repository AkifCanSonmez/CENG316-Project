// src/components/Login.js
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/request-exam')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: 'url(/iyte_kampus.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for readability */}
      <div className="login-overlay" />

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Logo */}
        <img src="/iyte_logo.png" alt="IYTE Logo" className="login-logo" />
        <h2>Üniversite Portalı Giriş</h2>

        {/* Error message */}
        {error && <p className="login-error">{error}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit">Giriş Yap</button>

        {/* Switch to register */}
        <p className="login-switch">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </form>
    </div>
  )
}
