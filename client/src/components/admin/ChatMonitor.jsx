import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function ChatMonitor() {

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [search]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await api.get(`/admin/conversations?${params}`);
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setMessagesLoading(true);

    try {
      const res = await api.get(
        `/admin/conversations/${conversation.id}/messages`
      );
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await api.delete(`/admin/conversations/${conversationId}`);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      alert('Conversation deleted');
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="grid grid-cols-3 gap-6 h-screen">
        {/* Conversations List */}
        <div className="col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Conversations</h2>

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:border-cyan-500"
          />

          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-cyan-600 border border-cyan-500'
                      : 'bg-slate-700 border border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <p className="text-white font-medium truncate">
                    {conversation.participant1?.name} & {conversation.participant2?.name}
                  </p>
                  <p className="text-sm text-slate-400 truncate">{conversation.lastMessageText}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(conversation.lastMessageAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages Detail */}
        <div className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">
                  {selectedConversation.participant1?.name} & {selectedConversation.participant2?.name}
                </h2>
                <button
                  onClick={() => handleDeleteConversation(selectedConversation.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messagesLoading ? (
                  <div className="text-slate-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-slate-400">No messages</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="bg-slate-700 border border-slate-600 rounded-lg p-3"
                    >
                      <p className="text-sm font-semibold text-cyan-400">{message.sender?.name}</p>
                      <p className="text-white mt-1">{message.content}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="text-sm text-slate-400 PT-4">
                Total Messages: {messages.length}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
