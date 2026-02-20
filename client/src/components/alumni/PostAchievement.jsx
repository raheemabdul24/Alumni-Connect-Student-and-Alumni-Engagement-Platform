import { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function PostAchievement() {


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    date: new Date().toISOString().split('T')[0],
    category: 'career',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/achievements', formData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        company: '',
        date: new Date().toISOString().split('T')[0],
        category: 'career',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to post achievement: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="alumni">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Post Achievement</h1>

        {success && (
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg mb-6">
            ✓ Achievement posted successfully! Awaiting admin approval.
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Promoted to Senior Engineer"
                required
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your achievement..."
                required
                rows="6"
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., Google"
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="career">Career Milestone</option>
                <option value="project">Project</option>
                <option value="award">Award</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
              <p className="text-slate-300 text-sm">
                <strong>Note:</strong> Your achievement will be reviewed by admins before appearing on the feed to ensure quality and appropriateness.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Posting...' : 'Post Achievement'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
