import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', company: '', category: 'career' });
  const [submitting, setSubmitting] = useState(false);
  const [me, setMe] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAchievements();
    api.get('/users/me').then(res => setMe(res.data)).catch(() => {});
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements');
      setAchievements(res.data.achievements || []);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('Title is required');
    setSubmitting(true);
    try {
      if (editingId) {
        // Update existing
        const res = await api.put(`/achievements/${editingId}`, form);
        setAchievements((prev) => prev.map(a => a.id === editingId ? { ...a, ...res.data } : a));
        setEditingId(null);
      } else {
        // Create new
        const res = await api.post('/achievements', form);
        setAchievements((prev) => [res.data, ...prev]);
      }
      setForm({ title: '', description: '', company: '', category: 'career' });
      setShowForm(false);
      fetchAchievements();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ach) => {
    setEditingId(ach.id);
    setForm({
      title: ach.title || '',
      description: ach.description || '',
      company: ach.company || '',
      category: ach.category || 'career',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await api.delete(`/achievements/${id}`);
      setAchievements((prev) => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', description: '', company: '', category: 'career' });
  };

  const categoryColors = {
    career: 'bg-blue-500/20 text-blue-400',
    academic: 'bg-purple-500/20 text-purple-400',
    project: 'bg-green-500/20 text-green-400',
    award: 'bg-yellow-500/20 text-yellow-400',
    other: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <button
            onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition"
          >
            {showForm ? 'Cancel' : '+ Post Achievement'}
          </button>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Achievement' : 'Post New Achievement'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Published Research Paper"
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Company / Organization</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g., Google"
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="career">Career</option>
                <option value="academic">Academic</option>
                <option value="project">Project</option>
                <option value="award">Award</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Details about your achievement..."
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Achievement' : 'Post Achievement'}
            </button>
          </div>
        )}

        {/* Achievements list */}
        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading achievements...</p>
        ) : achievements.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-gray-400">No achievements posted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((a) => (
              <div key={a.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[a.category] || categoryColors.other}`}>
                        {a.category}
                      </span>
                      {a.approvalStatus === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">Pending Review</span>
                      )}
                    </div>
                    {a.company && <p className="text-cyan-400 text-sm font-medium mb-1">{a.company}</p>}
                    <p className="text-gray-400 text-sm">{a.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      {a.author && <span>By {a.author.name}</span>}
                      <span>{new Date(a.date || a.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {/* Edit/Delete for own achievements */}
                  {me && a.userId === me.id && (
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(a)}
                        className="p-2 bg-slate-700 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-lg transition"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 bg-slate-700 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
