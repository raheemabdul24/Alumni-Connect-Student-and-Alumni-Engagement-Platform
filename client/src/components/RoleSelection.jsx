import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await api.patch('/users/me/role', { role: selected });
      navigate(selected === 'alumni' ? '/alumni' : '/student');
    } catch (err) {
      console.error('Failed to set role:', err);
      alert('Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'I am a current student looking to connect with alumni for mentorship, career guidance, and networking.',
      icon: '🎓',
      color: 'from-purple-500 to-indigo-600',
      border: 'border-purple-500',
    },
    {
      id: 'alumni',
      title: 'Alumni',
      description: 'I am a graduate looking to give back, share achievements, and mentor current students.',
      icon: '💼',
      color: 'from-cyan-500 to-blue-600',
      border: 'border-cyan-500',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">Welcome to Alumni Connect!</h1>
          <p className="text-gray-400 text-lg">Choose your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                selected === role.id
                  ? `${role.border} bg-slate-800/80 shadow-lg shadow-indigo-500/10 scale-[1.02]`
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/70'
              }`}
            >
              <div className="text-4xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{role.description}</p>
              {selected === role.id && (
                <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSelect}
            disabled={!selected || loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold text-lg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
          <p className="text-gray-500 text-xs mt-4">You can change this later from your profile settings</p>
        </div>
      </div>
    </div>
  );
}
