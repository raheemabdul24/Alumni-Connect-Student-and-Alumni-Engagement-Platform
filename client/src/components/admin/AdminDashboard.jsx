import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/admin/stats').then(r => r.data);
        setStats(data);
      } catch (e) {
        console.error('Error loading stats:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-slate-300">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Statistics Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="text-cyan-400 text-sm font-medium">Total Students</div>
            <div className="text-2xl font-bold text-white mt-2">{stats?.totalStudents || 0}</div>
          </div>
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="text-purple-400 text-sm font-medium">Total Alumni</div>
            <div className="text-2xl font-bold text-white mt-2">{stats?.totalAlumni || 0}</div>
          </div>
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="text-green-400 text-sm font-medium">Achievements</div>
            <div className="text-2xl font-bold text-white mt-2">{stats?.totalAchievements || 0}</div>
          </div>
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-medium">Active Chats</div>
            <div className="text-2xl font-bold text-white mt-2">{stats?.totalChats || 0}</div>
          </div>
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="text-orange-400 text-sm font-medium">Connections</div>
            <div className="text-2xl font-bold text-white mt-2">{stats?.totalConnections || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/admin/users')}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 cursor-pointer transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Users</h3>
            <p className="text-slate-400 text-sm">View, search, change roles, delete users</p>
          </div>

          <div
            onClick={() => navigate('/admin/achievements')}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500 cursor-pointer transition"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Achievements</h3>
            <p className="text-slate-400 text-sm">Approve, reject, or delete achievements</p>
          </div>

          <div
            onClick={() => navigate('/admin/chat')}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-green-500 cursor-pointer transition"
          >
            <div className="text-2xl mb-2">💬</div>
            <h3 className="text-lg font-semibold text-white mb-2">Chat Monitor</h3>
            <p className="text-slate-400 text-sm">View conversations and monitor messages</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
