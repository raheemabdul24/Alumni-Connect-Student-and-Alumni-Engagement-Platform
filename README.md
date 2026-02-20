# 🎓 Alumni Connect - Full Stack Networking Platform

A complete **full-stack web application** connecting alumni with students, enabling mentorship, job opportunities, and professional networking. Built with modern technologies and production-ready architecture.

---

## 📸 Quick Overview

**Alumni Connect** is a role-based platform where:
- 🎓 **Students** can search and connect with alumni, view achievements, and get mentored
- 👨‍💼 **Alumni** can post achievements, discuss opportunities, and mentor students
- 🔐 **Admins** can moderate content, manage users, and monitor conversations

**Key Features:**
- ✅ JWT authentication via Clerk
- ✅ Real-time chat with Socket.io
- ✅ Achievement approval workflow
- ✅ Connection request system
- ✅ Advanced search & filtering
- ✅ Role-based access control
- ✅ Admin moderation tools
- ✅ Dark theme responsive UI

## Quick Start

### 1️⃣ Install & Setup (2 minutes)
```bash
# Backend dependencies
cd z:\batches\server
npm install

# Frontend dependencies  
cd z:\batches\client
npm install
```

### 2️⃣ Seed Database (1 minute)
```bash
cd z:\batches\server
npm run seed
```
Creates 9 test users and sample data.

### 3️⃣ Start Servers (simultaneous)
```bash
# Terminal 1 - Backend
cd z:\batches\server && npm start

# Terminal 2 - Frontend
cd z:\batches\client && npm run dev
```

### 4️⃣ Open Browser
```
http://localhost:5173
```

**Log in with any test email + password `password123`**

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup.

## Features

✅ **Role-Based Access** — Student, Alumni, Admin  
✅ **Connection Requests** — Send, accept, reject  
✅ **Real-Time Chat** — Socket.io integration  
✅ **Achievements** — Alumni can showcase work  
✅ **Admin Dashboard** — Manage users, approve achievements, monitor conversations  
✅ **Dark Professional UI** — Navy + slate + purple-cyan gradient  
✅ **Joi Validation** — All endpoints validated  
✅ **RBAC Middleware** — Role-based permissions  

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js + Socket.io |
| **Database** | PostgreSQL + Sequelize ORM |
| **Authentication** | Clerk JWT + Local DB sync |
| **Validation** | Joi |
| **Security** | Helmet + CORS + Rate limiting |

## Project Structure

```
alumni-connect/
├── server/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── index.html
│   └── README.md
└── README.md
```

## API Endpoints (40+)

**User Endpoints:**
```
GET    /api/users/me              # Get current user profile
PUT    /api/users/me              # Update profile
GET    /api/users                 # List all users (search)
```

**Connection Endpoints:**
```
GET    /api/connections           # Get user's connections
POST   /api/connections           # Create connection request
PATCH  /api/connections/:id       # Accept/reject
```

**Achievement Endpoints:**
```
GET    /api/achievements          # List achievements
POST   /api/achievements          # Create achievement
PATCH  /api/achievements/:id/approve  # Admin approval
```

**Chat Endpoints:**
```
GET    /api/conversations         # Get user's chats
POST   /api/conversations/:id/messages # Send message
```

**Admin Endpoints:**
```
GET    /admin/users               # List all users
DELETE /admin/users/:id           # Delete user
PATCH  /admin/users/:id/role      # Change role
GET    /admin/achievements
PATCH  /admin/achievements/:id/approve
GET    /admin/conversations
```

See [API_SPEC.md](API_SPEC.md) for complete documentation.

## Database Models

- **User** — id, clerkId, name, email, role (student/alumni/admin), company, designation, linkedIn, bio, department, gradYear, skills, profilePicture, email_verified
- **Connection** — id, senderId, receiverId, status (pending/accepted/rejected), timestamps
- **Achievement** — id, authorId, title, description, company, date, image, category, approvalStatus (pending/approved/rejected)
- **Conversation** — id, participant1Id, participant2Id, lastMessageAt, lastMessageText
- **Message** — id, conversationId, senderId, text, isRead, readAt, timestamps

## 👥 Test Users

All test users use password: `password123`

**Students:**
- student1@alumni.test (CS, 2024)
- student2@alumni.test (ECE, 2025)
- student3@alumni.test (ME, 2023)

**Alumni:**
- alumni1@alumni.test (Google, Senior Engineer)
- alumni2@alumni.test (Microsoft, Tech Lead)
- alumni3@alumni.test (Amazon, Principal Engineer)

**Admins:**
- admin1@alumni.test
- admin2@alumni.test
- admin3@alumni.test

See [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) for complete testing workflows.

## 📚 Documentation

| File | Purpose |
|------|---------|
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | 5-minute quick start |
| [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) | Test users & workflows |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Architecture details |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Models & ERD |
| [COMPONENT_TREE.md](COMPONENT_TREE.md) | React components |
| [API_SPEC.md](API_SPEC.md) | Endpoint reference |
| [CLERK_CONFIG.md](CLERK_CONFIG.md) | Auth setup |

## 🐛 Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running on `localhost:5432`
- Check `.env` file has correct database credentials
- Verify port 5000 is not in use

### Frontend won't load
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check `.env` has Clerk keys

### Database errors
- Run seed script: `npm run seed`
- Verify PostgreSQL connection
- Check `.env` DATABASE_URL

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for complete troubleshooting.

---

## 🎉 Next Steps

1. **Setup:** Follow [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
2. **Seed:** Run `npm run seed`
3. **Test:** Use credentials in [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md)
4. **Learn:** Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

**Status:** ✅ Ready for Production
**Version:** 1.0.0
**Built with React, Express, and Socket.io** ⚡
