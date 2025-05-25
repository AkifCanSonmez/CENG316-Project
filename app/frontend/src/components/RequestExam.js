import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRequests } from '../context/RequestsContext'
import './RequestExam.css'

export default function RequestExam() {
  const { user } = useAuth()
  const { requests, addRequest, decideRequest } = useRequests()

  const [course, setCourse] = useState('CENG316')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState(null)
  const [selectedReqId, setSelectedReqId] = useState(null)
  const [decisionStatus, setDecisionStatus] = useState(null)

  if (!user) return null

  const handleSubmit = e => {
    e.preventDefault()
    addRequest(user.email, user.name, course, details)
    setStatus('İstek kaydedildi.')
    setDetails('')
    setTimeout(() => setStatus(null), 3000)
  }

  const handleDecision = decision => {
    decideRequest(selectedReqId, decision)
    setDecisionStatus(decision === 'Onaylandı' ? 'Onaylandı.' : 'Reddedildi.')
  }

  const myRequests =
    user.role === 'student'
      ? requests.filter(r => r.studentId === user.email)
      : requests.filter(r => r.assignedTo === user.email && r.decision === null)

  if (user.role === 'student') {
    return (
      <div className="req-container">
        <h2>Ek Sınav Talebi</h2>
        {status && <p className="req-status">{status}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Ders
            <select value={course} onChange={e => setCourse(e.target.value)}>
              <option value="CENG316">CENG316</option>
              <option value="CENG216">CENG216</option>
              <option value="CENG448">CENG448</option>
            </select>
          </label>
          <label>
            Açıklama
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary-button">
            Gönder
          </button>
        </form>

        <ul className="req-list">
          {myRequests.map(r => (
            <li key={r.id}>
              <strong>{r.course}</strong> — {r.date}
              <p>{r.details}</p>
              {r.decision && (
                <p className={`req-status ${r.decision === 'Onaylandı' ? 'success' : 'error'}`}>
                  Karar: {r.decision === 'Onaylandı' ? 'Onaylandı' : 'Reddedildi'}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="req-container">
      <h2>Bekleyen Talepler</h2>
      <div className="decision-panel">
        <button
          onClick={() => handleDecision('Onaylandı')}
          disabled={!selectedReqId}
          className="primary-button"
        >
          Onayla
        </button>
        <button
          onClick={() => handleDecision('Reddedildi')}
          disabled={!selectedReqId}
          className="danger-button"
        >
          Reddet
        </button>
      </div>
      {decisionStatus && (
        <p className={`req-status ${decisionStatus === 'Onaylandı.' ? 'success' : 'error'}`}>
          {decisionStatus}
        </p>
      )}
      <ul className="req-list">
        {myRequests.map(r => (
          <li
            key={r.id}
            className={r.id === selectedReqId ? 'selected' : ''}
            onClick={() => {
              setSelectedReqId(r.id)
              setDecisionStatus(null)
            }}
          >
            <input type="radio" checked={r.id === selectedReqId} readOnly />
            <span>
              <strong>{r.studentName}</strong> — {r.course} — {r.date}
            </span>
            <p>{r.details}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
