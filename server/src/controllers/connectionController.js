const { Connection, User } = require('../models');
const { Op } = require('sequelize');

const sendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;
  if (senderId === receiverId) return res.status(400).json({ error: 'Cannot connect to self' });

  // Check both directions
  const existing = await Connection.findOne({
    where: {
      [Op.or]: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }
  });
  if (existing) return res.status(400).json({ error: 'Connection request already exists' });

  const conn = await Connection.create({ senderId, receiverId });
  res.json(conn);
};

const respondRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const conn = await Connection.findByPk(id);
  if (!conn) return res.status(404).json({ error: 'Not found' });
  if (conn.receiverId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  conn.status = action === 'accept' ? 'accepted' : 'rejected';
  await conn.save();
  res.json(conn);
};

const cancelRequest = async (req, res) => {
  const { id } = req.params;
  const conn = await Connection.findByPk(id);
  if (!conn) return res.status(404).json({ error: 'Not found' });
  if (conn.senderId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  if (conn.status !== 'pending') return res.status(400).json({ error: 'Can only cancel pending requests' });
  await conn.destroy();
  res.json({ success: true });
};

const listConnections = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;
  const where = {};

  if (status) {
    where.status = status;
  }

  const sent = await Connection.findAll({
    where: { senderId: userId, ...where },
    include: [{ model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'role', 'company', 'designation', 'department', 'profilePicture'] }],
    order: [['createdAt', 'DESC']]
  });

  const received = await Connection.findAll({
    where: { receiverId: userId, ...where },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'email', 'role', 'company', 'designation', 'department', 'profilePicture'] }],
    order: [['createdAt', 'DESC']]
  });

  res.json({ sent, received });
};

module.exports = { sendRequest, respondRequest, cancelRequest, listConnections };
