import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await register(email, password, role);
      setSuccess('✅ Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      const msg = err.message.toLowerCase();

      if (msg.includes('403')) {
        setError('⚠️ Bu e-posta ile kayıt olunamaz. Lütfen öğrenci işlerine başvurun.');
      } else if (msg.includes('400')) {
        setError('❌ Bu e-posta zaten sistemde kayıtlı. Lütfen giriş yapmayı deneyin.');
      } else {
        setError('⚠️ Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>

        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}

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
