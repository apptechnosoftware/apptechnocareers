import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { sequelize } from './db';
import Admin from './models/Admin';

dotenv.config();

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');

    // Check if table exists and sync it
    await Admin.sync();

    // Check if admin user already exists
    const existing = await Admin.findOne({ where: { username: 'admin' } });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin@teknow2026', salt);

    if (existing) {
      console.log('Admin user "admin" already exists. Updating password to "admin@teknow2026"...');
      await Admin.update({ passwordHash }, { where: { username: 'admin' } });
      console.log('Password updated successfully!');
    } else {
      console.log('Admin user does not exist. Creating admin / admin@teknow2026...');
      await Admin.create({
        username: 'admin',
        passwordHash
      });
      console.log('Admin user created successfully!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

run();
