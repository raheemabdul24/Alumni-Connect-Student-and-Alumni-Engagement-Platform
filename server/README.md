# Alumni Connect — Backend

Express.js + Sequelize backend with Clerk authentication.

## Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure these are set:
```
CLERK_SECRET_KEY=sk_test_xxxxx  # Your Clerk secret key
DB_HOST=localhost
DB_NAME=alumni_connect
DB_USER=postgres
DB_PASSWORD=root123
```

2. Install dependencies:

```bash
npm install
```

3. Ensure PostgreSQL is running at `localhost:5432`.

4. Start the server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

## Authentication

Uses **Clerk** for JWT verification. Clients must send:

```
Authorization: Bearer <clerk_token>
```

Middleware will verify token with your `CLERK_SECRET_KEY`.

### Connections
- `POST /connections` — send request
- `POST /connections/:id/respond` — accept/reject
- `GET /connections` — list accepted

### Achievements 
- `POST /achievements` — add
- `PUT /achievements/:id` — edit
- `DELETE /achievements/:id` — delete

### Chat
- `POST /chats` — send message
- `GET /chats/:conversationId` — get messages

### Admin (role=admin required)
- `GET /admin/users` — list all users
- `DELETE /admin/users/:id` — delete user
- `POST /admin/users/:id/role` — change role
- `POST /admin/users/:id/verify` — verify alumni
- `GET /admin/stats` — system stats

## Demo

Test with curl:

```bash
curl -X POST "http://localhost:5000/api/connections" \
  -H "x-user-id: student-1" \
  -H "x-user-role: student" \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"alumni-1"}'
```
