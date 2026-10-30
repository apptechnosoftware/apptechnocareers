import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const StudentProject = sequelize.define('StudentProject', {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  studentName: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  challengesSolved: { type: DataTypes.TEXT },
  placedCompany: { type: DataTypes.STRING },
  courseId: { type: DataTypes.STRING, allowNull: false },
  techStack: { 
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('techStack');
      return rawValue ? JSON.parse(rawValue as string) : [];
    },
    set(value: any) {
      this.setDataValue('techStack', JSON.stringify(value));
    }
  },
  liveUrl: { type: DataTypes.STRING },
  githubUrl: { type: DataTypes.STRING },
  thumbnailUrl: { type: DataTypes.STRING },
  screenshots: { 
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('screenshots');
      return rawValue ? JSON.parse(rawValue as string) : [];
    },
    set(value: any) {
      this.setDataValue('screenshots', JSON.stringify(value));
    }
  }
});

export default StudentProject;
