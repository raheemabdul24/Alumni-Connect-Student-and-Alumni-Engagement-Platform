import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../../api/api'

const NAV_ITEMS = {
  student: [
    { label: 'Dashboard', path: '/student', icon: '📊' },
    { label: 'Alumni Directory', path: '/student/alumni', icon: '🔍' },
    { label: 'Connections', path: '/student/connections', icon: '🤝' },
    { label: 'Chat', path: '/student/chat', icon: '💬' },
    { label: 'Profile', path: '/student/profile', icon: '👤' },
  ],
  alumni: [
    { label: 'Dashboard', path: '/alumni', icon: '📊' },
    { label: 'Achievements', path: '/alumni/achievements', icon: '🏆' },
    { label: 'Post Achievement', path: '/alumni/post-achievement', icon: '➕' },
    { label: 'Connections', path: '/alumni/connections', icon: '🤝' },
    { label: 'Chat', path: '/alumni/chat', icon: '💬' },
    { label: 'Profile', path: '/alumni/profile', icon: '👤' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Manage Users', path: '/admin/users', icon: '👥' },
    { label: 'Achievements', path: '/admin/achievements', icon: '🏆' },
    { label: 'Chat Monitor', path: '/admin/chat', icon: '💬' },
  ]
};

export default function DashboardLayout({ children, role: propRole, title }) {
  const location = useLocation();
  const [role, setRole] = useState(propRole || null);

  useEffect(() => {
    if (!propRole) {
      // Detect role from URL
      if (location.pathname.startsWith('/admin')) setRole('admin');
      else if (location.pathname.startsWith('/alumni')) setRole('alumni');
      else setRole('student');
    }
  }, [propRole, location.pathname]);

  const items = NAV_ITEMS[role] || NAV_ITEMS.student;
  const roleLabel = role === 'admin' ? 'Admin Panel' : role === 'alumni' ? 'Alumni Portal' : 'Student Portal';

  return (
    <div className="max-w-7xl mx-auto flex gap-6 p-6 min-h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 sticky top-24">
          <div className="mb-6">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{roleLabel}</span>
          </div>
          <nav className="space-y-1">
            {items.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 min-w-0">
        {title && <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>}
        {children}
      </section>
    </div>
  )
}
