// src/components/Register.js

import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  // 1) Hooks at the very top, unconditionally
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
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
      await register(email, password, role);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  // 4) JSX
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

        <p className="register-switch">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </form>
    </div>
  );
}
