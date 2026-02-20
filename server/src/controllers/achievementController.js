const { Achievement, User } = require('../models');

// GET /api/achievements — list achievements (approved only for non-admin, or own)
const listAchievements = async (req, res) => {
  const { page = 1, limit = 20, userId: filterUserId } = req.query;
  const where = {};

  if (filterUserId) {
    where.userId = filterUserId;
  }

  // Non-admins only see approved achievements (or their own)
  if (req.user.role !== 'admin') {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { approvalStatus: 'approved' },
      { userId: req.user.id }
    ];
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { rows: achievements, count: total } = await Achievement.findAndCountAll({
    where,
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'company', 'designation', 'profilePicture'] }],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({ achievements, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
};

const addAchievement = async (req, res) => {
  const userId = req.user.id;
  const { title, description, date, company, category } = req.body;
  const ach = await Achievement.create({
    userId, title, description, date,
    company: company || null,
    category: category || 'other',
    approvalStatus: 'approved'
  });
  res.json(ach);
};

const editAchievement = async (req, res) => {
  const { id } = req.params;
  const ach = await Achievement.findByPk(id);
  if (!ach) return res.status(404).json({ error: 'Not found' });
  if (ach.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const allowedFields = ['title', 'description', 'date', 'company', 'category'];
  const updates = {};
  allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  await ach.update(updates);
  res.json(ach);
};

const deleteAchievement = async (req, res) => {
  const { id } = req.params;
  const ach = await Achievement.findByPk(id);
  if (!ach) return res.status(404).json({ error: 'Not found' });
  if (ach.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  await ach.destroy();
  res.json({ success: true });
};

module.exports = { listAchievements, addAchievement, editAchievement, deleteAchievement };
