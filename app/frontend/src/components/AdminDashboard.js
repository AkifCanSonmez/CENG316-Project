// src/components/AdminDashboard.js
import React, { useState } from 'react';
import axios from '../api/client';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [created, setCreated] = useState([]);
  const [certs, setCerts] = useState([]);
  const [top3, setTop3] = useState([]);
  const [status, setStatus] = useState('');

  const handleBulkInitiate = async () => {
    try {
      const res = await axios.post('/applications/initiate-bulk');
      setCreated(res.data.created);
      setStatus(`🎓 ${res.data.created.length} öğrenci için başvuru başlatıldı.`);
    } catch {
      setStatus('⚠️ İşlem başarısız.');
      setCreated([]);
    }
  };

  const handleAssignCertificates = async () => {
    try {
      const res = await axios.post('/applications/list/assign-certificates', {
        honor: 3.0,
        high_honor: 3.5
      });
      setCerts(res.data);
      setStatus('🏅 Sertifikalar başarıyla atandı.');
    } catch {
      setStatus('⚠️ Sertifika atama başarısız.');
    }
  };

  const handleShowTop3 = async () => {
    try {
      const res = await axios.get('/applications/list/top3');
      setTop3(res.data);
      setStatus('');
    } catch {
      setTop3([]);
      setStatus('⚠️ Liste henüz oluşturulmadı.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Yönetici Paneli</h2>
      <div className="admin-buttons">
        <button onClick={handleBulkInitiate}>Tüm Öğrenciler için Başvuru Başlat</button>
        <button onClick={handleAssignCertificates}>Sertifika Ata</button>
        <button onClick={handleShowTop3}>Top 3 Öğrenciyi Göster</button>
      </div>

      {status && <p className="admin-status">{status}</p>}

      {created.length > 0 && (
        <>
          <h4>Yeni Başlatılan Başvurular:</h4>
          <ul>{created.map(e => <li key={e}>{e}</li>)}</ul>
        </>
      )}

      {certs.length > 0 && (
        <>
          <h4>Atanan Sertifikalar:</h4>
          <ul>{certs.map(c => <li key={c.student}>{c.student} → {c.certificate}</li>)}</ul>
        </>
      )}

      {top3.length > 0 && (
        <>
          <h4>Top 3 Öğrenci:</h4>
          <ol>{top3.map(t => <li key={t.student}>{t.student} — GPA: {t.gpa}</li>)}</ol>
        </>
      )}
    </div>
  );
}
