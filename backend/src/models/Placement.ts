import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Placement = sequelize.define('Placement', {
  name: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  package: { type: DataTypes.STRING, allowNull: false },
  studentImage: { type: DataTypes.STRING, allowNull: true }
});

export default Placement;
