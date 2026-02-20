import api from './api'

export const sendMessage = (to, content) => 
  api.post('/chats', { to, content }).then(r=>r.data)

export const getMessages = (conversationId) =>
  api.get(`/chats/${conversationId}`).then(r=>r.data)
