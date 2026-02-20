# Alumni Connect - React Component Tree & Routing

## 🌳 Component Hierarchy

```
App
├── Landing (public route)
├── Clerk Routes
│   ├── /sign-in → <SignIn />
│   └── /sign-up → <SignUp />
│
└── Protected Routes (requireAuth + role check)
    │
    ├── Student Path (role === 'student')
    │   ├── /dashboard → StudentDashboard
    │   │   ├── DashboardLayout (navbar, sidebar)
    │   │   ├── ConnectionsPanel
    │   │   │   ├── AlumniDirectory (search, list alumni)
    │   │   │   └── ConnectionRequestsInbox (sent/received)
    │   │   ├── AchievementsPanel (view feed)
    │   │   └── ChatPanel
    │   │       ├── ConversationList
    │   │       └── ChatWindow (messages + input)
    │   │
    │   ├── /profile → StudentProfile
    │   │   ├── ProfileHeader (avatar, name)
    │   │   ├── EditForm (bio, skills, department)
    │   │   └── SaveButton
    │   │
    │   └── /chat → ChatPage (full-screen chat)
    │       ├── ChatPanel (left sidebar)
    │       └── ChatWindow (main area)
    │
    ├── Alumni Path (role === 'alumni')
    │   ├── /dashboard → AlumniDashboard
    │   │   ├── DashboardLayout
    │   │   ├── ConnectionRequestsPanel (pending requests)
    │   │   │   ├── RequestCard (accept/reject buttons)
    │   │   │   └── ConnectedStudents (list)
    │   │   ├── AchievementsPanel (own posts)
    │   │   │   └── AchievementCard (edit/delete)
    │   │   └── ChatPanel
    │   │       └── ConversationList (with connected students)
    │   │
    │   ├── /profile → AlumniProfile
    │   │   ├── ProfileHeader
    │   │   ├── EditForm (company, designation, LinkedIn)
    │   │   └── SaveButton
    │   │
    │   ├── /achievements/new → PostAchievement
    │   │   ├── AchievementForm
    │   │   │   ├── TitleInput
    │   │   │   ├── DescriptionTextarea
    │   │   │   ├── CompanyInput
    │   │   │   ├── DatePicker
    │   │   │   ├── ImageUpload
    │   │   │   └── SubmitButton
    │   │   └── PreviewCard
    │   │
    │   └── /chat → ChatPage
    │
    └── Admin Path (role === 'admin')
        ├── /dashboard → AdminDashboard
        │   ├── DashboardLayout
        │   ├── Stats (total users, requests, achievements)
        │   ├── QuickActions (shortcuts to management pages)
        │   └── RecentActivity (feed)
        │
        ├── /admin/users → ManageUsers
        │   ├── UserTable
        │   │   ├── UserRow (name, email, role, status)
        │   │   ├── DeleteButton
        │   │   ├── BlockButton
        │   │   └── Edit Role Dropdown
        │   └── Filters (role, status, search)
        │
        ├── /admin/achievements → ManageAchievements
        │   ├── AchievementTable
        │   │   ├── AchievementRow (title, author, date)
        │   │   ├── ApproveButton
        │   │   ├── RejectButton
        │   │   └── DeleteButton
        │   └── Filter (pending, approved, rejected)
        │
        └── /admin/chats → ChatMonitor
            ├── ConversationList
            │   └── ConversationRow (participants, last message)
            └── ChatWindow (read-only, see full conversation)
```

---

## 📍 Route Definitions

### In `App.jsx`:

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Landing from './components/Landing';
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import AlumniDashboard from './components/alumni/AlumniDashboard';
import AlumniProfile from './components/alumni/AlumniProfile';
import PostAchievement from './components/alumni/PostAchievement';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageAchievements from './components/admin/ManageAchievements';
import ChatMonitor from './components/admin/ChatMonitor';

export default function App() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <LoadingSpinner />;

  const role = user?.publicMetadata?.role || 'student';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Protected */}
        {isSignedIn ? (
          <>
            {/* Student Routes */}
            {role === 'student' && (
              <>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/chat/*" element={<ChatPage role="student" />} />
              </>
            )}

            {/* Alumni Routes */}
            {role === 'alumni' && (
              <>
                <Route path="/dashboard" element={<AlumniDashboard />} />
                <Route path="/profile" element={<AlumniProfile />} />
                <Route path="/achievements/new" element={<PostAchievement />} />
                <Route path="/chat/*" element={<ChatPage role="alumni" />} />
              </>
            )}

            {/* Admin Routes */}
            {role === 'admin' && (
              <>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/achievements" element={<ManageAchievements />} />
                <Route path="/admin/chats" element={<ChatMonitor />} />
              </>
            )}

            {/* Fallback */}
            <Route path="/chat/*" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🧩 Key Component Patterns

### Pattern 1: Dashboard Layout Wrapper

```javascript
// DashboardLayout.jsx
import { UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700">
        <nav className="p-4 space-y-2">
          <NavItem onClick={() => navigate('/dashboard')} label="Dashboard" />
          <NavItem onClick={() => navigate('/profile')} label="Profile" />
          {role === 'alumni' && (
            <NavItem onClick={() => navigate('/achievements/new')} label="Post Achievement" />
          )}
          <NavItem onClick={() => navigate('/chat')} label="Chat" />
          {role === 'admin' && (
            <>
              <NavItem onClick={() => navigate('/admin/users')} label="Manage Users" />
              <NavItem onClick={() => navigate('/admin/achievements')} label="Manage Posts" />
              <NavItem onClick={() => navigate('/admin/chats')} label="Monitor Chats" />
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Alumni Connect</h1>
          <UserButton />
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

### Pattern 2: Loader Hook for API + Clerk

```javascript
// useSetupApiAuth.js (already created)
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setupAuthInterceptor } from './api';

export const useSetupApiAuth = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setupAuthInterceptor(getToken);
  }, [getToken]);
};
```

### Pattern 3: Protected Dashboard Component

```javascript
// StudentDashboard.jsx
import { useUser } from '@clerk/clerk-react';
import { useSetupApiAuth } from '../api/useSetupApiAuth';
import DashboardLayout from '../layout/DashboardLayout';
import ConnectionsPanel from '../connections/ConnectionsPanel';
import AchievementsPanel from '../achievements/AchievementsPanel';
import ChatPanel from '../chat/ChatPanel';

export default function StudentDashboard() {
  const { user } = useUser();
  useSetupApiAuth();

  return (
    <DashboardLayout role="student">
      <div className="grid grid-cols-3 gap-6">
        <ConnectionsPanel userId={user.id} />
        <AchievementsPanel />
        <ChatPanel />
      </div>
    </DashboardLayout>
  );
}
```

---

## 📑 File Organization

### Components Structure
```
src/components/
├── Landing.jsx
├── layout/
│   ├── DashboardLayout.jsx
│   └── Navbar.jsx
├── student/
│   ├── StudentDashboard.jsx
│   └── StudentProfile.jsx
├── alumni/
│   ├── AlumniDashboard.jsx
│   ├── AlumniProfile.jsx
│   └── PostAchievement.jsx
├── admin/
│   ├── AdminDashboard.jsx
│   ├── ManageUsers.jsx
│   ├── ManageAchievements.jsx
│   └── ChatMonitor.jsx
├── connections/
│   ├── ConnectionsPanel.jsx
│   ├── AlumniDirectory.jsx
│   └── ConnectionCard.jsx
├── achievements/
│   ├── AchievementsPanel.jsx
│   ├── AchievementCard.jsx
│   └── AchievementForm.jsx
└── chat/
    ├── ChatPage.jsx
    ├── ChatPanel.jsx
    ├── ChatWindow.jsx
    ├── ConversationList.jsx
    ├── ChatBubble.jsx
    └── MessageInput.jsx
```

---

## 🎨 UI/UX Tips

### Sidebar Navigation
- Show role-specific menu items
- Active state highlight (purple-500)
- Icons + labels for clarity

### Dark Theme Colors
- Background: `#0f172a` (slate-950)
- Cards: `#1e293b` (slate-800)
- Border: `#334155` (slate-700)
- Accent: Purple → Cyan gradient

### Component Reusability
- Create `<Card>`, `<Button>`, `<Input>` base components
- Use Tailwind utilities consistently
- Keep components under 300 lines

---

## 🔄 Data Flow Example

**Scenario:** Alumni sends achievement post

1. Alumni clicks "Post Achievement" → routes to `/achievements/new`
2. `PostAchievement` component renders form
3. User fills title, description, company, date
4. Clicks submit → calls `POST /api/achievements` with Bearer token
5. API interceptor injects token automatically
6. Backend: `requireAuth` → verifies token, syncs user → `permit(['alumni'])` → validates schema → `achievementController.create()`
7. Achievement status = "pending" (awaits admin approval)
8. Response sent back → component shows "Posted! Awaiting approval"
9. Admin dashboard shows new achievement
10. Admin approves → `PATCH /api/achievements/:id` with `approvalStatus='approved'`
11. Achievement appears on public feed

---

**Last Updated:** February 19, 2026
