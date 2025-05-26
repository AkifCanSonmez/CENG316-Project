import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useRequests } from '../context/RequestsContext'
import './RequestExamDecided.css'

export default function RequestExamDecided() {
  const { user } = useAuth()
  const { requests } = useRequests()
  if (!user || user.role !== 'academic') return null

  const decided = requests.filter(
    r => r.assignedTo === user.email && r.decision !== null
  )

  return (
    <div className="decided-container">
      <h2>Karar Verilmiş Ek Sınav Talepleri</h2>
      {decided.length === 0 ? (
        <p>Henüz karar verilmiş talep yok.</p>
      ) : (
        <ul>
          {decided.map(r => (
            <li key={r.id}>
              <strong>{r.studentName}</strong> — {r.course} — {r.date} —{' '}
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
