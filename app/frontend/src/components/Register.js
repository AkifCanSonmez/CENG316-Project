// src/components/Register.js
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Register.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      // Perform registration, but do NOT set the user in context
      await register(email, password, role)
      // After success, send them to login
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>
        {error && <p className="register-error">{error}</p>}

        <label>
          E-posta
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Rol
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Öğrenci</option>
            <option value="academic">Akademisyen</option>
          </select>
        </label>

        <button type="submit">Kayıt Ol</button>

        <p>
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </form>
    </div>
  )
}
