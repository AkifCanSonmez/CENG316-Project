import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function GraduationList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
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
    <div>
      <h2>Graduation List (Dean Only)</h2>
      {list.length === 0 ? (
        <p>No approved applications yet.</p>
      ) : (
        <ol>
          {list.map((entry, i) => (
            <li key={i}>{entry.student} — GPA: {entry.gpa}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
