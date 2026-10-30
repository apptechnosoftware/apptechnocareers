import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const AdminSetting = sequelize.define('AdminSetting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default AdminSetting;
