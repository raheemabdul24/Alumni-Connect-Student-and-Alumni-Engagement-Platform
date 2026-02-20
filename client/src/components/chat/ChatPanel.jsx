import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import ChatWindow from './ChatWindow';
import api from '../../api/api';

export default function ChatPanel() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const loadConversations = async () => {
    try {
      const [convRes, meRes] = await Promise.all([
        api.get('/chats/conversations'),
        api.get('/users/me'),
      ]);
      setConversations(convRes.data.conversations || convRes.data || []);
      setMe(meRes.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const getOther = (conv) => {
    if (!me) return {};
    return conv.participant1?.id === me.id ? conv.participant2 : conv.participant1;
  };

  const openNewChat = async () => {
    setShowNewChat(true);
    setLoadingContacts(true);
    try {
      const res = await api.get('/connections?status=accepted');
      const { sent = [], received = [] } = res.data;
      // Extract the other user from each accepted connection
      const users = [];
      const existingPartnerIds = new Set(conversations.map(c => getOther(c)?.id));
      sent.forEach(c => {
        if (c.status === 'accepted' && c.receiver && !existingPartnerIds.has(c.receiver.id)) {
          users.push(c.receiver);
        }
      });
      received.forEach(c => {
        if (c.status === 'accepted' && c.sender && !existingPartnerIds.has(c.sender.id)) {
          users.push(c.sender);
        }
      });
      setConnectedUsers(users);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const startChatWith = async (targetUserId) => {
    try {
      const res = await api.post('/chats/conversations/start', { targetUserId });
      const newConvo = res.data;
      setShowNewChat(false);
      // Reload conversations and select the new one
      await loadConversations();
      setSelectedConv(newConvo);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)] gap-4">
        {/* Sidebar: Conversation list */}
        <div className="w-80 flex-shrink-0 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Messages</h2>
            <button
              onClick={openNewChat}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition"
              title="New Chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* New Chat Picker */}
          {showNewChat && (
            <div className="border-b border-slate-700/50 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 font-medium">Start conversation with:</span>
                <button onClick={() => setShowNewChat(false)} className="text-gray-500 hover:text-white text-xs">Close</button>
              </div>
              {loadingContacts ? (
                <p className="text-gray-400 text-xs py-2">Loading contacts...</p>
              ) : connectedUsers.length === 0 ? (
                <p className="text-gray-500 text-xs py-2">All connected users already have conversations, or no connections yet.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {connectedUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => startChatWith(u.id)}
                      className="w-full text-left p-2 flex items-center gap-2 hover:bg-slate-700/50 rounded-lg transition"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {u.name?.[0] || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm truncate">{u.name}</p>
                        <p className="text-gray-400 text-xs truncate">{u.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-gray-400 text-sm p-4">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-gray-500 text-sm p-4">No conversations yet. Click + to start chatting with a connected user!</p>
            ) : (
              conversations.map((conv) => {
                const other = getOther(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full text-left p-4 flex items-center gap-3 hover:bg-slate-700/50 transition border-b border-slate-700/30 ${
                      selectedConv?.id === conv.id ? 'bg-slate-700/60' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {other?.name?.[0] || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm truncate">{other?.name || 'Unknown'}</p>
                      {conv.lastMessageText && (
                        <p className="text-gray-400 text-xs truncate mt-0.5">{conv.lastMessageText}</p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-w-0">
          {selectedConv ? (
            <ChatWindow conversationId={selectedConv.id} userId={me?.id} />
          ) : (
            <div className="h-full bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
