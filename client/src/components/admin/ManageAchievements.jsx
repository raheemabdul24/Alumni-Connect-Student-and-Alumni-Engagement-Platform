import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function ManageAchievements() {

  const [achievements, setAchievements] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAchievements();
  }, [statusFilter, page]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('approvalStatus', statusFilter);
      params.append('page', page);
      params.append('limit', 20);

      const res = await api.get(`/admin/achievements?${params}`);
      setAchievements(res.data.achievements || []);
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (achievementId) => {
    setActionLoading(achievementId);
    try {
      await api.patch(`/admin/achievements/${achievementId}/approve`, {
        approvalStatus: 'approved',
      });
      setAchievements(prev =>
        prev.map(a =>
          a.id === achievementId ? { ...a, approvalStatus: 'approved' } : a
        )
      );
      alert('Achievement approved');
    } catch (err) {
      alert('Failed to approve: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (achievementId) => {
    setActionLoading(achievementId);
    try {
      await api.patch(`/admin/achievements/${achievementId}/reject`, {
        approvalStatus: 'rejected',
      });
      setAchievements(prev =>
        prev.map(a =>
          a.id === achievementId ? { ...a, approvalStatus: 'rejected' } : a
        )
      );
      alert('Achievement rejected');
    } catch (err) {
      alert('Failed to reject: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (achievementId) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    setActionLoading(achievementId);
    try {
      await api.delete(`/admin/achievements/${achievementId}`);
      setAchievements(prev => prev.filter(a => a.id !== achievementId));
      alert('Achievement deleted');
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Manage Achievements</h1>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="text-slate-400">Loading achievements...</div>
          ) : achievements.length === 0 ? (
            <div className="text-slate-400">No achievements found</div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:border-cyan-500 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                      <p className="text-sm text-slate-400">{achievement.author?.name} • {achievement.company}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        achievement.approvalStatus === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : achievement.approvalStatus === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {achievement.approvalStatus.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-300 mb-4">{achievement.description}</p>

                  <div className="flex gap-2">
                    {achievement.approvalStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(achievement.id)}
                          disabled={actionLoading === achievement.id}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                        >
                          {actionLoading === achievement.id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(achievement.id)}
                          disabled={actionLoading === achievement.id}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                        >
                          {actionLoading === achievement.id ? '...' : 'Reject'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      disabled={actionLoading === achievement.id}
                      className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                      {actionLoading === achievement.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
