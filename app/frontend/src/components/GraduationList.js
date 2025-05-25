import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import { useAuth } from '../context/AuthContext';
import './GraduationList.css';

export default function GraduationList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!user) return;

    console.log('🧠 user:', user);
    axios.get('/graduation-list', {
      headers: { 'x-user-email': user.email }
    })
      .then(res => {
        console.log('✅ response:', res.data);
        setList(res.data);
      })
      .catch(err => {
        console.error('❌ graduation list error:', err.response?.data || err.message);
        setList([]);
      });
  }, [user]);

  return (
    <div className="graduation-container">
      <h2>Graduation List (Dean Only)</h2>
      {list.length === 0 ? (
        <p className="no-applications">No approved applications yet.</p>
      ) : (
        <ol className="graduation-list">
          {list.map((entry, i) => (
            <li key={i}>
              <strong>{entry.student}</strong> — GPA: <span className="gpa">{entry.gpa}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
