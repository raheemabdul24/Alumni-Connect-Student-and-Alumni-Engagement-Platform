# Alumni Connect - Clerk Configuration & Role Sync

## 🔐 Clerk Setup Guide

### 1️⃣ Create Clerk Account & Application

1. Go to **https://dashboard.clerk.com**
2. Sign up → Create organization
3. Create New Application
4. Choose authentication method: **Email + Google + GitHub** (optional)
5. Copy keys:
   - **Publishable Key** (public, for frontend)
   - **Secret Key** (private, for backend)

---

## 🗝️ Environment Variables

### Backend (`.env`)
```bash
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

### Frontend (`.env`)
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yyyyyyyyyyyyyyy
```

---

## 👥 Role Assignment Strategy

### Option 1: Manual Role Assignment (Admin Panel)

1. After student/alumni signs up via Clerk
2. Admin logs into app dashboard
3. Searches for user
4. Clicks "Change Role" → select alumni/admin
5. Backend updates local User record
6. **Pro:** Simple UI
7. **Con:** Manual, not scalable

### Option 2: Clerk Custom Claims (Recommended)

Use Clerk's metadata/custom claims to store role directly in JWT token.

#### Setup:

1. In Clerk dashboard → **Users** → any user
2. Click "Edit" → scroll to "Custom attributes"
3. Add new attribute: `role` (text field)
4. Set value: `student` | `alumni` | `admin`

#### Backend Sync (Updated auth.js):

```javascript
const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
const clerkRole = decoded.org_role || decoded.role || 'student'; // from custom claims

const [user] = await User.findOrCreate({
  where: { clerkId: decoded.sub },
  defaults: {
    clerkId: decoded.sub,
    email: decoded.email_addresses?.[0]?.email_address,
    name: decoded.name || 'Unnamed',
    role: clerkRole, // ← Use Clerk's role if available
    verified: decoded.email_verified || false
  }
});

// Sync role from Clerk if user exists
if (user.role !== clerkRole) {
  user.role = clerkRole;
  await user.save();
}

req.user = { id: user.id, clerkId: decoded.sub, role: user.role, email: user.email };
```

---

## 🎯 Frontend Role-Based Routing

### In `App.jsx`:

```javascript
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './components/student/StudentDashboard';
import AlumniDashboard from './components/alumni/AlumniDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <Loading />;

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  const role = user?.publicMetadata?.role || 'student';

  return (
    <Routes>
      {role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
      {role === 'alumni' && <Route path="/dashboard" element={<AlumniDashboard />} />}
      {role === 'admin' && (
        <>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/achievements" element={<ManageAchievements />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
```

---

## 🛡️ Backend RBAC with Roles

### Middleware: `rbac.js`

```javascript
const permit = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Required roles: ${roles.join(', ')}` });
    }
    next();
  };
};

module.exports = { permit };
```

### Usage in Routes:

```javascript
// connections.js
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/rbac');
const router = require('express').Router();

// Only students can send connection requests
router.post('/', 
  requireAuth, 
  permit('student'), 
  connectionController.sendRequest
);

// Only alumni can accept requests
router.patch('/:id', 
  requireAuth, 
  permit('alumni'), 
  connectionController.updateRequest
);

module.exports = router;
```

---

## 📲 Webhook Integration (Optional)

Sync Clerk user events to your database in real-time.

### In Clerk Dashboard:
1. Settings → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`

### Backend Handler (`server.js`):

```javascript
const express = require('express');
const { Webhook } = require('svix');
const app = express();

app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }

  const { id, type } = evt.data;

  if (type === 'user.created' || type === 'user.updated') {
    const { id: clerkId, email_addresses, first_name, last_name, public_metadata } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const role = public_metadata?.role || 'student';

    await User.upsert({
      clerkId,
      email,
      name: `${first_name} ${last_name}`,
      role,
      verified: true
    });
  }

  if (type === 'user.deleted') {
    const { id: clerkId } = evt.data;
    await User.destroy({ where: { clerkId } });
  }

  res.status(200).json({ success: true });
});
```

---

## 🚀 Production Deployment Checklist

- [ ] Set `VITE_CLERK_PUBLISHABLE_KEY` in frontend `.env`
- [ ] Set `CLERK_SECRET_KEY` in backend `.env`
- [ ] Configure Clerk allowed origins (CORS): Add your domain
- [ ] Enable email verification in Clerk dashboard
- [ ] (Optional) Set up webhook endpoint
- [ ] Test sign-up → verify role appears in token
- [ ] Test role-based routing works
- [ ] Test RBAC middleware blocks non-permitted requests

---

## 🧪 Testing Role-Based Endpoints

### As Student:

```bash
curl -X POST http://localhost:5000/api/connections \
  -H "Authorization: Bearer <student-token>" \
  -H "Content-Type: application/json" \
  -d '{ "receiverId": "alumni-uuid" }'
# ✅ Should succeed (200)
```

### As Alumni trying to send connection (should fail):

```bash
curl -X POST http://localhost:5000/api/connections \
  -H "Authorization: Bearer <alumni-token>" \
  -H "Content-Type: application/json" \
  -d '{ "receiverId": "student-uuid" }'
# ❌ Should fail (403 Forbidden)
```

### As Admin accessing user management:

```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <admin-token>"
# ✅ Should succeed (200)
```

---

## 📋 Clerk Role Metadata Template

When setting custom attributes in Clerk UI or via API:

```json
{
  "role": "student",  // or "alumni" or "admin"
  "department": "Computer Science",
  "graduated": false,
  "batch": 2024
}
```

---

## 🔗 Useful Clerk Links

- **Dashboard**: https://dashboard.clerk.com
- **Documentation**: https://clerk.com/docs
- **Custom Claims**: https://clerk.com/docs/users/metadata
- **Webhooks**: https://clerk.com/docs/webhooks/overview

---

**Last Updated:** February 19, 2026
