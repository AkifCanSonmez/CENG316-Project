import React, { useState, useEffect } from 'react';
import axios from '../api/client';
import { useAuth } from '../context/AuthContext';
import './GradApply.css';

export default function GradApply() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');  // ✅ çakışmasın diye değiştirildi

  const currentUserId = () => user?.id || null;

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/applications/');
      const userApps = res.data.filter(a => a.student_id === currentUserId());
      setApplications(userApps);

      const closed = userApps.find(a => a.is_closed);
      if (closed) {
        setNotification(`🎓 Mezuniyet başvurunuz ${closed.status === 'approved' ? 'onaylandı' : 'reddedildi'}.`);
      }
    } catch {
      setNotification('Başvurular yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    const alreadyApproved = applications.some(a => a.status === 'approved');
    if (alreadyApproved) {
      window.alert('Onaylı başvurunuz var. Yeniden başvuru yapamazsınız.');
      return;
    }

    try {
      await axios.post('/applications/', {
        student_id: currentUserId(),
        initiated_by: 'student',
      });
      fetchApps();
    } catch (err) {
      window.alert(err.response?.data?.detail || 'Başvuru sırasında hata oluştu.');
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="grad-apply">
      <h2>Graduation Application</h2>
      {notification && <p className="alert">{notification}</p>}
      <button onClick={handleCreate}>Başvuru Yap</button>

      <h3>Başvurularım</h3>
      {applications.length === 0 ? (
        <p>Henüz başvuru yok.</p>
      ) : (
        <ul>
          {applications.map(a => (
            <li key={a.id}>
              #{a.id} — {a.status} — {a.created_at ? new Date(a.created_at).toLocaleString() : 'Tarih yok'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
