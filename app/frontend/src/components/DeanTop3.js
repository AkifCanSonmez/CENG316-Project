import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import './DeanTop3.css'; // 👈 bunu ekle

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
      <h2>Top 3 Öğrenci (Dekan)</h2>
      <ol>
        {top3.map(r => (
          <li key={r.student}>{r.student} — GPA: {r.gpa}</li>
        ))}
      </ol>
    </div>
  );
}
