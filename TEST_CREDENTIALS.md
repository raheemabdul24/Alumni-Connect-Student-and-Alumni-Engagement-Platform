# 🧪 Alumni Connect - Test Credentials & Setup Guide

## Overview
This document provides all test users and credentials for the Alumni Connect platform. Use these accounts to verify all features are working correctly.

---

## 📋 Test Users Summary

### Password for ALL Test Users
```
Password: password123
```

> **NOTE:** Due to Clerk authentication, you'll use these emails to sign up via the Clerk UI. The seed script pre-creates user records in the database, and the auth middleware automatically syncs them on first login.

---

## 👥 Test User Accounts

### 🎓 Students (3 Users)

#### 1. Student 1 - Raj Kumar
- **Email:** `student1@alumni.test`
- **Department:** Computer Science
- **Graduation Year:** 2024
- **Skills:** JavaScript, React, Node.js
- **Bio:** Passionate about web development and AI

#### 2. Student 2 - Priya Sharma
- **Email:** `student2@alumni.test`
- **Department:** Electronics & Communication
- **Graduation Year:** 2025
- **Skills:** Python, Machine Learning, TensorFlow
- **Bio:** ML enthusiast and data scientist

#### 3. Student 3 - Arjun Patel
- **Email:** `student3@alumni.test`
- **Department:** Mechanical Engineering
- **Graduation Year:** 2023
- **Skills:** CAD, SOLIDWORKS, Thermodynamics
- **Bio:** Design engineer interested in robotics

**Student Dashboard Features:**
- View and edit profile (skills, department, graduation year)
- Search and connect with alumni
- View accepted connections
- Chat with connected alumni
- View approved achievements from alumni

---

### 👨‍💼 Alumni (3 Users)

#### 1. Alumni 1 - Ananya Singh
- **Email:** `alumni1@alumni.test`
- **Company:** Google
- **Designation:** Senior Software Engineer
- **LinkedIn:** https://linkedin.com/in/ananya-singh
- **Skills:** Go, Kubernetes, Distributed Systems
- **Bio:** Working on Google Cloud infrastructure. Open to mentoring juniors.

#### 2. Alumni 2 - Vikram Desai
- **Email:** `alumni2@alumni.test`
- **Company:** Microsoft
- **Designation:** Tech Lead
- **LinkedIn:** https://linkedin.com/in/vikram-desai
- **Skills:** C#, Azure, Cloud Architecture
- **Bio:** Leading a team of 15+ engineers at Microsoft. Happy to discuss tech careers.

#### 3. Alumni 3 - Neha Gupta
- **Email:** `alumni3@alumni.test`
- **Company:** Amazon
- **Designation:** Principal Engineer
- **LinkedIn:** https://linkedin.com/in/neha-gupta
- **Skills:** Java, AWS, Microservices, System Design
- **Bio:** Passionate about building scalable systems. Love connecting with alumni community.

**Alumni Dashboard Features:**
- View and edit profile (company, designation, LinkedIn, skills)
- Accept/reject connection requests from students
- Post achievements (awaiting admin approval)
- Chat with connected students
- View approved achievements

---

### 🔐 Admins (3 Users)

#### 1. Admin User 1
- **Email:** `admin1@alumni.test`
- **Role:** Platform Administrator
- **Responsibilities:** General platform management

#### 2. Admin User 2
- **Email:** `admin2@alumni.test`
- **Role:** Content Moderator
- **Responsibilities:** Achievement approval/rejection

#### 3. Admin User 3
- **Email:** `admin3@alumni.test`
- **Role:** User Support
- **Responsibilities:** User management and support

**Admin Dashboard Features:**
- **Manage Users:** View all users, change roles, delete accounts
- **Manage Achievements:** Approve/reject pending achievements, delete inappropriate content
- **Chat Monitor:** View all conversations, monitor for issues, delete conversations if needed

---

## 🚀 How to Use Test Accounts

### Step 1: Run Database Seed Script
From the server directory, run the seed script to populate test users:

```bash
cd z:\batches\server
npm run seed
```

or directly:

```bash
node seed.js
```

This will:
- Reset the database
- Create 9 test users (3 students, 3 alumni, 3 admins)
- Create sample connections
- Create sample achievements
- Display all credentials in the console

### Step 2: Start Development Servers

**Terminal 1 - Backend (Port 5000):**
```bash
cd z:\batches\server
npm start
```

**Terminal 2 - Frontend (Port 5173):**
```bash
cd z:\batches\client
npm run dev
```

### Step 3: Visit the Application
Open your browser and navigate to:
```
http://localhost:5173
```

### Step 4: Sign Up/Sign In
1. Click "Sign Up" or "Sign In"
2. Use any of the test email addresses above
3. Set password to: `password123`
4. After sign-up, Clerk will redirect you to the dashboard

---

## ✅ Features to Test

### 🎓 Student Flow
1. ✅ Sign up as `student1@alumni.test`
2. ✅ View Student Dashboard
3. ✅ Go to Profile → Edit profile (add skills, update bio)
4. ✅ Go to Alumni Directory → Search for alumni
5. ✅ Click "Connect" on an alumni profile
6. ✅ View Connections → See pending connections
7. ✅ Accept connection when alumni reciprocates
8. ✅ Chat with connected alumni
9. ✅ View other alumni achievements

### 👨‍💼 Alumni Flow
1. ✅ Sign up as `alumni1@alumni.test`
2. ✅ View Alumni Dashboard
3. ✅ Go to Profile → Edit profile (update company, designation)
4. ✅ Go to Connections → Accept/reject student connection requests
5. ✅ Post Achievement → Create and submit an achievement
6. ✅ Chat with connected students
7. ✅ Wait for admin to approve achievement

### 🔐 Admin Flow
1. ✅ Sign up as `admin1@alumni.test`
2. ✅ View Admin Dashboard
3. ✅ Go to Manage Users:
   - Search for users by name/email
   - Filter by role (Student/Alumni/Admin)
   - Change user roles
   - Delete users (with confirmation)
4. ✅ Go to Manage Achievements:
   - View pending achievements from alumni
   - Click "Approve" to approve
   - Click "Reject" to reject
   - Click "Delete" to remove
5. ✅ Go to Chat Monitor:
   - View all conversations between users
   - Select a conversation to read messages
   - Delete conversations if needed

---

## 🔍 Testing Tips

### Test Connection Flow
1. Log in as **Student 1** → Search for **Alumni 1** → Send connection request
2. Log in as **Alumni 1** → View pending requests → Accept
3. Both can now chat with each other

### Test Achievement Workflow
1. Log in as **Alumni 2** → Post Achievement → Fill form → Submit
2. Status should be "Pending"
3. Log in as **Admin 1** → Manage Achievements → Approve the achievement
4. Log in as **Student 2** → View achievements → Should see the approved achievement

### Test Role Management
1. Log in as **Admin 1** → Manage Users → Find Student 1
2. Change role from "Student" to "Alumni"
3. Log in as that user → Should see Alumni Dashboard instead

### Test Search & Filter
- **Student Dashboard:** Search alumni by name, filter by department
- **Alumni Directory:** Search students by name
- **Admin Users:** Search by name/email, filter by role

---

## 📊 Pre-created Data

### Connections
The seed script pre-creates these connections (all **accepted**):
- Student 1 ↔ Alumni 1
- Student 1 ↔ Alumni 2
- Student 2 ↔ Alumni 2
- Student 2 ↔ Alumni 3
- Student 3 ↔ Alumni 3
- Student 3 ↔ Alumni 1

### Achievements
Three sample **approved** achievements are created:
- Alumni 1: "Got promoted to Lead" (at Google)
- Alumni 2: "Led successful product launch" (at Microsoft)
- Alumni 3: "Mentored 5 junior engineers" (at Amazon)

---

## 🆘 Troubleshooting

### Issue: "User not found" after sign-up
**Solution:** 
- The auth middleware automatically creates a user record after Clerk JWT verification
- Wait 2-3 seconds after sign-up, then refresh the page
- Check server logs to verify the user was created

### Issue: Can't sign in with test emails
**Solution:**
- Make sure the seed script has been run and database is populated
- Verify PostgreSQL is running on `localhost:5432`
- Check `.env` file credentials are correct
- Restart both server and client

### Issue: Connections don't appear
**Solution:**
- Make sure you're logged in with the correct user
- Refresh the page (connections might need a moment to sync)
- Check that the connection was actually created in the seed script

### Issue: Password doesn't work
**Solution:**
- All test users use the same password: `password123`
- If you already created the account, use Clerk's "Forgot Password" flow
- Clear browser cookies and try signing up again

### Issue: Admin pages show "Access Denied"
**Solution:**
- Make sure you're signed in as an admin user
- Admin users must have `role: "admin"` in the database
- Check the Users table in DBeaver or PostgreSQL client

---

## 📱 API Endpoints Reference

All API endpoints are automatically tested through the UI components:

### User Endpoints
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Connection Endpoints
- `GET /api/connections` - List user's connections
- `POST /api/connections` - Send connection request
- `PATCH /api/connections/:id` - Accept/reject request

### Achievement Endpoints
- `GET /api/achievements` - List achievements
- `POST /api/achievements` - Create achievement
- `GET /api/achievements/:id` - Get achievement details

### Admin Endpoints
- `GET /admin/users` - List all users (admin only)
- `DELETE /admin/users/:id` - Delete user
- `PATCH /admin/users/:id/role` - Change user role
- `GET /admin/achievements` - List achievements for moderation
- `PATCH /admin/achievements/:id/approve` - Approve achievement
- `PATCH /admin/achievements/:id/reject` - Reject achievement
- `GET /admin/conversations` - List all conversations
- `GET /admin/conversations/:id/messages` - View messages in conversation

---

## 🎯 Quick Test Checklist

```
[ ] Seed database with test users
[ ] Start backend server (port 5000)
[ ] Start frontend server (port 5173)
[ ] Student can sign up and view dashboard
[ ] Alumni can view profile and post achievements
[ ] Admin can approve achievements
[ ] Admin can manage users and roles
[ ] Students can search and connect with alumni
[ ] Connected users can send messages
[ ] Chat appears for both sender and receiver
[ ] Admin can view all conversations
[ ] Achievements appear after admin approval
```

---

## 📝 Notes

- **Email Format:** All test emails use `.test` TLD (non-real domain) to avoid accidental real user accounts
- **Password:** `password123` is used for all test accounts for simplicity
- **Clerk Integration:** Actual authentication happens through Clerk's free tier
- **Real Passwords:** In production, use strong and unique passwords for all accounts
- **Data Persistence:** The seed script runs `force: true` on Sequelize sync, meaning it resets the database. Don't run on production!

---

## 🎓 Learning Outcomes

By testing all these flows, you should verify:
1. ✅ JWT authentication and local user sync works
2. ✅ Role-based routing prevents unauthorized access
3. ✅ Profile management and data persistence
4. ✅ Connection requests and relationship tracking
5. ✅ Achievement workflow with approval process
6. ✅ Real-time chat functionality
7. ✅ Admin moderation capabilities
8. ✅ Search and filter functionality
9. ✅ Error handling and validation
10. ✅ UI/UX for all three user roles

---

**Last Updated:** January 2025
**Platform:** Alumni Connect v1.0
**Status:** Ready for Testing ✅
