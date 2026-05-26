import apiClient from './client'

export const generateReport = async (sessionId) => {
  const res = await apiClient.post(`/sessions/${sessionId}/report`)
  return res.data
}

export const getReport = async (sessionId) => {
  const res = await apiClient.get(`/sessions/${sessionId}/report`)
  return res.data
}
