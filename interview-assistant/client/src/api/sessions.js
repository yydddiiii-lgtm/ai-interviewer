import apiClient from './client'

export const createSession = async ({ job_title, company, resume_text }) => {
  const res = await apiClient.post('/sessions', { job_title, company, resume_text })
  return res.data
}

export const getSessions = async () => {
  const res = await apiClient.get('/sessions')
  return res.data
}

export const getSession = async (id) => {
  const res = await apiClient.get(`/sessions/${id}`)
  return res.data
}

export const completeSession = async (id) => {
  const res = await apiClient.patch(`/sessions/${id}/complete`)
  return res.data
}

export const generateQuestion = async (sessionId) => {
  const res = await apiClient.post(`/sessions/${sessionId}/questions`)
  return res.data
}

export const submitAnswer = async (questionId, { content, input_type }) => {
  const res = await apiClient.post(`/questions/${questionId}/answers`, { content, input_type })
  return res.data
}
