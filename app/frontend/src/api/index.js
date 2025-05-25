import axios from 'axios'

const client = axios.create({
  baseURL: 'https://ceng316-project-production.up.railway.app/',  // ← adjust
})

// auth
export const login = (email, password) =>
  client.post('/auth/login', { email, password })

// student requests exam
export const requestExam = (examType, details, token) =>
  client.post(
    '/exams/request',
    { examType, details },
    { headers: { Authorization: `Bearer ${token}` } }
  )

// admin/affairs decides exam requests
export const decideExamRequest = (requestId, decision, token) =>
  client.post(
    `/exams/${requestId}/decision`,
    { decision },  // e.g. 'approved' | 'rejected'
    { headers: { Authorization: `Bearer ${token}` } }
  )

export default client
