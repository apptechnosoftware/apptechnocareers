import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Inquiry = sequelize.define('Inquiry', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  course: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false }
});

export default Inquiry;
