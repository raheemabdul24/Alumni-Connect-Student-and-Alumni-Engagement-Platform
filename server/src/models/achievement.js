const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Achievement = sequelize.define('Achievement', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  company: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE },
  category: { type: DataTypes.STRING, defaultValue: 'other' },
  approvalStatus: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'approved' },
  approvedBy: { type: DataTypes.UUID, allowNull: true }
}, {
  paranoid: true // soft deletes via deletedAt
});

module.exports = Achievement;
