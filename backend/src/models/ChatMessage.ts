import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderType: {
    type: DataTypes.STRING, // 'visitor' | 'admin'
    allowNull: false
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

export default ChatMessage;
