// src/components/NavBar.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NavBar.css'

export default function NavBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  if (!user) return null

  const onLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      logout()
      nav('/login', { replace: true })
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/iyte_logo.png" alt="IYTE Logo" className="sidebar-logo" />
        <div className="sidebar-title">Üniversite Portalı</div>
      </div>

      <nav className="sidebar-nav">
        {user.role === 'student' && (
          <>
            <Link to="/request-exam" className="sidebar-link">
              Ek Sınav Talepleri
            </Link>
            <Link to="/request-exam/decided" className="sidebar-link">
              Karar Verilmiş Taleplerim
            </Link>
          </>
        )}

        {user.role === 'academic' && (
          <>
            <Link to="/request-exam" className="sidebar-link">
              Bekleyen Ek Sınav Öğrenci Talepleri
            </Link>
            <Link to="/request-exam/decided-admin" className="sidebar-link">
              Karar Verilmiş Talepler
            </Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">Merhaba, {user.name}</div>
        <button className="sidebar-logout" onClick={onLogout}>
          Çıkış
        </button>
      </div>
    </div>
  )
}
