///root/ceng/CENG316-Project/app/frontend/src/components/DecideExamRequest.js
import React, { useState, useEffect } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRequests } from '../context/RequestsContext'
import './DecideExamRequest.css'

export default function DecideExamRequest() {
  const { user } = useAuth()
  const { id } = useParams()
  const { getRequestById, decideRequest } = useRequests()
  const nav = useNavigate()
  const [req, setReq] = useState(null)
  const [decision, setDecision] = useState('approved')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setReq(getRequestById(id) || null)
  }, [id, getRequestById])

  if (user === null) return null
  if (user.role !== 'academic') return <Navigate to="/request-exam" replace />
  if (!req) {
    return (
      <div className="dec-container">
        <p>Talep bulunamadı.</p>
        <button className="primary-button" onClick={() => nav('/request-exam')}>
          Geri Dön
        </button>
      </div>
    )
  }

  const submitDecision = e => {
    e.preventDefault()
    decideRequest(id, decision)
    setFeedback('Karar kaydedildi.')
  }

  return (
    <div className="dec-container">
      <h2>Talep Kararı</h2>
      <p><strong>Öğrenci:</strong> {req.studentId}</p>
      <p><strong>Detay:</strong> {req.details}</p>
      <form onSubmit={submitDecision}>
        <label>
          Karar
          <select
            value={decision}
            onChange={e => setDecision(e.target.value)}
          >
            <option value="approved">Onayla</option>
            <option value="rejected">Reddet</option>
          </select>
        </label>
        <button type="submit" className="primary-button">
          Kaydet
        </button>
      </form>
      {feedback && <p className="dec-feedback success">{feedback}</p>}
      <button
        className="secondary-button"
        onClick={() => nav('/request-exam')}
      >
        ← Taleplere Dön
      </button>
    </div>
)
}
