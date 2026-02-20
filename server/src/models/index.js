const sequelize = require('../config/db');
const User = require('./user');
const Connection = require('./connection');
const Achievement = require('./achievement');
const Conversation = require('./conversation');
const Message = require('./message');

// Associations
User.hasMany(Achievement, { foreignKey: 'userId', as: 'achievements', onDelete: 'CASCADE' });
Achievement.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(Connection, { foreignKey: 'senderId', as: 'sentConnections' });
User.hasMany(Connection, { foreignKey: 'receiverId', as: 'receivedConnections' });
Connection.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Connection.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Conversation.belongsTo(User, { foreignKey: 'participantA', as: 'participant1' });
Conversation.belongsTo(User, { foreignKey: 'participantB', as: 'participant2' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

module.exports = {
  sequelize,
  User,
  Connection,
  Achievement,
  Conversation,
  Message
};
