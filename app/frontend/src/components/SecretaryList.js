import React, { useEffect, useState } from 'react';
import axios from '../api/client';

export default function SecretaryList() {
  const [list, setList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.post('/applications/generate-list')
      .then(res => setList(res.data))
      .catch(() => setError('⚠️ Mezuniyet listesi henüz oluşturulmadı.'));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Mezuniyet Listesi (Sekreter)</h2>
      {list.length === 0 ? (
        <p>Onaylı başvuru yok.</p>
      ) : (
        <ol>
          {list.map(r => (
            <li key={r.student}>{r.student} — GPA: {r.gpa}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
