# Alumni Connect - API Specification

## 🔌 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
All endpoints (except `/` and `/auth/*`) require:
```
Authorization: Bearer <clerk_jwt_token>
```

---

## 📋 Endpoints by Module

---

## 👤 Users Module

### GET `/users/me`
**Auth:** Required (any role)  
**Description:** Get current authenticated user

**Response (200):**
```json
{
  "id": "uuid",
  "clerkId": "clerk_userid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "company": null,
  "designation": null,
  "department": "Computer Science",
  "gradYear": 2024,
  "skills": ["React", "Node.js"],
  "profilePicture": "https://...",
  "bio": "Passionate about coding"
}
```

---

### PUT `/users/me`
**Auth:** Required (any role)  
**Description:** Update current user profile

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Updated bio",
  "skills": ["React", "TypeScript", "Node.js"],
  "company": "TechCorp",
  "designation": "Software Engineer",
  "linkedIn": "https://linkedin.com/in/johndoe"
}
```

**Response (200):** Updated user object

**Errors:**
- `400` - Validation error
- `404` - User not found
- `401` - Unauthorized

---

### GET `/users/search`
**Auth:** Required (any role)  
**Description:** Search users (students can search alumni, alumni can search students)

**Query Parameters:**
- `query` (string) - Search by name, email, company
- `department` (string) - Filter by department (optional)
- `role` (string) - Filter by role (optional)
- `page` (number) - Pagination (default 1)
- `limit` (number) - Results per page (default 10)

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Alumni Name",
      "company": "Google",
      "designation": "Senior Engineer",
      "bio": "...",
      "profilePicture": "...",
      "connectedStatus": "connected" // or "pending" or "none"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

### GET `/users/:id`
**Auth:** Required  
**Description:** Get user profile by ID

**Response (200):** User object (same as `/users/me`)

---

## 🤝 Connections Module

### POST `/connections`
**Auth:** Required (student only)  
**Description:** Send connection request

**Request Body:**
```json
{
  "receiverId": "uuid_of_alumni"
}
```

**Response (201):**
```json
{
  "id": "connection_uuid",
  "senderId": "student_uuid",
  "receiverId": "alumni_uuid",
  "status": "pending",
  "requestedAt": "2026-02-19T10:00:00Z"
}
```

**Errors:**
- `400` - Can't connect to self, already connected, etc.
- `403` - Only students can send requests
- `404` - Receiver not found

---

### GET `/connections/inbox`
**Auth:** Required (alumni only)  
**Description:** Get pending connection requests (for alumni)

**Response (200):**
```json
{
  "requests": [
    {
      "id": "uuid",
      "senderId": "student_uuid",
      "senderName": "John",
      "senderEmail": "john@example.com",
      "senderBio": "...",
      "requestedAt": "2026-02-19T10:00:00Z",
      "status": "pending"
    }
  ],
  "total": 5
}
```

---

### GET `/connections/sent`
**Auth:** Required (student only)  
**Description:** Get sent connection requests (for students)

**Response (200):**
```json
{
  "requests": [
    {
      "id": "uuid",
      "receiverId": "alumni_uuid",
      "receiverName": "Alumni",
      "receiverCompany": "Google",
      "status": "pending" // or "accepted" or "rejected"
    }
  ],
  "total": 3
}
```

---

### GET `/connections/list`
**Auth:** Required (any role)  
**Description:** Get list of accepted connections

**Response (200):**
```json
{
  "connections": [
    {
      "id": "user_uuid",
      "name": "Connected Person",
      "role": "alumni",
      "company": "TechCorp",
      "profilePicture": "..."
    }
  ],
  "total": 12
}
```

---

### PATCH `/connections/:id`
**Auth:** Required (alumni only)  
**Description:** Accept or reject connection request

**Request Body:**
```json
{
  "status": "accepted" // or "rejected"
}
```

**Response (200):** Updated connection object

**Errors:**
- `403` - Only alumni can respond
- `400` - Invalid status

---

### DELETE `/connections/:id`
**Auth:** Required  
**Description:** Remove/block a connection

**Response (204):** No content

---

## 🏆 Achievements Module

### POST `/achievements`
**Auth:** Required (alumni only)  
**Description:** Post a new achievement

**Request Body:**
```json
{
  "title": "Promoted to Senior Engineer",
  "description": "Led the redesign of payment system",
  "company": "Google",
  "date": "2026-01-15",
  "image": "base64_or_url",
  "category": "career" // or "project", "award", "other"
}
```

**Response (201):**
```json
{
  "id": "achievement_uuid",
  "authorId": "alumni_uuid",
  "title": "...",
  "approvalStatus": "pending",
  "createdAt": "2026-02-19T10:00:00Z"
}
```

**Errors:**
- `403` - Only alumni can post
- `400` - Validation error

---

### GET `/achievements`
**Auth:** Required  
**Description:** Get all approved achievements (public feed)

**Query Parameters:**
- `page` (number) - default 1
- `limit` (number) - default 20
- `category` (string) - filter by category
- `authorId` (uuid) - filter by author

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "uuid",
      "authorId": "alumni_uuid",
      "authorName": "Alumni Name",
      "title": "...",
      "description": "...",
      "company": "Google",
      "date": "2026-01-15",
      "image": "https://...",
      "createdAt": "2026-02-19T10:00:00Z"
    }
  ],
  "total": 156,
  "page": 1
}
```

---

### GET `/achievements/:id`
**Auth:** Required  
**Description:** Get single achievement details

**Response (200):** Achievement object

---

### PUT `/achievements/:id`
**Auth:** Required (author or admin)  
**Description:** Update achievement (author only)

**Request Body:** Same as POST

**Response (200):** Updated achievement

---

### DELETE `/achievements/:id`
**Auth:** Required (author or admin)  
**Description:** Delete achievement

**Response (204):** No content

---

## 💬 Chats Module

### GET `/chats/conversations`
**Auth:** Required  
**Description:** Get all conversations (with pagination + search)

**Query Parameters:**
- `page` (number) - default 1
- `search` (string) - search by participant name

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "conv_uuid",
      "participantId": "other_user_uuid",
      "participantName": "Connected Person",
      "participantRole": "alumni",
      "lastMessage": "Hey how are you?",
      "lastMessageAt": "2026-02-19T15:30:00Z",
      "unreadCount": 3
    }
  ],
  "total": 8
}
```

---

### GET `/chats/conversations/:conversationId`
**Auth:** Required  
**Description:** Get messages in a conversation

**Query Parameters:**
- `page` (number) - default 1
- `limit` (number) - default 50

**Response (200):**
```json
{
  "conversationId": "uuid",
  "messages": [
    {
      "id": "msg_uuid",
      "senderId": "user_uuid",
      "senderName": "John",
      "text": "Hello!",
      "createdAt": "2026-02-19T10:00:00Z",
      "isRead": true,
      "readAt": "2026-02-19T10:05:00Z"
    }
  ],
  "total": 245,
  "page": 1
}
```

---

### POST `/chats/messages`
**Auth:** Required  
**Description:** Send a message

**Request Body:**
```json
{
  "conversationId": "uuid",
  "text": "Hello alumni, I have a question!"
}
```

**Response (201):**
```json
{
  "id": "msg_uuid",
  "conversationId": "uuid",
  "senderId": "uuid",
  "text": "...",
  "createdAt": "2026-02-19T10:00:00Z"
}
```

**Errors:**
- `400` - No connection between users
- `400` - Empty message

---

### PATCH `/chats/messages/:id/read`
**Auth:** Required  
**Description:** Mark message as read

**Response (200):**
```json
{
  "id": "msg_uuid",
  "isRead": true,
  "readAt": "2026-02-19T10:05:00Z"
}
```

---

### DELETE `/chats/messages/:id`
**Auth:** Required (sender only)  
**Description:** Delete message

**Response (204):** No content

---

## 🛡️ Admin Module

### GET `/admin/users`
**Auth:** Required (admin only)  
**Description:** Get all users with filters

**Query Parameters:**
- `role` (string) - Filter by student/alumni/admin
- `search` (string) - Search by name/email
- `page` (number) - default 1
- `limit` (number) - default 20

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "CS",
      "createdAt": "2026-01-01T00:00:00Z",
      "status": "active" // or "blocked"
    }
  ],
  "total": 342,
  "page": 1
}
```

---

### DELETE `/admin/users/:id`
**Auth:** Required (admin only)  
**Description:** Delete user

**Response (204):** No content

---

### PATCH `/admin/users/:id/role`
**Auth:** Required (admin only)  
**Description:** Update user role

**Request Body:**
```json
{
  "role": "alumni" // or "student", "admin"
}
```

**Response (200):** Updated user object

---

### GET `/admin/achievements`
**Auth:** Required (admin only)  
**Description:** Get all achievements (including unapproved)

**Query Parameters:**
- `approvalStatus` (string) - pending/approved/rejected
- `page` (number) - default 1

**Response (200):** Array of achievements with approval status

---

### PATCH `/admin/achievements/:id/approve`
**Auth:** Required (admin only)  
**Description:** Approve achievement

**Response (200):** Updated achievement

---

### PATCH `/admin/achievements/:id/reject`
**Auth:** Required (admin only)  
**Description:** Reject achievement with optional reason

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

**Response (200):** Updated achievement

---

### DELETE `/admin/achievements/:id`
**Auth:** Required (admin only)  
**Description:** Delete achievement

**Response (204):** No content

---

### GET `/admin/chats`
**Auth:** Required (admin only)  
**Description:** Get all conversations for monitoring

**Query Parameters:**
- `page` (number) - default 1

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "participant1": { "id": "uuid", "name": "User1" },
      "participant2": { "id": "uuid", "name": "User2" },
      "lastMessage": "...",
      "messageCount": 42
    }
  ],
  "total": 156
}
```

---

### GET `/admin/chats/:conversationId`
**Auth:** Required (admin only)  
**Description:** View full chat (read-only monitoring)

**Response (200):** Array of messages in conversation

---

## 🔌 WebSocket Events (Socket.io)

### Emit Events

```javascript
// Send message (with real-time delivery)
socket.emit('message:send', {
  conversationId: 'uuid',
  text: 'Hello!'
});

// Mark as typing
socket.emit('message:typing', {
  conversationId: 'uuid'
});

// Mark as read
socket.emit('message:read', {
  conversationId: 'uuid',
  messageId: 'msg_uuid'
});
```

### Listen Events

```javascript
// Receive new message
socket.on('message:receive', (data) => {
  console.log('New message:', data);
});

// See user typing
socket.on('user:typing', (data) => {
  console.log(`${data.userName} is typing...`);
});

// Connection request received (for alumni)
socket.on('connection:request', (data) => {
  console.log('New request from:', data.senderName);
});

// Achievement posted
socket.on('achievement:posted', (data) => {
  console.log('New achievement:', data);
});
```

---

## 🧪 Example cURL Commands

### Send Connection Request (as Student)
```bash
curl -X POST http://localhost:5000/api/connections \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "alumni-uuid"
  }'
```

### Post Achievement (as Alumni)
```bash
curl -X POST http://localhost:5000/api/achievements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Promotion",
    "description": "...",
    "company": "Google",
    "category": "career"
  }'
```

### Approve Achievement (as Admin)
```bash
curl -X PATCH http://localhost:5000/api/admin/achievements/uuid/approve \
  -H "Authorization: Bearer <admin-token>"
```

---

## 📊 HTTP Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content (deleted)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate connection)
- `500` - Server Error

---

**Last Updated:** February 19, 2026
