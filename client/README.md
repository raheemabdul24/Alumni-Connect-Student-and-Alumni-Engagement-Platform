# Alumni Connect — Frontend

React + Vite with Tailwind CSS dark theme and Clerk authentication.

## Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set these:
```
VITE_API_BASE=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx  # Your Clerk publishable key
```

2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

App runs on `http://localhost:5173`.

## Authentication

Uses **Clerk** for login/signup. Upon successful auth, the app:
- Stores Clerk JWT token
- Injects token into all API requests via Authorization header
- Redirects to `/sign-in` if not authenticated
- Shows `UserButton` for profile/sign-out

## Features

- **Student Dashboard**: Connections + Chat
- **Alumni Dashboard**: Achievements + Chat  
- **Admin Dashboard**: System stats & moderation
- **Dark professional UI** with purple-cyan gradient
- **Real-time chat** with Socket.io
- **Responsive** grid layouts

## Environment

```
VITE_API_BASE=http://localhost:5000/api
VITE_DEV_USER_ID=dev-user-1
VITE_DEV_USER_ROLE=student
```

Change `VITE_DEV_USER_ROLE` to `alumni` or `admin` for role testing.

## Build

```bash
npm run build
npm run preview
```
