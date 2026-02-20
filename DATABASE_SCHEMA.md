# Alumni Connect - Database Schema (Sequelize)

## 📊 Data Models & Relationships

---

## 1️⃣ User Model

**Table Name:** `Users`

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK | Unique user identifier |
| `clerkId` | STRING | UNIQUE, INDEX | Clerk authentication ID |
| `name` | STRING | NOT NULL | Full name |
| `email` | STRING | NOT NULL, UNIQUE, INDEX | Email address (login) |
| `role` | ENUM | DEFAULT 'student' | student \| alumni \| admin |
| `verified` | BOOLEAN | DEFAULT FALSE | Email verified via Clerk |
| `company` | STRING | NULLABLE | Current/past company (alumni) |
| `designation` | STRING | NULLABLE | Job title |
| `linkedIn` | STRING | NULLABLE | LinkedIn profile URL |
| `bio` | TEXT | NULLABLE | User bio/about |
| `department` | STRING | NULLABLE | College department |
| `gradYear` | INTEGER | NULLABLE | Graduation year (alumni) |
| `skills` | JSONB | NULLABLE | Array of skills: ["Node.js", "React", ...] |
| `profilePicture` | STRING | NULLABLE | S3 URL or file path |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last profile update |

**Indexes:**
- Primary: `id`
- Unique: `clerkId`, `email`
- Search: `role`, `department`, `company`, `gradYear`

---

## 2️⃣ Connection Model

**Table Name:** `Connections`
**Purpose:** Tracks connection requests between users

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK | Unique connection record |
| `senderId` | UUID | FK→User.id, NOT NULL | Student sending request |
| `receiverId` | UUID | FK→User.id, NOT NULL | Alumni receiving request |
| `status` | ENUM | DEFAULT 'pending' | pending \| accepted \| rejected |
| `requestedAt` | TIMESTAMP | DEFAULT NOW() | When request was sent |
| `respondedAt` | TIMESTAMP | NULLABLE | When alumni responded |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last status update |

**Indexes:**
- Primary: `id`
- Foreign: `senderId`, `receiverId`
- Composite: `(senderId, receiverId)` UNIQUE (prevent duplicates)
- Search: `status`, `senderId`

**Constraints:**
- `senderId ≠ receiverId` (can't connect to self)
- Unique pair (can't send 2 requests to same person)

---

## 3️⃣ Achievement Model

**Table Name:** `Achievements`
**Purpose:** Alumni posts/accomplishments to inspire students

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK | Unique achievement |
| `authorId` | UUID | FK→User.id, NOT NULL | Alumni who posted |
| `title` | STRING | NOT NULL | Achievement title |
| `description` | TEXT | NOT NULL | Detailed description |
| `company` | STRING | NULLABLE | Company where achieved |
| `date` | DATE | NULLABLE | Date of achievement |
| `image` | STRING | NULLABLE | S3 URL for proof/photo |
| `category` | STRING | DEFAULT 'other' | career \| project \| award \| other |
| `approvalStatus` | ENUM | DEFAULT 'pending' | pending \| approved \| rejected |
| `approvedBy` | UUID | FK→User.id, NULLABLE | Admin who approved |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Post date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last edit |
| `deletedAt` | TIMESTAMP | NULLABLE | Soft delete (for admins) |

**Indexes:**
- Primary: `id`
- Foreign: `authorId`, `approvedBy`
- Search: `approvalStatus`, `category`, `authorId`
- Composite: `createdAt DESC` (for feed)

---

## 4️⃣ Conversation Model

**Table Name:** `Conversations`
**Purpose:** Chat thread between two users

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK | Unique conversation |
| `participant1Id` | UUID | FK→User.id, NOT NULL | First user (always lower ID) |
| `participant2Id` | UUID | FK→User.id, NOT NULL | Second user (always higher ID) |
| `lastMessageAt` | TIMESTAMP | NULLABLE | Timestamp of last message |
| `lastMessageText` | TEXT | NULLABLE | Preview of last message |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Conversation start |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last activity |

**Indexes:**
- Primary: `id`
- Foreign: `participant1Id`, `participant2Id`
- Composite: `(participant1Id, participant2Id)` UNIQUE (one chat per pair)
- Search: `participant1Id`, `participant2Id`

**Constraints:**
- `participant1Id < participant2Id` (normalize pair ordering)

---

## 5️⃣ Message Model

**Table Name:** `Messages`
**Purpose:** Individual chat messages

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK | Unique message ID |
| `conversationId` | UUID | FK→Conversation.id, NOT NULL | Which chat thread |
| `senderId` | UUID | FK→User.id, NOT NULL | Who sent it |
| `text` | TEXT | NOT NULL | Message content |
| `isRead` | BOOLEAN | DEFAULT FALSE | Has receiver read it |
| `readAt` | TIMESTAMP | NULLABLE | When receiver read it |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Message sent time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last edit |
| `deletedAt` | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:**
- Primary: `id`
- Foreign: `conversationId`, `senderId`
- Composite: `(conversationId, createdAt DESC)` (for message history)
- Search: `isRead` (for notification queries)

---

## 🔗 Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ clerkId ✓   │
│ name        │
│ email       │
│ role        │
│ company     │
│ skills      │
└─────────────┘
       ▲                    
       │ 1:N                
       │                    
    ┌──┴──────────────────────────────┐
    │                                  │
    │                                  │
┌───┴────────────────┐      ┌──────────┴───────┐
│   Connection       │      │  Achievement    │
├────────────────────┤      ├─────────────────┤
│ id (PK)            │      │ id (PK)         │
│ senderId (FK→User) │      │ authorId (FK)   │
│ receiverId (FK)    │      │ title           │
│ status             │      │ description     │
└────────────────────┘      │ company         │
                            │ approvalStatus  │
                            └─────────────────┘

┌──────────────────────────┐
│  Conversation            │
├──────────────────────────┤
│ id (PK)                  │
│ participant1Id (FK→User) │◄─────┐
│ participant2Id (FK→User) │      │
│ lastMessageAt            │      │
└──────────────────────────┘      │
       │ 1:N                       │
       │                           │
    ┌──┴──────────────────┐        │
    │                     │        │
┌───┴──────────────────┐  │        │
│     Message          │  │        │
├──────────────────────┤  │        │
│ id (PK)              │  │        │
│ conversationId (FK)  ├──┘        │
│ senderId (FK→User)   ├───────────┘
│ text                 │
│ isRead               │
└──────────────────────┘
```

---

## 🔐 Role-Based Data Access

### Student Can:
- View own profile
- View alumni profiles
- Send connection requests
- View accepted connections + chat
- View all achievements

### Alumni Can:
- View own profile
- View profiles of connected students
- Accept/reject connection requests
- Post achievements
- View chats with connected students

### Admin Can:
- View/edit any user profile
- Delete users
- Delete achievements
- View all conversations (moderation)
- Ban users

---

## 📝 Sequelize Model Definitions

### User Model (snippet)
```javascript
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true },
  clerkId: { type: DataTypes.STRING, allowNull: true, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.ENUM('student','alumni','admin'), defaultValue: 'student' },
  company: { type: DataTypes.STRING },
  skills: { type: DataTypes.JSONB },
  // ... more fields
});
```

### Connection Model (snippet)
```javascript
const Connection = sequelize.define('Connection', {
  id: { type: DataTypes.UUID, primaryKey: true },
  senderId: { type: DataTypes.UUID, allowNull: false },
  receiverId: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.ENUM('pending','accepted','rejected'), defaultValue: 'pending' },
  // ... timestamps auto-added
});
```

---

## 🔄 Key Associations

```javascript
// In models/index.js
User.hasMany(Connection, { foreignKey: 'senderId' });
User.hasMany(Connection, { foreignKey: 'receiverId' });
Connection.belongsTo(User, { foreignKey: 'senderId' });
Connection.belongsTo(User, { foreignKey: 'receiverId' });

User.hasMany(Achievement, { foreignKey: 'authorId' });
Achievement.belongsTo(User, { foreignKey: 'authorId' });

User.hasMany(Conversation);
Conversation.belongsTo(User, { foreignKey: 'participant1Id' });
Conversation.belongsTo(User, { foreignKey: 'participant2Id' });

Conversation.hasMany(Message);
Message.belongsTo(Conversation);
Message.belongsTo(User, { foreignKey: 'senderId' });
```

---

## 🛠️ Migration Strategy

1. **Initial sync** with `sequelize.sync({ force: false })`
2. **Production:** Use migrations (e.g., Sequelize CLI) instead of sync
3. **Backup** PostgreSQL before major schema changes

---

## 📊 Sample Queries

### Get student's pending connection requests
```sql
SELECT c.* FROM Connections c
JOIN Users u ON c.receiverId = u.id
WHERE c.receiverId = :userId AND c.status = 'pending';
```

### Get all messages in a conversation (paginated)
```sql
SELECT m.* FROM Messages m
WHERE m.conversationId = :conversationId
ORDER BY m.createdAt DESC
LIMIT 50 OFFSET 0;
```

### Get alumni achievements feed
```sql
SELECT a.* FROM Achievements a
JOIN Users u ON a.authorId = u.id
WHERE u.role = 'alumni' AND a.approvalStatus = 'approved'
ORDER BY a.createdAt DESC;
```

---

**Last Updated:** February 19, 2026
