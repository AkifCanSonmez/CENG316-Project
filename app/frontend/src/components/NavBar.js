// src/components/NavBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const onLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/iyte_logo.png" alt="IYTE Logo" className="sidebar-logo" />
        <div className="sidebar-title">Üniversite Portalı</div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/app" className="sidebar-link">Anasayfa</Link>

        {user.role === 'student' && (
          <>
            <Link to="/app/request-exam" className="sidebar-link">Ek Sınav Talebi</Link>
            <Link to="/app/request-exam/decided" className="sidebar-link">Karar Verilmiş Taleplerim</Link>
            <Link to="/app/grad-apply" className="sidebar-link">Mezuniyet Başvurusu</Link>
          </>
        )}

        {user.role === 'academic' && (
          <>
            <Link to="/app/request-exam" className="sidebar-link">Bekleyen Ek Sınav Talepleri</Link>
            <Link to="/app/request-exam/decided-admin" className="sidebar-link">Karar Verilmiş Talepler</Link>
            <Link to="/app/advisor-decisions" className="sidebar-link">Advisor Kararları</Link>
          </>
        )}

        {user.role === 'dean' && (
          <Link to="/app/graduation-list" className="sidebar-link">Graduation List</Link>
        )}

        {user.role === 'admin' && (
          <>
            <Link to="/app/admin-dashboard" className="sidebar-link">Yönetici Paneli</Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">Merhaba, {user.name}</div>
        <button className="sidebar-logout" onClick={onLogout}>Çıkış</button>
      </div>
    </div>
  );
}
