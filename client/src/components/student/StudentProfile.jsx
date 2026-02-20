import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function StudentProfile() {
  const { user } = useUser();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    department: '',
    gradYear: new Date().getFullYear(),
    skills: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        department: res.data.department || '',
        gradYear: res.data.gradYear || new Date().getFullYear(),
        skills: res.data.skills?.join(', ') || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };
      await api.put('/users/me', payload);
      setProfile(prev => ({ ...prev, ...payload }));
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center p-8">Loading...</div>;

  return (
    <DashboardLayout role="student">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {!editing ? (
            <>
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-4"></div>
                <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                <p className="text-slate-400">{profile?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-slate-400 text-sm">Department</p>
                  <p className="text-white font-semibold">{profile?.department || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Expected Graduation</p>
                  <p className="text-white font-semibold">{profile?.gradYear || 'Not set'}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-2">Bio</p>
                <p className="text-white">{profile?.bio || 'No bio added'}</p>
              </div>

              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.length ? (
                    profile.skills.map((skill, idx) => (
                      <span key={idx} className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400">No skills added</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: parseInt(e.target.value) })}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
