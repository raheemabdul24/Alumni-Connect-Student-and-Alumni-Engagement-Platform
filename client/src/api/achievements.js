import api from './api'

export const addAchievement = (payload) => api.post('/achievements', payload).then(r=>r.data)
export const editAchievement = (id, payload) => api.put(`/achievements/${id}`, payload).then(r=>r.data)
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`).then(r=>r.data)
