import React, { useEffect, useState } from 'react';
import { useGradApps } from '../context/GraduationAppContext';
import axios from '../api/client';
import './AdvisorDecision.css';

export default function AdvisorDecision() {
  const { apps, fetchApps, decideApp } = useGradApps();
  const [eligData, setEligData] = useState({});
  const [statusMsg, setStatusMsg] = useState('');
  const [fetchedIds, setFetchedIds] = useState([]);

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendings = apps.filter(a => a.status === 'Devam Ediyor');

  useEffect(() => {
    const fetchEligibility = async () => {
      const newData = {};
      const newFetched = [];

      const newPendings = pendings.filter(app => !fetchedIds.includes(app.id));
      if (newPendings.length === 0) return;

      for (const app of newPendings) {
        try {
          const res = await axios.get(`/students/${app.student_id}/eligibility`);
          newData[app.id] = res.data;
          newFetched.push(app.id);
        } catch {
          newData[app.id] = null;
          newFetched.push(app.id);
        }
      }

      setEligData(prev => ({ ...prev, ...newData }));
      setFetchedIds(prev => [...prev, ...newFetched]);
    };

    fetchEligibility();
  }, [apps]);

  const handleDecision = async (appId, decision) => {
    try {
      await decideApp(appId, decision);
      setStatusMsg(`Başvuru ${appId} → ${decision}`);
      setEligData(prev => {
        const updated = { ...prev };
        delete updated[appId];
        return updated;
      });
      setFetchedIds(prev => prev.filter(id => id !== appId));
      fetchApps();
    } catch (err) {
      setStatusMsg(err.response?.data || err.message);
    }
  };

  return (
    <div className="advisor-table-container">
      <h2>Advisor Decisions</h2>
      {statusMsg && <p className="status-msg">{statusMsg}</p>}

      <table className="advisor-table">
        <thead>
          <tr>
            <th>Öğrenci No</th>
            <th>GPA</th>
            <th>Zorunlu</th>
            <th>Teknik</th>
            <th>Teknik Olmayan</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {pendings.map(app => {
            const e = eligData[app.id];
            const studentNo = app.student?.student_id || '---';
            const isEligible = e && e.gpa >= 2.0 && e.required_passed && e.technical >= 1 && e.nontechnical >= 1;

            return (
              <tr key={app.id}>
                <td>{studentNo}</td>
                <td>{e ? e.gpa : e === null ? '❌' : '...'}</td>
                <td>{e ? (e.required_passed ? '✓' : '✗') : e === null ? '❌' : '...'}</td>
                <td>{e ? e.technical : e === null ? '❌' : '...'}</td>
                <td>{e ? e.nontechnical : e === null ? '❌' : '...'}</td>
                <td>
                  <button
                    onClick={() => handleDecision(app.id, 'Onaylandı')}
                    className={`btn-approve${!isEligible ? ' disabled' : ''}`}
                    disabled={!isEligible}
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => handleDecision(app.id, 'Reddedildi')}
                    className="btn-reject"
                  >
                    Reddet
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
