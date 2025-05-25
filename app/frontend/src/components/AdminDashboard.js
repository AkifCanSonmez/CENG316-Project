import React, { useState } from 'react';
import axios from '../api/client';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [created, setCreated] = useState([]);
  const [certs, setCerts] = useState([]);
  const [top3, setTop3] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [certStatus, setCertStatus] = useState('');
  const [top3Status, setTop3Status] = useState('');

  const handleBulkInitiate = async () => {
    try {
      const res = await axios.post('/applications/initiate-bulk');
      setCreated(res.data.created);
      setBulkStatus(`🎓 ${res.data.created.length} öğrenci için başvuru başlatıldı.`);
    } catch {
      setBulkStatus('⚠️ İşlem başarısız.');
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
      setCertStatus('🏅 Sertifikalar başarıyla atandı.');
    } catch {
      setCertStatus('⚠️ Sertifika atama başarısız.');
      setCerts([]);
    }
  };

  const handleShowTop3 = async () => {
    try {
      const res = await axios.get('/applications/list/top3');
      setTop3(res.data);
      setTop3Status('');
    } catch {
      setTop3([]);
      setTop3Status('⚠️ Liste henüz oluşturulmadı.');
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

      {/* Başvuru Başlatma Sonucu */}
      <div className="card-box">
        <h4>Başvuru Başlatma</h4>
        {bulkStatus && <p className="admin-status">{bulkStatus}</p>}
        {created.length > 0 && (
          <ul>{created.map(e => <li key={e}>{e}</li>)}</ul>
        )}
      </div>

      {/* Sertifika Atama Sonucu */}
      <div className="card-box">
        <h4>Sertifika Atama</h4>
        {certStatus && <p className="admin-status">{certStatus}</p>}
        {certs.length > 0 && (
          <ul>{certs.map(c => <li key={c.student}>{c.student} → {c.certificate}</li>)}</ul>
        )}
      </div>

      {/* Top 3 Sonucu */}
      <div className="card-box">
        <h4>Top 3 Öğrenci</h4>
        {top3Status && <p className="admin-status">{top3Status}</p>}
        {top3.length > 0 && (
          <ol>{top3.map(t => <li key={t.student}>{t.student} — GPA: {t.gpa}</li>)}</ol>
        )}
      </div>
    </div>
  );
}
