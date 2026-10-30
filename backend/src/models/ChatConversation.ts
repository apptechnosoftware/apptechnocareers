import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const ChatConversation = sequelize.define('ChatConversation', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  visitorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visitorPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  lastActivity: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

export default ChatConversation;
