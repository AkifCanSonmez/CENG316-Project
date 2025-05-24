import React, { useState } from 'react';
import axios from '../api/client';
import './CertAssign.css';

export default function CertAssign() {
  const [honor, setHonor] = useState(3.0);
  const [highHonor, setHighHonor] = useState(3.5);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleAssign = async () => {
    try {
      const res = await axios.post('/applications/list/assign-certificates', {
        honor,
        high_honor: highHonor,
      });
      setResults(res.data);
      setError('');
    } catch {
      setError('⚠️ Liste henüz oluşturulmadı. Sertifika atanamaz.');
      setResults([]);
    }
  };

  return (
    <div>
      <h2>Sertifika Atama</h2>
      <label>
        Onur (≥)
        <input type="number" step="0.1" value={honor} onChange={e => setHonor(+e.target.value)} />
      </label>
      <label>
        Yüksek Onur (≥)
        <input type="number" step="0.1" value={highHonor} onChange={e => setHighHonor(+e.target.value)} />
      </label>
      <button onClick={handleAssign}>Ata</button>

      {error && <p>{error}</p>}
      <ul>
        {results.map(r => (
          <li key={r.student}>{r.student} → {r.certificate}</li>
        ))}
      </ul>
    </div>
  );
}
