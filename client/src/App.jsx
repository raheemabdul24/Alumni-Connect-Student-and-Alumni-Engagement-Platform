import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { SignIn, SignUp, UserButton, useUser, useAuth } from '@clerk/clerk-react'
import { setupAuthInterceptor } from './api/api'
import api from './api/api'
import Landing from './components/Landing'
import RoleSelection from './components/RoleSelection'
import StudentDashboard from './components/student/StudentDashboard'
import StudentProfile from './components/student/StudentProfile'
import AlumniDashboard from './components/alumni/AlumniDashboard'
import AlumniProfile from './components/alumni/AlumniProfile'
import PostAchievement from './components/alumni/PostAchievement'
import AdminDashboard from './components/admin/AdminDashboard'
import ManageUsers from './components/admin/ManageUsers'
import ManageAchievements from './components/admin/ManageAchievements'
import ChatMonitor from './components/admin/ChatMonitor'
import AlumniDirectory from './components/connections/AlumniDirectory'
import ConnectionsPanel from './components/connections/ConnectionsPanel'
import ChatPanel from './components/chat/ChatPanel'
import AchievementsPanel from './components/achievements/AchievementsPanel'

function RoleRedirect() {
  const [role, setRole] = useState(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get('/users/me');
        const user = res.data;
        if (!user.roleSelected) {
          setNeedsRoleSelection(true);
        } else {
          setRole(user.role);
        }
      } catch (e) {
        console.error('Failed to fetch user role:', e);
        setRole('student');
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <div className="text-white text-center py-20">Loading dashboard...</div>;
  if (needsRoleSelection) return <Navigate to="/select-role" />;
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'alumni') return <Navigate to="/alumni" />;
  return <Navigate to="/student" />;
}

export default function App() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [authSetup, setAuthSetup] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && getToken && !authSetup) {
      setupAuthInterceptor(getToken);
      setAuthSetup(true);
    }
  }, [isLoaded, isSignedIn, getToken, authSetup]);

  if (!isLoaded) return (
    <div className="app-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-lg">Loading Alumni Connect...</div>
      </div>
    </div>
  );

  return (
    <div className="app-bg min-h-screen">
      <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
        <Link to="/" className="text-white font-bold text-xl hover:text-indigo-400 transition flex items-center gap-2">
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-transparent bg-clip-text">Alumni Connect</span>
        </Link>
        <div className="space-x-4 flex items-center">
          {isSignedIn ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-300 hover:text-white transition text-sm">Home</Link>
              <Link to="/sign-in" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">Sign In</Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/sign-in/*" element={<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8"><SignIn routing="path" path="/sign-in" /></div>} />
          <Route path="/sign-up/*" element={<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></div>} />

          {/* Role selection for new users */}
          <Route path="/select-role" element={isSignedIn ? <RoleSelection /> : <Navigate to="/sign-in" />} />

          {/* Role-based redirect */}
          <Route path="/dashboard" element={isSignedIn ? <RoleRedirect /> : <Navigate to="/sign-in" />} />

          {/* Student routes */}
          <Route path="/student" element={isSignedIn ? <StudentDashboard /> : <Navigate to="/sign-in" />} />
          <Route path="/student/profile" element={isSignedIn ? <StudentProfile /> : <Navigate to="/sign-in" />} />
          <Route path="/student/alumni" element={isSignedIn ? <AlumniDirectory /> : <Navigate to="/sign-in" />} />
          <Route path="/student/connections" element={isSignedIn ? <ConnectionsPanel /> : <Navigate to="/sign-in" />} />
          <Route path="/student/chat" element={isSignedIn ? <ChatPanel /> : <Navigate to="/sign-in" />} />

          {/* Alumni routes */}
          <Route path="/alumni" element={isSignedIn ? <AlumniDashboard /> : <Navigate to="/sign-in" />} />
          <Route path="/alumni/profile" element={isSignedIn ? <AlumniProfile /> : <Navigate to="/sign-in" />} />
          <Route path="/alumni/achievements" element={isSignedIn ? <AchievementsPanel /> : <Navigate to="/sign-in" />} />
          <Route path="/alumni/post-achievement" element={isSignedIn ? <PostAchievement /> : <Navigate to="/sign-in" />} />
          <Route path="/alumni/connections" element={isSignedIn ? <ConnectionsPanel /> : <Navigate to="/sign-in" />} />
          <Route path="/alumni/chat" element={isSignedIn ? <ChatPanel /> : <Navigate to="/sign-in" />} />

          {/* Admin routes */}
          <Route path="/admin" element={isSignedIn ? <AdminDashboard /> : <Navigate to="/sign-in" />} />
          <Route path="/admin/users" element={isSignedIn ? <ManageUsers /> : <Navigate to="/sign-in" />} />
          <Route path="/admin/achievements" element={isSignedIn ? <ManageAchievements /> : <Navigate to="/sign-in" />} />
          <Route path="/admin/chat" element={isSignedIn ? <ChatMonitor /> : <Navigate to="/sign-in" />} />
        </Routes>
      </main>
    </div>
  )
}
