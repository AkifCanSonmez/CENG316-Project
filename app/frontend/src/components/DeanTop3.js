// src/components/DeanTop3.js

import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import './DeanTop3.css';

export default function DeanTop3() {
  const [top3, setTop3] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/applications/list/top3')
      .then(res => setTop3(res.data))
      .catch(() => setError('⚠️ Mezuniyet listesi henüz oluşturulmadı.'));
  }, []);

  if (error) return <p className="dean-top3-error">{error}</p>;
  if (!top3) return <p className="dean-top3-loading">Yükleniyor...</p>;

  return (
    <div className="dean-top3-container">
      <h2>En Yüksek Puanlı 3 Mezun Öğrenci</h2>
      <ol>
        {top3.map((r, i) => {
          const gpa = parseFloat(r.gpa);
          let honor = '';
          if (gpa >= 3.7) honor = ' 🎓 Yüksek Onur';
          else if (gpa >= 3.0) honor = ' 🏅 Onur';

          return (
            <li key={r.student}>
              {i + 1}. {r.student} — AGNO: {gpa}{honor}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
