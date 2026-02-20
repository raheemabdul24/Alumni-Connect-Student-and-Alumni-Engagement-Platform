import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import api from '../../api/api'

export default function ConnectionsPanel(){
  const navigate = useNavigate();
  const [connections, setConnections] = useState({ sent: [], received: [] })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('accepted')

  const load = async ()=>{
    try {
      setLoading(true);
      const res = await api.get('/connections')
      setConnections(res.data)
    } catch(e) { 
      console.error('Error loading connections:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, [])

  const handleRespond = async (id, action)=>{
    try {
      await api.post(`/connections/${id}/respond`, { action })
      await load()
    } catch(e) { console.error(e) }
  }

  const handleCancel = async (id)=>{
    try {
      await api.delete(`/connections/${id}`)
      await load()
    } catch(e) { console.error(e) }
  }

  const handleMessage = async (otherUserId) => {
    try {
      await api.post('/chats/conversations/start', { targetUserId: otherUserId });
      // Determine which role path to use based on current URL
      const basePath = window.location.pathname.startsWith('/alumni') ? '/alumni/chat' : '/student/chat';
      navigate(basePath);
    } catch (err) {
      alert('Error starting chat: ' + (err.response?.data?.error || err.message));
    }
  };

  // Separate connections by status
  const allConnections = [...(connections.sent || []).map(c => ({...c, direction: 'sent'})), ...(connections.received || []).map(c => ({...c, direction: 'received'}))]
  const accepted = allConnections.filter(c => c.status === 'accepted')
  const pending = allConnections.filter(c => c.status === 'pending')

  if (loading) return (
    <DashboardLayout>
      <div className="text-gray-400 text-center py-12">Loading connections...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">My Connections</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('accepted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'accepted' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
          >
            Connected ({accepted.length})
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
          >
            Pending ({pending.length})
          </button>
        </div>

        {tab === 'accepted' && (
          <div className="space-y-3">
            {accepted.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                <p className="text-gray-400">No connections yet. Browse the alumni directory to connect!</p>
              </div>
            ) : accepted.map(c => {
              const otherUser = c.direction === 'sent' ? c.receiver : c.sender;
              return (
                <div key={c.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {otherUser?.name?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{otherUser?.name || 'Unknown'}</h3>
                      <p className="text-gray-400 text-sm">{otherUser?.designation ? `${otherUser.designation} at ${otherUser.company}` : otherUser?.department || otherUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400">{otherUser?.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleMessage(otherUser?.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message
                    </button>
                    <span className="text-green-400 text-sm font-medium">Connected</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'pending' && (
          <div className="space-y-3">
            {pending.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                <p className="text-gray-400">No pending requests.</p>
              </div>
            ) : pending.map(c => {
              const otherUser = c.direction === 'sent' ? c.receiver : c.sender;
              const isIncoming = c.direction === 'received';
              return (
                <div key={c.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {otherUser?.name?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{otherUser?.name || 'Unknown'}</h3>
                      <p className="text-gray-400 text-sm">{otherUser?.designation ? `${otherUser.designation} at ${otherUser.company}` : otherUser?.department || otherUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
                        {isIncoming ? 'Incoming' : 'Sent'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isIncoming ? (
                      <>
                        <button onClick={()=>handleRespond(c.id, 'accept')} className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition">Accept</button>
                        <button onClick={()=>handleRespond(c.id, 'reject')} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition">Reject</button>
                      </>
                    ) : (
                      <button onClick={()=>handleCancel(c.id)} className="px-4 py-2 text-sm bg-slate-600 hover:bg-slate-500 rounded-lg text-white font-medium transition">Cancel</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
