const { Conversation, Message, User, Connection } = require('../models');
const { Op } = require('sequelize');

const getOrCreateConversation = async (a, b) => {
  let convo = await Conversation.findOne({ where: { participantA: a, participantB: b } });
  if (!convo) convo = await Conversation.findOne({ where: { participantA: b, participantB: a } });
  if (!convo) convo = await Conversation.create({ participantA: a, participantB: b });
  return convo;
};

// GET /api/chats/conversations — list user's conversations
const listConversations = async (req, res) => {
  const userId = req.user.id;
  const convos = await Conversation.findAll({
    where: {
      [Op.or]: [{ participantA: userId }, { participantB: userId }]
    },
    include: [
      { model: User, as: 'participant1', attributes: ['id', 'name', 'email', 'role', 'profilePicture'] },
      { model: User, as: 'participant2', attributes: ['id', 'name', 'email', 'role', 'profilePicture'] }
    ],
    order: [['updatedAt', 'DESC']]
  });

  // Get last message for each
  const enriched = await Promise.all(convos.map(async (c) => {
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

const sendMessage = async (req, res) => {
  const sender = req.user.id;
  const { to, content } = req.body;

  // Verify connection (unless admin)
  if (req.user.role !== 'admin') {
    const conn = await Connection.findOne({
      where: {
        status: 'accepted',
        [Op.or]: [
          { senderId: sender, receiverId: to },
          { senderId: to, receiverId: sender }
        ]
      }
    });
    if (!conn) return res.status(403).json({ error: 'You must be connected to chat' });
  }

  const convo = await getOrCreateConversation(sender, to);
  const msg = await Message.create({ conversationId: convo.id, senderId: sender, content });
  await convo.update({ updatedAt: new Date() });
  res.json(msg);
};

const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  // Verify user is participant (unless admin)
  if (req.user.role !== 'admin') {
    const convo = await Conversation.findByPk(conversationId);
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    if (convo.participantA !== req.user.id && convo.participantB !== req.user.id) {
      return res.status(403).json({ error: 'Not a participant' });
    }
  }

  const messages = await Message.findAll({
    where: { conversationId },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'profilePicture'] }],
    order: [['createdAt', 'ASC']]
  });
  res.json(messages);
};

// POST /api/chats/:conversationId/messages — send message to an existing conversation
const sendMessageToConversation = async (req, res) => {
  const { conversationId } = req.params;
  const senderId = req.user.id;
  const { content } = req.body;

  const convo = await Conversation.findByPk(conversationId);
  if (!convo) return res.status(404).json({ error: 'Conversation not found' });

  // Verify user is participant (unless admin)
  if (req.user.role !== 'admin') {
    if (convo.participantA !== senderId && convo.participantB !== senderId) {
      return res.status(403).json({ error: 'Not a participant' });
    }
  }

  const msg = await Message.create({ conversationId, senderId, content });
  await convo.update({ updatedAt: new Date() });
  res.json(msg);
};

// POST /api/chats/conversations/start — get or create a conversation with a connected user
const startConversation = async (req, res) => {
  const userId = req.user.id;
  const { targetUserId } = req.body;

  if (!targetUserId) return res.status(400).json({ error: 'targetUserId is required' });
  if (userId === targetUserId) return res.status(400).json({ error: 'Cannot chat with yourself' });

  // Verify connection exists
  const conn = await Connection.findOne({
    where: {
      status: 'accepted',
      [Op.or]: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId }
      ]
    }
  });
  if (!conn) return res.status(403).json({ error: 'You must be connected to chat' });

  const convo = await getOrCreateConversation(userId, targetUserId);

  // Return enriched conversation
  const enriched = await Conversation.findByPk(convo.id, {
    include: [
      { model: User, as: 'participant1', attributes: ['id', 'name', 'email', 'role', 'profilePicture'] },
      { model: User, as: 'participant2', attributes: ['id', 'name', 'email', 'role', 'profilePicture'] }
    ]
  });

  res.json(enriched);
};

module.exports = { listConversations, sendMessage, getMessages, sendMessageToConversation, startConversation };
