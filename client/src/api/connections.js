import api from './api'

export const sendConnectionRequest = (receiverId) => api.post('/connections', { receiverId }).then(r=>r.data)
export const respondConnection = (id, action) => api.post(`/connections/${id}/respond`, { action }).then(r=>r.data)
export const listConnections = () => api.get('/connections').then(r=>r.data)
