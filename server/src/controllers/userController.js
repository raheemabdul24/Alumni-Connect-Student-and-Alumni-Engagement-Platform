const { User, Connection } = require('../models');
const { Op } = require('sequelize');

// GET /api/users/me  — get own profile
const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// GET /api/users/:id  — get any user's profile
const getProfile = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['clerkId'] }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// PUT /api/users/me  — update own profile
const updateProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });

  const allowedFields = ['name', 'bio', 'department', 'gradYear', 'skills',
    'company', 'designation', 'linkedIn', 'profilePicture'];
  const updates = {};
  allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  await user.update(updates);
  res.json(user);
};

// GET /api/users/search?query=&department=&company=&gradYear=&page=&limit=
const searchUsers = async (req, res) => {
  const { query, department, company, gradYear, role, page = 1, limit = 20 } = req.query;
  const where = {};

  // By default show only verified alumni for student searches
  if (role) {
    where.role = role;
  } else {
    where.role = 'alumni';
    where.verified = true;
  }

  if (query) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query}%` } },
      { company: { [Op.iLike]: `%${query}%` } },
      { email: { [Op.iLike]: `%${query}%` } }
    ];
  }
  if (department) where.department = { [Op.iLike]: `%${department}%` };
  if (company) where.company = { [Op.iLike]: `%${company}%` };
  if (gradYear) where.gradYear = parseInt(gradYear);

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { rows: users, count: total } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['clerkId'] },
    limit: parseInt(limit),
    offset,
    order: [['name', 'ASC']]
  });

  // For each user, check connection status with current user
  const userId = req.user.id;
  const enriched = await Promise.all(users.map(async (u) => {
    const uJSON = u.toJSON();
    const conn = await Connection.findOne({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: u.id },
          { senderId: u.id, receiverId: userId }
        ]
      }
    });
    uJSON.connectedStatus = conn ? conn.status : 'none';
    return uJSON;
  }));

  res.json({ users: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
};

// PATCH /api/users/me/role — set role (only for new users who haven't set it yet)
const setRole = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });

  const { role } = req.body;
  if (!['student', 'alumni'].includes(role)) {
    return res.status(400).json({ error: 'Role must be student or alumni' });
  }

  await user.update({ role, roleSelected: true });
  res.json({ message: 'Role updated', role: user.role });
};

module.exports = { getMe, getProfile, updateProfile, searchUsers, setRole };
