import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../layout/DashboardLayout';
import api from '../../api/api';

export default function AlumniProfile() {
  const { user } = useUser();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    company: '',
    designation: '',
    linkedIn: '',
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
        company: res.data.company || '',
        designation: res.data.designation || '',
        linkedIn: res.data.linkedIn || '',
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
    <DashboardLayout role="alumni">
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
                  <p className="text-slate-400 text-sm">Company</p>
                  <p className="text-white font-semibold">{profile?.company || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Designation</p>
                  <p className="text-white font-semibold">{profile?.designation || 'Not set'}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-2">Bio</p>
                <p className="text-white">{profile?.bio || 'No bio added'}</p>
              </div>

              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-2">LinkedIn</p>
                {profile?.linkedIn ? (
                  <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    {profile.linkedIn}
                  </a>
                ) : (
                  <p className="text-slate-400">Not added</p>
                )}
              </div>

              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.length ? (
                    profile.skills.map((skill, idx) => (
                      <span key={idx} className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm">
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
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold"
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
                  <label className="block text-slate-300 text-sm mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
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
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
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
