import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../../api/api';

const SOCKET_URL = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000';

export default function ChatWindow({ conversationId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const boxRef = useRef();
  const socketRef = useRef(null);

  // Load existing messages from REST API
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    api.get(`/chats/${conversationId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Failed to load messages:', err))
      .finally(() => setLoading(false));
  }, [conversationId]);

  // Socket.io real-time
  useEffect(() => {
    if (!conversationId) return;
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit('join', conversationId);
    socket.on('message', (payload) => {
      if (payload.conversationId === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates by checking id
          if (payload.id && prev.some(m => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      }
    });

    return () => {
      socket.emit('leave', conversationId);
      socket.off('message');
      socket.disconnect();
    };
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post(`/chats/${conversationId}/messages`, { content: text });
      setMessages((prev) => [...prev, res.data]);
      setText('');
      // Also emit via socket for real-time to other user
      if (socketRef.current) {
        socketRef.current.emit('message', { ...res.data, conversationId });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Messages area */}
      <div ref={boxRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No messages yet. Say hello!</p>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === userId;
            return (
              <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-700 text-gray-100 rounded-bl-sm'
                }`}>
                  <p>{m.content}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {new Date(m.createdAt || m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
