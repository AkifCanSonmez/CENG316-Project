// src/components/Login.js

import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  // 1) Hooks at the very top
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // 2) Conditional redirect after hooks
  if (user) {
    return <Navigate to="/app" replace />;
  }

  // 3) Form submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  // 4) JSX
  return (
    <div
      className="login-container"
      style={{
        backgroundImage: 'url(/iyte_kampus.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="login-overlay" />

      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/iyte_logo.png" alt="IYTE Logo" className="login-logo" />
        <h2>Üniversite Portalı Giriş</h2>

        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Giriş Yap</button>

        <p className="login-switch">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </form>
    </div>
  );
}
