import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  trackingId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bankRefNo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  courseSlug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Success', 'Failure', 'Aborted'),
    defaultValue: 'Pending',
    allowNull: false
  },
  screenshotUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMode: {
    type: DataTypes.STRING,
    defaultValue: 'ONLINE',
    allowNull: false
  },
  failureMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Payment;
