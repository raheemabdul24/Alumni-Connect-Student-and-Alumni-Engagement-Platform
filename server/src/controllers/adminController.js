const { User, Achievement, Connection, Conversation, Message } = require('../models');
const { Op } = require('sequelize');

// GET /api/admin/users?search=&role=&page=&limit=
const listUsers = async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const where = {};

  if (role) where.role = role;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { rows: users, count: total } = await User.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin' });
  await user.destroy();
  res.json({ success: true });
};

// POST or PATCH /api/admin/users/:id/role
const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['student', 'alumni', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  user.role = role;
  await user.save();
  res.json(user);
};

const verifyAlumni = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  user.verified = true;
  await user.save();
  res.json(user);
};

// GET /api/admin/achievements?approvalStatus=&page=&limit=
const listAllAchievements = async (req, res) => {
  const { approvalStatus, page = 1, limit = 20 } = req.query;
  const where = {};
  if (approvalStatus) where.approvalStatus = approvalStatus;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { rows: achievements, count: total } = await Achievement.findAndCountAll({
    where,
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'company', 'designation'] }],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
    paranoid: false
  });

  res.json({ achievements, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
};

// PATCH /api/admin/achievements/:id/approve
const approveAchievement = async (req, res) => {
  const ach = await Achievement.findByPk(req.params.id);
  if (!ach) return res.status(404).json({ error: 'Not found' });
  ach.approvalStatus = 'approved';
  ach.approvedBy = req.user.id;
  await ach.save();
  res.json(ach);
};

// PATCH /api/admin/achievements/:id/reject
const rejectAchievement = async (req, res) => {
  const ach = await Achievement.findByPk(req.params.id);
  if (!ach) return res.status(404).json({ error: 'Not found' });
  ach.approvalStatus = 'rejected';
  await ach.save();
  res.json(ach);
};

// DELETE /api/admin/achievements/:id
const deleteAchievement = async (req, res) => {
  const ach = await Achievement.findByPk(req.params.id);
  if (!ach) return res.status(404).json({ error: 'Not found' });
  await ach.destroy();
  res.json({ success: true });
};

// GET /api/admin/conversations?search=
const listAllConversations = async (req, res) => {
  const { search } = req.query;
  const convos = await Conversation.findAll({
    include: [
      { model: User, as: 'participant1', attributes: ['id', 'name', 'email', 'role'] },
      { model: User, as: 'participant2', attributes: ['id', 'name', 'email', 'role'] }
    ],
    order: [['updatedAt', 'DESC']]
  });

  let result = convos;
  if (search) {
    const s = search.toLowerCase();
    result = convos.filter(c =>
      c.participant1?.name?.toLowerCase().includes(s) ||
      c.participant2?.name?.toLowerCase().includes(s) ||
      c.participant1?.email?.toLowerCase().includes(s) ||
      c.participant2?.email?.toLowerCase().includes(s)
    );
  }

  // Get last message for each
  const enriched = await Promise.all(result.map(async (c) => {
    const cJSON = c.toJSON();
    const lastMsg = await Message.findOne({
      where: { conversationId: c.id },
      order: [['createdAt', 'DESC']]
    });
    cJSON.lastMessageText = lastMsg ? lastMsg.content : '';
    cJSON.lastMessageAt = lastMsg ? lastMsg.createdAt : c.createdAt;
    return cJSON;
  }));

  res.json({ conversations: enriched });
};

// GET /api/admin/conversations/:id/messages
const getConversationMessages = async (req, res) => {
  const { id } = req.params;
  const messages = await Message.findAll({
    where: { conversationId: id },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
    order: [['createdAt', 'ASC']]
  });
  res.json({ messages });
};

// DELETE /api/admin/conversations/:id
const deleteConversation = async (req, res) => {
  const convo = await Conversation.findByPk(req.params.id);
  if (!convo) return res.status(404).json({ error: 'Not found' });
  await Message.destroy({ where: { conversationId: convo.id } });
  await convo.destroy();
  res.json({ success: true });
};

// DELETE /api/admin/messages/:id
const deleteMessage = async (req, res) => {
  const msg = await Message.findByPk(req.params.id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  await msg.destroy();
  res.json({ success: true });
};

const systemStats = async (req, res) => {
  const totalStudents = await User.count({ where: { role: 'student' } });
  const totalAlumni = await User.count({ where: { role: 'alumni' } });
  const totalAchievements = await Achievement.count();
  const totalConnections = await Connection.count({ where: { status: 'accepted' } });
  const totalChats = await Conversation.count();
  const totalMessages = await Message.count();
  res.json({ totalStudents, totalAlumni, totalAchievements, totalConnections, totalChats, totalMessages });
};

module.exports = {
  listUsers, deleteUser, changeRole, verifyAlumni,
  listAllAchievements, approveAchievement, rejectAchievement, deleteAchievement,
  listAllConversations, getConversationMessages, deleteConversation, deleteMessage,
  systemStats
};
