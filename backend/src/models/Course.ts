import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Course = sequelize.define('Course', {
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  tagline: { type: DataTypes.STRING },
  details: { type: DataTypes.TEXT },
  duration: { type: DataTypes.STRING },
  rating: { type: DataTypes.STRING },
  seoTitle: { type: DataTypes.STRING },
  seoDesc: { type: DataTypes.STRING },
  topics: { 
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('topics');
      return rawValue ? JSON.parse(rawValue as string) : [];
    },
    set(value: any) {
      this.setDataValue('topics', JSON.stringify(value));
    }
  },
  faqs: { 
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('faqs');
      return rawValue ? JSON.parse(rawValue as string) : [];
    },
    set(value: any) {
      this.setDataValue('faqs', JSON.stringify(value));
    }
  },
  emailKey: { type: DataTypes.STRING, allowNull: true },
  emailDisplayName: { type: DataTypes.STRING, allowNull: true },
  brochureUrl: { type: DataTypes.STRING, allowNull: true },
  emailTools: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('emailTools');
      return rawValue ? JSON.parse(rawValue as string) : [];
    },
    set(value: any) {
      this.setDataValue('emailTools', JSON.stringify(value));
    }
  },
  emailHighlights: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('emailHighlights');
      return rawValue ? JSON.parse(rawValue as string) : [];
    },
    set(value: any) {
      this.setDataValue('emailHighlights', JSON.stringify(value));
    }
  }
});

export default Course;
