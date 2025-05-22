import React, { createContext, useContext, useState, useEffect } from 'react'

const RequestsContext = createContext()
export const useRequests = () => useContext(RequestsContext)

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('requests')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests))
  }, [requests])

  const addRequest = (studentEmail, studentName, course, details) => {
    const newReq = {
      id: Date.now().toString(),
      studentId: studentEmail,
      studentName,
      course,
      details,
      date: new Date().toLocaleString(),
      decision: null,
      assignedTo: 'vagifaliyev@std.iyte.edu.tr', // academic’s email
    }
    setRequests(prev => [...prev, newReq])
  }

  const decideRequest = (id, decision) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, decision } : r))
    )
  }

  return (
    <RequestsContext.Provider value={{ requests, addRequest, decideRequest }}>
      {children}
    </RequestsContext.Provider>
  )
}
