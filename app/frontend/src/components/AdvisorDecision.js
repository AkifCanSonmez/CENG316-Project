import React, { useEffect, useState } from 'react';
import { useGradApps } from '../context/GraduationAppContext';
import axios from '../api/client';
import './AdvisorDecision.css';

export default function AdvisorDecision() {
  const { apps, fetchApps, decideApp } = useGradApps();
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const pendings = apps.filter(a => a.status === 'pending');

  const checkEligibility = async studentId => {
    try {
      const res = await axios.get(`/students/${studentId}/eligibility`);
      setEligibility(res.data);
    } catch {
      setEligibility(null);
    }
  };

  const handleSelect = (appId, studentId) => {
    setSelected(appId);
    checkEligibility(studentId);
  };

  const handleDecision = async decision => {
    try {
      await decideApp(selected, decision);
      setStatus(`Karar: ${decision}`);
      setSelected(null);
      setEligibility(null);
      fetchApps();
    } catch (err) {
      setStatus(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Advisor Decisions</h2>
      {status && <p>{status}</p>}
      <ul>
        {pendings.map(app => (
          <li key={app.id}>
            <label>
              <input
                type="radio"
                checked={selected === app.id}
                onChange={() => handleSelect(app.id, app.student_id)}
              />
              #{app.id} — {new Date(app.created_at).toLocaleDateString()}
            </label>
          </li>
        ))}
      </ul>

      {eligibility && (
        <div>
          <p>GPA: {eligibility.gpa}</p>
          <p>Zorunlu dersler geçildi mi: {eligibility.required_passed ? 'Evet' : 'Hayır'}</p>
          <p>Teknik seçmeli: {eligibility.technical}</p>
          <p>Non-technical seçmeli: {eligibility.nontechnical}</p>
        </div>
      )}

      <button onClick={() => handleDecision('approved')} disabled={!selected}>
        Onayla
      </button>
      <button onClick={() => handleDecision('rejected')} disabled={!selected}>
        Reddet
      </button>
    </div>
  );
}
