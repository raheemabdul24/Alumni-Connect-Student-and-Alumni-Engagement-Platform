const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  clerkId: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.ENUM('student','alumni','admin'), defaultValue: 'student' },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  company: { type: DataTypes.STRING },
  designation: { type: DataTypes.STRING },
  linkedIn: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  department: { type: DataTypes.STRING },
  gradYear: { type: DataTypes.INTEGER },
  skills: { type: DataTypes.JSONB },
  profilePicture: { type: DataTypes.STRING },
  roleSelected: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
