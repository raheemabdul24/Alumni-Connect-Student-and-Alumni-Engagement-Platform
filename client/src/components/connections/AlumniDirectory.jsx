import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAlumni();
  }, [search, department, company, page]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('query', search);
      if (department) params.append('department', department);
      if (company) params.append('company', company);
      params.append('page', page);
      params.append('limit', 10);

      const res = await api.get(`/users/search?${params}`);
      setAlumni(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch alumni:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (alumniId) => {
    setConnecting(alumniId);
    try {
      await api.post('/connections', { receiverId: alumniId });
      setAlumni(prev =>
        prev.map(a => a.id === alumniId ? { ...a, connectedStatus: 'pending' } : a)
      );
    } catch (err) {
      alert('Failed to send request: ' + (err.response?.data?.error || err.message));
    } finally {
      setConnecting(null);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Alumni Directory</h1>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
            <input
              type="text"
              placeholder="Filter by department..."
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
            <input
              type="text"
              placeholder="Filter by company..."
              value={company}
              onChange={(e) => { setCompany(e.target.value); setPage(1); }}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading alumni...</div>
        ) : alumni.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-gray-400">No verified alumni found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alumni.map((a) => (
              <div key={a.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex items-center justify-between hover:border-slate-600 transition">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {a.name?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white">{a.name}</h3>
                    <p className="text-cyan-400 font-medium text-sm">{a.designation || 'Alumni'} at {a.company || 'N/A'}</p>
                    <p className="text-gray-400 text-sm mt-1 truncate">{a.bio || 'No bio available'}</p>
                    {a.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {a.skills.slice(0, 4).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-700 text-gray-300 rounded-full text-xs">{s}</span>
                        ))}
                        {a.skills.length > 4 && <span className="text-gray-500 text-xs">+{a.skills.length - 4} more</span>}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(a.id)}
                  disabled={connecting === a.id || a.connectedStatus !== 'none'}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition flex-shrink-0 ml-4 ${
                    a.connectedStatus === 'none'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : a.connectedStatus === 'pending'
                      ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                      : 'bg-green-600/20 text-green-400 border border-green-600/30'
                  } disabled:opacity-60`}
                >
                  {connecting === a.id ? '...' : a.connectedStatus === 'none' ? 'Connect' : a.connectedStatus === 'pending' ? 'Pending' : 'Connected'}
                </button>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 text-sm">Previous</button>
                <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 text-sm">Next</button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
