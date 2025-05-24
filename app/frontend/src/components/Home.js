// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h2>Hoşgeldin, {user.name}!</h2>

      {user.role === 'student' && (
        <ul className="home-links">
          <li><Link to="/request-exam">Ek Sınav Talebi</Link></li>
          <li><Link to="/request-exam/decided">Karar Verilmiş Taleplerim</Link></li>
          <li><Link to="/grad-apply">Mezuniyet Başvurusu</Link></li>
        </ul>
      )}

      {user.role === 'academic' && (
        <ul className="home-links">
          <li><Link to="/request-exam">Bekleyen Ek Sınav Talepleri</Link></li>
          <li><Link to="/request-exam/decided-admin">Karar Verilmiş Talepler</Link></li>
          <li><Link to="/advisor-decisions">Advisor Kararları</Link></li>
          <li><Link to="/secretary-list">Liste Oluştur</Link></li>
          <li><Link to="/dean-top3">Dekan Top 3</Link></li>
        </ul>
      )}
    </div>
);
}
