// src/components/GraduationList.js

import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import { useAuth } from '../context/AuthContext';
import './GraduationList.css';

export default function GraduationList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios.get('/graduation-list', {
      headers: { 'x-user-email': user.email }
    })
      .then(res => setList(res.data))
      .catch(err => {
        console.error('❌ Mezuniyet listesi hatası:', err.response?.data || err.message);
        setList([]);
      });
  }, [user]);

  return (
    <div className="graduation-container">
      <h2>Mezuniyet Listesi (Sadece Dekan)</h2>
      {list.length === 0 ? (
        <p className="no-applications">Henüz onaylanmış mezuniyet başvurusu yok.</p>
      ) : (
        <ol className="graduation-list">
          {list.map((entry, i) => {
            const gpa = parseFloat(entry.gpa);
            let honor = '';
            if (gpa >= 3.7) honor = ' 🎓 Yüksek Onur';
            else if (gpa >= 3.0) honor = ' 🏅 Onur';

            return (
              <li key={i}>
                <strong>{entry.student}</strong> — AGNO: <span className="gpa">{gpa}</span>{honor}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
