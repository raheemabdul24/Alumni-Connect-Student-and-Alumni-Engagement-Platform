# Alumni Connect - Project Structure

## 📁 Full Directory Tree

```
alumni-connect/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # Sequelize PostgreSQL connection
│   │   │
│   │   ├── models/
│   │   │   ├── user.js                  # User (student/alumni/admin)
│   │   │   ├── connection.js            # Connection requests between users
│   │   │   ├── achievement.js           # Alumni achievements/posts
│   │   │   ├── conversation.js          # Chat conversation threads
│   │   │   ├── message.js               # Chat messages
│   │   │   └── index.js                 # Model associations
│   │   │
│   │   ├── controllers/
│   │   │   ├── userController.js        # User profile, role sync
│   │   │   ├── connectionController.js  # Send/accept/reject requests
│   │   │   ├── achievementController.js # Post/view achievements
│   │   │   ├── chatController.js        # Conversation & message CRUD
│   │   │   └── adminController.js       # User/content moderation
│   │   │
│   │   ├── routes/
│   │   │   ├── users.js                 # GET/PUT /api/users/*
│   │   │   ├── connections.js           # POST/PATCH /api/connections/*
│   │   │   ├── achievements.js          # POST/GET /api/achievements/*
│   │   │   ├── chats.js                 # GET/POST /api/chats/*
│   │   │   ├── admin.js                 # GET/DELETE /api/admin/*
│   │   │   └── index.js                 # Router aggregation
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.js                  # Clerk JWT + DB user sync
│   │   │   ├── rbac.js                  # Role-based access (permit)
│   │   │   ├── validate.js              # Joi schema validation
│   │   │   ├── errorHandler.js          # Global error middleware
│   │   │   └── clerk.js                 # Clerk webhook handler (optional)
│   │   │
│   │   ├── validators/
│   │   │   ├── connectionValidator.js   # Connection request schemas
│   │   │   ├── achievementValidator.js  # Achievement post schemas
│   │   │   └── chatValidator.js         # Message schemas
│   │   │
│   │   └── server.js                    # Express app, Socket.io, Sequelize sync
│   │
│   ├── .env                             # Database, Clerk keys (local only)
│   ├── .env.example                     # Template for .env
│   ├── package.json                     # Dependencies, scripts
│   ├── demo.sh                          # Example curl commands
│   └── README.md                        # Backend setup guide
│
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js                   # Axios instance + interceptor setup
│   │   │   ├── useSetupApiAuth.js       # Hook to inject Clerk tokens
│   │   │   ├── users.js                 # User API service
│   │   │   ├── connections.js           # Connection API service
│   │   │   ├── achievements.js          # Achievement API service
│   │   │   └── chats.js                 # Chat API service
│   │   │
│   │   ├── components/
│   │   │   ├── Landing.jsx              # Public home page
│   │   │   ├── AuthStub.jsx             # DEPRECATED (replaced by Clerk UI)
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   └── DashboardLayout.jsx  # Navbar + sidebar + slot
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx # Student hub + connections/achievements
│   │   │   │   └── StudentProfile.jsx   # Student profile edit form
│   │   │   │
│   │   │   ├── alumni/
│   │   │   │   ├── AlumniDashboard.jsx  # Alumni hub + request mgmt
│   │   │   │   ├── AlumniProfile.jsx    # Alumni profile edit
│   │   │   │   └── PostAchievement.jsx  # Achievement form
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx   # Admin overview
│   │   │   │   ├── ManageUsers.jsx      # User list + delete
│   │   │   │   ├── ManageAchievements.jsx # Achievement moderation
│   │   │   │   └── ChatMonitor.jsx      # Chat viewing
│   │   │   │
│   │   │   ├── connections/
│   │   │   │   ├── ConnectionsPanel.jsx # View/send connection requests
│   │   │   │   └── AlumniDirectory.jsx  # Search alumni
│   │   │   │
│   │   │   ├── achievements/
│   │   │   │   └── AchievementsPanel.jsx # View achievements feed
│   │   │   │
│   │   │   └── chat/
│   │   │       ├── ChatWindow.jsx       # Message list + input
│   │   │       ├── ChatPanel.jsx        # Conversation list
│   │   │       └── ChatBubble.jsx       # Styled message bubble
│   │   │
│   │   ├── App.jsx                      # Routes + Clerk guards
│   │   ├── main.jsx                     # React entry + ClerkProvider
│   │   ├── config.js                    # App config (API base, etc)
│   │   └── index.css                    # Global styles
│   │
│   ├── .env                             # Clerk publishable key
│   ├── .env.example                     # Template
│   ├── package.json                     # Dependencies
│   ├── vite.config.js                   # Vite config
│   ├── tailwind.config.cjs              # Tailwind dark theme
│   ├── postcss.config.cjs               # PostCSS plugins
│   ├── index.html                       # HTML entry (dark mode class)
│   ├── README.md                        # Frontend setup guide
│   └── public/                          # Static assets (favicon, etc)
│
│
├── docker-compose.yml                   # PostgreSQL + optional redis
├── .gitignore                           # Node modules, env files
├── PROJECT_STRUCTURE.md                 # This file
├── DATABASE_SCHEMA.md                   # DB models and relationships
├── CLERK_CONFIG.md                      # Clerk setup & role sync
├── COMPONENT_TREE.md                    # React routing & hierarchy
├── API_SPEC.md                          # Endpoint docs
└── README.md                            # Project overview
```

---

## 🗂️ Key Directories Explained

### `/server/src/models`
**Purpose:** Sequelize ORM definitions for all DB tables.

- **User:** Stores clerkId, name, email, role (student/alumni/admin), skills, company, etc.
- **Connection:** Tracks sender → receiver connection requests + status (pending/accepted/rejected).
- **Achievement:** Alumni posts (title, desc, company, date, image).
- **Conversation:** Thread containing multiple messages; has 2 participants.
- **Message:** Individual text messages linked to a Conversation.

### `/server/src/controllers`
**Purpose:** Business logic for each entity.
- Validate requests
- Call models
- Format responses
- Handle errors

### `/server/src/routes`
**Purpose:** HTTP endpoint definitions.
- Map URLs to controllers
- Apply middlewares (auth, RBAC, validation)
- Example: `POST /api/connections → requireAuth → permit(['student']) → validate → send`

### `/client/src/components`
**Purpose:** React functional components using hooks (Clerk, Router, custom).

**Structure:**
- **Public:** `Landing.jsx`
- **Authenticated (guarded by Clerk):** Dashboards, Chat, etc.
- **Role-based:** Student, Alumni, Admin sub-folders with role-specific UI

### `/client/src/api`
**Purpose:** Axios HTTP client + interceptors for auto token injection.

- Defines service functions
- Handles requests/responses
- Includes error handling

---

## 🚀 How They Connect

1. **User lands on** `http://localhost:5173` → Sees `Landing.jsx` (public)
2. **Clicks "Sign In"** → Clerk UI modal (email/Google)
3. **After auth**, Clerk token is generated
4. **Frontend calls** `/api/users/me` (with Bearer token)
5. **Backend** `auth.js` verifies token → finds/creates local User → attaches role to `req.user`
6. **Frontend** checks `user.role` → routes to correct Dashboard (Student/Alumni/Admin)
7. **Each page** calls APIs → backend handles RBAC + validation → returns data
8. **Chat works** via Socket.io real-time bidirectional messaging

---

## 📝 Environment Files

### Server `.env`
```bash
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alumni_connect
DB_USER=postgres
DB_PASSWORD=root123
JWT_SECRET=supersecretkey
CLERK_SECRET_KEY=sk_test_xxxxx
```

### Client `.env`
```bash
VITE_API_BASE=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## 🔄 Data Flow Example: Send Connection Request

1. **Frontend** (Student): Click "Connect" on alumni profile
2. **API call**: `POST /api/connections` with `{ receiverId: alumni.id }` + Bearer token
3. **Middleware chain:**
   - `requireAuth` → verifies token + loads user
   - `permit(['student'])` → checks role is 'student'
   - `validate(schema)` → checks receiverId exists
4. **Controller** (`connectionController.js`): 
   - Creates Connection row (sender=req.user.id, receiver=receiverId, status='pending')
   - Socket.io emits notification to alumni (if online)
5. **Frontend** (Alumni): Receives real-time notification + sees request in dashboard
6. **Alumni** clicks "Accept":
   - `PATCH /api/connections/:id` with `{ status: 'accepted' }`
   - Chat is enabled for both users
   - Socket.io notifies student

---

## 🎯 Next Steps (If Starting Fresh)

1. ✅ **Folder structure** created (this doc)
2. ✅ **Database schema** defined (see `DATABASE_SCHEMA.md`)
3. ✅ **Clerk sync** implemented (auth.js updated)
4. ⏳ **Routes** need Clerk role metadata setup
5. ⏳ **Admin role** needs custom claim in Clerk
6. ⏳ **Tests** (Jest + Supertest for backend; Vitest + RTL for frontend)
7. ⏳ **Deployment** (Docker, CI/CD, cloud hosting)

---

**Last Updated:** February 19, 2026
