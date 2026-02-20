const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  participantA: { type: DataTypes.UUID, allowNull: false },
  participantB: { type: DataTypes.UUID, allowNull: false }
});

module.exports = Conversation;
