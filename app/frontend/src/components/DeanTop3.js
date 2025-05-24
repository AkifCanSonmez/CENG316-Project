import React, { useEffect, useState } from 'react';
import axios from '../api/client';

export default function DeanTop3() {
  const [top3, setTop3] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/applications/list/top3')
      .then(res => setTop3(res.data))
      .catch(() => setError('⚠️ Mezuniyet listesi henüz oluşturulmadı.'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!top3) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Top 3 Öğrenci (Dekan)</h2>
      <ol>
        {top3.map(r => (
          <li key={r.student}>{r.student} — GPA: {r.gpa}</li>
        ))}
      </ol>
    </div>
  );
}
