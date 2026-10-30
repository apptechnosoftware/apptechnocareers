import { sequelize } from './db';
import Course from './models/Course';

const dump = async () => {
  try {
    await sequelize.authenticate();
    const courses = await Course.findAll();
    console.log('Courses in DB:', JSON.stringify(courses, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

dump();
