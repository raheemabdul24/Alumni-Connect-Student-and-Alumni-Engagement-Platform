const dotenv = require('dotenv');
dotenv.config();
const { sequelize, User, Connection, Achievement, Conversation, Message } = require('./src/models');

const TEST_USERS = [
  // =================== STUDENTS ===================
  {
    clerkId: 'clerk_student_1',
    name: 'Raj Kumar',
    email: 'raj.kumar@college.edu',
    role: 'student',
    verified: true,
    department: 'Computer Science',
    gradYear: 2026,
    skills: ['JavaScript', 'React', 'Node.js'],
    bio: 'Passionate about web development and AI. Looking for mentorship from industry professionals.',
    profilePicture: null
  },
  {
    clerkId: 'clerk_student_2',
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    role: 'student',
    verified: true,
    department: 'Electronics & Communication',
    gradYear: 2027,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
    bio: 'ML enthusiast and aspiring data scientist. Interested in deep learning research.',
    profilePicture: null
  },
  {
    clerkId: 'clerk_student_3',
    name: 'Arjun Patel',
    email: 'arjun.patel@college.edu',
    role: 'student',
    verified: true,
    department: 'Mechanical Engineering',
    gradYear: 2026,
    skills: ['CAD', 'SOLIDWORKS', 'Robotics', '3D Printing'],
    bio: 'Design engineer interested in robotics and automation. Building cool stuff!',
    profilePicture: null
  },

  // =================== ALUMNI ===================
  {
    clerkId: 'clerk_alumni_1',
    name: 'Ananya Singh',
    email: 'ananya.singh@google.com',
    role: 'alumni',
    verified: true,
    company: 'Google',
    designation: 'Senior Software Engineer',
    department: 'Computer Science',
    gradYear: 2020,
    linkedIn: 'https://linkedin.com/in/ananya-singh',
    skills: ['Go', 'Kubernetes', 'Distributed Systems', 'Cloud'],
    bio: 'Working on Google Cloud infrastructure. 5+ years experience. Love mentoring juniors from our college!',
    profilePicture: null
  },
  {
    clerkId: 'clerk_alumni_2',
    name: 'Vikram Desai',
    email: 'vikram.desai@microsoft.com',
    role: 'alumni',
    verified: true,
    company: 'Microsoft',
    designation: 'Tech Lead',
    department: 'Computer Science',
    gradYear: 2018,
    linkedIn: 'https://linkedin.com/in/vikram-desai',
    skills: ['C#', 'Azure', 'Cloud Architecture', '.NET', 'Leadership'],
    bio: 'Leading a team of 15+ engineers at Microsoft Azure. Happy to discuss tech careers and interview prep.',
    profilePicture: null
  },
  {
    clerkId: 'clerk_alumni_3',
    name: 'Neha Gupta',
    email: 'neha.gupta@amazon.com',
    role: 'alumni',
    verified: true,
    company: 'Amazon',
    designation: 'Principal Engineer',
    department: 'Electronics & Communication',
    gradYear: 2016,
    linkedIn: 'https://linkedin.com/in/neha-gupta',
    skills: ['Java', 'AWS', 'Microservices', 'System Design', 'Architecture'],
    bio: 'Building scalable systems at Amazon for 8+ years. Expert in system design and distributed architecture.',
    profilePicture: null
  },

  // =================== ADMINS ===================
  {
    clerkId: 'clerk_admin_1',
    name: 'Dr. Ramesh Verma',
    email: 'admin@college.edu',
    role: 'admin',
    verified: true,
    department: 'Administration',
    bio: 'Platform administrator and college placement coordinator.',
    profilePicture: null
  },
  {
    clerkId: 'clerk_admin_2',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@college.edu',
    role: 'admin',
    verified: true,
    department: 'Administration',
    bio: 'Content moderator and student affairs coordinator.',
    profilePicture: null
  },
  {
    clerkId: 'clerk_admin_3',
    name: 'Amit Joshi',
    email: 'amit.joshi@college.edu',
    role: 'admin',
    verified: true,
    department: 'IT Support',
    bio: 'Technical support and user management admin.',
    profilePicture: null
  }
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Drop all tables and recreate (force: true drops everything)
    await sequelize.sync({ force: true });
    console.log('✅ Database reset — all old data deleted, tables recreated');

    // Create users
    const createdUsers = await User.bulkCreate(TEST_USERS);
    console.log(`✅ Created ${createdUsers.length} test users`);

    // Map users by role
    const students = createdUsers.filter(u => u.role === 'student');
    const alumni = createdUsers.filter(u => u.role === 'alumni');
    const admins = createdUsers.filter(u => u.role === 'admin');

    // =================== CONNECTIONS ===================
    // Student 1 (Raj) → Alumni 1 (Ananya at Google) — ACCEPTED
    await Connection.create({ senderId: students[0].id, receiverId: alumni[0].id, status: 'accepted' });
    // Student 1 (Raj) → Alumni 2 (Vikram at Microsoft) — ACCEPTED
    await Connection.create({ senderId: students[0].id, receiverId: alumni[1].id, status: 'accepted' });
    // Student 2 (Priya) → Alumni 3 (Neha at Amazon) — ACCEPTED
    await Connection.create({ senderId: students[1].id, receiverId: alumni[2].id, status: 'accepted' });
    // Student 2 (Priya) → Alumni 1 (Ananya at Google) — PENDING
    await Connection.create({ senderId: students[1].id, receiverId: alumni[0].id, status: 'pending' });
    // Student 3 (Arjun) → Alumni 2 (Vikram at Microsoft) — PENDING
    await Connection.create({ senderId: students[2].id, receiverId: alumni[1].id, status: 'pending' });
    // Alumni 3 (Neha) → Alumni 1 (Ananya) — ACCEPTED (alumni-to-alumni)
    await Connection.create({ senderId: alumni[2].id, receiverId: alumni[0].id, status: 'accepted' });

    console.log('✅ Created 6 connections (3 accepted, 2 pending, 1 alumni-to-alumni)');

    // =================== ACHIEVEMENTS ===================
    await Achievement.bulkCreate([
      {
        userId: alumni[0].id,
        title: 'Promoted to Senior Software Engineer at Google',
        description: 'After 3 years of dedicated work on Google Cloud Platform, I was promoted to Senior Software Engineer. Led the migration of critical services to new microservices architecture serving 10M+ daily requests.',
        company: 'Google',
        date: new Date('2025-06-15'),
        category: 'career',
        approvalStatus: 'approved'
      },
      {
        userId: alumni[1].id,
        title: 'Led Azure DevOps Product Launch',
        description: 'Successfully launched a new Azure DevOps feature used by 50K+ enterprise teams worldwide. Managed cross-functional collaboration with 4 teams across 3 time zones.',
        company: 'Microsoft',
        date: new Date('2025-09-01'),
        category: 'project',
        approvalStatus: 'approved'
      },
      {
        userId: alumni[2].id,
        title: 'AWS Hero Recognition Award',
        description: 'Recognized as an AWS Hero for contributions to open-source serverless architecture patterns. Published 3 papers on distributed systems optimization.',
        company: 'Amazon',
        date: new Date('2025-11-20'),
        category: 'award',
        approvalStatus: 'approved'
      },
      {
        userId: alumni[0].id,
        title: 'Mentored 10 Junior Engineers',
        description: 'Successfully mentored 10 newly hired engineers over 6 months. All achieved their promotion targets within 18 months. Created an internal mentoring playbook now used by 200+ mentors.',
        company: 'Google',
        date: new Date('2026-01-10'),
        category: 'other',
        approvalStatus: 'approved'
      },
      {
        userId: alumni[1].id,
        title: 'Open Source Contribution — .NET Foundation',
        description: 'Contributed major performance improvements to the .NET runtime, reducing GC pauses by 30% for high-throughput applications. Merged into .NET 9.',
        company: 'Microsoft',
        date: new Date('2025-08-05'),
        category: 'project',
        approvalStatus: 'pending'
      }
    ]);
    console.log('✅ Created 5 achievements (4 approved, 1 pending)');

    // =================== CONVERSATIONS & MESSAGES ===================
    // Conversation: Raj ↔ Ananya (connected)
    const convo1 = await Conversation.create({ participantA: students[0].id, participantB: alumni[0].id });
    await Message.bulkCreate([
      { conversationId: convo1.id, senderId: students[0].id, content: 'Hi Ananya! I am a CS student interested in Google. Can you share your experience?', read: true },
      { conversationId: convo1.id, senderId: alumni[0].id, content: 'Hey Raj! Sure, I would love to help. What specifically would you like to know?', read: true },
      { conversationId: convo1.id, senderId: students[0].id, content: 'I want to know about the interview process and what skills to focus on.', read: true },
      { conversationId: convo1.id, senderId: alumni[0].id, content: 'Focus on DSA, system design, and behavioral rounds. LeetCode is a must. Also, build real projects to showcase.', read: true },
      { conversationId: convo1.id, senderId: students[0].id, content: 'Thank you so much! This is really helpful.', read: false },
    ]);

    // Conversation: Raj ↔ Vikram (connected)
    const convo2 = await Conversation.create({ participantA: students[0].id, participantB: alumni[1].id });
    await Message.bulkCreate([
      { conversationId: convo2.id, senderId: students[0].id, content: 'Hello Vikram sir, I am interested in cloud computing careers. Any advice?', read: true },
      { conversationId: convo2.id, senderId: alumni[1].id, content: 'Hi Raj! Cloud is a great field. Start with Azure or AWS certifications. I can share study resources.', read: true },
      { conversationId: convo2.id, senderId: students[0].id, content: 'That would be amazing! I am starting with Azure fundamentals.', read: false },
    ]);

    // Conversation: Priya ↔ Neha (connected)
    const convo3 = await Conversation.create({ participantA: students[1].id, participantB: alumni[2].id });
    await Message.bulkCreate([
      { conversationId: convo3.id, senderId: students[1].id, content: 'Namaste Neha mam! I am a ML student. Your AWS Hero achievement is inspiring!', read: true },
      { conversationId: convo3.id, senderId: alumni[2].id, content: 'Thank you Priya! ML and cloud together are very powerful. Are you exploring any specific ML domains?', read: true },
      { conversationId: convo3.id, senderId: students[1].id, content: 'I am working on NLP and transformer models right now. Planning to deploy on AWS SageMaker.', read: true },
      { conversationId: convo3.id, senderId: alumni[2].id, content: 'Perfect combination! I can introduce you to our ML team. They are looking for interns.', read: false },
    ]);

    console.log('✅ Created 3 conversations with 12 messages');

    // =================== PRINT CREDENTIALS ===================
    console.log('\n' + '='.repeat(80));
    console.log('                    TEST CREDENTIALS FOR LOGIN');
    console.log('='.repeat(80));

    console.log('\n  NOTE: These are DATABASE records. To login via Clerk,');
    console.log('  create accounts in Clerk with these emails. The system');
    console.log('  will auto-match by email on first login.\n');

    console.log('  STUDENTS:');
    students.forEach(s => {
      console.log(`    Name: ${s.name}  |  Email: ${s.email}  |  Dept: ${s.department}  |  Year: ${s.gradYear}`);
    });

    console.log('\n  ALUMNI:');
    alumni.forEach(a => {
      console.log(`    Name: ${a.name}  |  Email: ${a.email}  |  Company: ${a.company}  |  Role: ${a.designation}`);
    });

    console.log('\n  ADMINS:');
    admins.forEach(ad => {
      console.log(`    Name: ${ad.name}  |  Email: ${ad.email}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('  DATABASE SUMMARY:');
    console.log(`    Users:         ${createdUsers.length} (${students.length} students, ${alumni.length} alumni, ${admins.length} admins)`);
    console.log(`    Connections:   6 (3 accepted, 2 pending, 1 alumni-to-alumni)`);
    console.log(`    Achievements:  5 (4 approved, 1 pending)`);
    console.log(`    Conversations: 3 with 12 messages`);
    console.log('='.repeat(80));

    console.log('\n✅ Database seeding complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
