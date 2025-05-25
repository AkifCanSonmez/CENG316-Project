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
  }, [fetchApps]);

  const pendings = apps.filter(a => a.status === 'Devam Ediyor');

  useEffect(() => {
    const fetchEligibility = async () => {
      const newData = {};
      const newFetched = [];

      for (const app of pendings) {
        if (!fetchedIds.includes(app.id)) {
          try {
            const res = await axios.get(`/students/${app.student_id}/eligibility`);
            newData[app.id] = res.data;
            newFetched.push(app.id);
          } catch {
            newData[app.id] = null;
            newFetched.push(app.id);
          }
        }
      }

      if (Object.keys(newData).length > 0) {
        setEligData(prev => ({ ...prev, ...newData }));
        setFetchedIds(prev => [...prev, ...newFetched]);
      }
    };

    if (pendings.length > 0) fetchEligibility();
  }, [pendings, fetchedIds]);

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
            <th>#ID</th>
            <th>GPA</th>
            <th>Zorunlu</th>
            <th>Teknik</th>
            <th>Non-Tech</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {pendings.map(app => {
            const e = eligData[app.id];
            return (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{e ? e.gpa : '...'}</td>
                <td>{e ? (e.required_passed ? '✓' : '✗') : '...'}</td>
                <td>{e ? e.technical : '...'}</td>
                <td>{e ? e.nontechnical : '...'}</td>
                <td>
                  <button onClick={() => handleDecision(app.id, 'Onaylandı')} className="btn-approve">Onayla</button>
                  <button onClick={() => handleDecision(app.id, 'Reddedildi')} className="btn-reject">Reddet</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
