import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import api from '../../api/api'

export default function StudentDashboard(){
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ connections: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, connRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/connections')
        ]);
        setProfile(profileRes.data);
        const accepted = [...(connRes.data.sent || []), ...(connRes.data.received || [])].filter(c => c.status === 'accepted');
        const pending = [...(connRes.data.sent || []), ...(connRes.data.received || [])].filter(c => c.status === 'pending');
        setStats({ connections: accepted.length, pending: pending.length });
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <DashboardLayout role="student">
      <div className="text-gray-400 text-center py-12">Loading dashboard...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="student">
      <div>
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.name || user?.firstName || 'Student'}!</h1>
          <p className="text-gray-400">{profile?.department || 'Department not set'} &bull; Class of {profile?.gradYear || 'N/A'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-indigo-400 text-sm font-medium mb-1">Active Connections</div>
            <div className="text-3xl font-bold text-white">{stats.connections}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-yellow-400 text-sm font-medium mb-1">Pending Requests</div>
            <div className="text-3xl font-bold text-white">{stats.pending}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-cyan-400 text-sm font-medium mb-1">Your Skills</div>
            <div className="text-3xl font-bold text-white">{profile?.skills?.length || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/student/alumni" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition group">
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">Browse Alumni</h3>
            <p className="text-gray-400 text-sm mt-1">Discover alumni from top companies and connect with them.</p>
          </Link>
          <Link to="/student/connections" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition group">
            <div className="text-2xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition">My Connections</h3>
            <p className="text-gray-400 text-sm mt-1">View and manage your connection requests and contacts.</p>
          </Link>
          <Link to="/student/chat" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition group">
            <div className="text-2xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">Start Chat</h3>
            <p className="text-gray-400 text-sm mt-1">Chat in real-time with your connected alumni mentors.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
