import React, { useState } from 'react';
import axios from '../api/client';

export default function EligibilityCheck() {
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    try {
      const res = await axios.get(`/students/${studentId}/eligibility`);
      setResult(res.data);
      setError('');
    } catch {
      setError('Uygunluk kontrolü başarısız.');
      setResult(null);
    }
  };

  return (
    <div>
      <h2>Mezuniyet Uygunluk Kontrolü</h2>
      <input
        type="number"
        placeholder="Öğrenci ID"
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
      />
      <button onClick={handleCheck}>Kontrol Et</button>

      {error && <p>{error}</p>}
      {result && (
        <div>
          <p>GPA: {result.gpa}</p>
          <p>Zorunlu Dersler Geçildi: {result.required_passed ? 'Evet' : 'Hayır'}</p>
          <p>Teknik Seçmeli: {result.technical}</p>
          <p>Non-technical Seçmeli: {result.nontechnical}</p>
        </div>
      )}
    </div>
  );
}
