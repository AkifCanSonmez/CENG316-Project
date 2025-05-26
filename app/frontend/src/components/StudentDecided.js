// src/components/StudentDecided.js
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useRequests } from '../context/RequestsContext'
import './StudentDecided.css'

export default function StudentDecided() {
  const { user } = useAuth()
  const { requests } = useRequests()

  // Only students reach this component
  if (!user || user.role !== 'student') return null

  // Filter requests by the student's email and have a decision
  const decided = requests.filter(
    r => r.studentId === user.email && r.decision !== null
  )

  return (
    <div className="decided-container">
      <h2>Karar Verilmiş Ek Sınav Taleplerim</h2>
      {decided.length === 0 ? (
        <p>Henüz karar verilmiş talebiniz yok.</p>
      ) : (
        <ul>
          {decided.map(r => (
            <li key={r.id}>
              <strong>{r.course} Sınav</strong> — {r.date} —{' '}
              <span className={r.decision === 'Onaylandı' ? 'Onaylandı' : 'Reddedildi'}>
                {r.decision === 'Onaylandı' ? 'Onaylandı' : 'Reddedildi'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
