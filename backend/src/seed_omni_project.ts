import { sequelize } from './db';
import StudentProject from './models/StudentProject';

const seedOmni = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Ensure the StudentProject model is synced
    await StudentProject.sync();

    // Check if the OmniRetail project is already present in the SQLite DB
    const existing = await StudentProject.findOne({
      where: { title: 'OmniRetail Predictive BI Pipeline' }
    });

    if (existing) {
      console.log('Project "OmniRetail Predictive BI Pipeline" already exists in database.');
    } else {
      console.log('Project not found in database. Inserting...');
      await StudentProject.create({
        title: 'OmniRetail Predictive BI Pipeline',
        studentName: 'Kiran Das',
        placedCompany: 'Cognizant',
        courseId: 'data',
        description: 'A comprehensive sales forecasting and inventory prediction dashboard combining SQLite, Python (pandas/NumPy), and interactive Power BI embeds to project future supply demands with high precision.',
        techStack: ['Python', 'Power BI', 'Pandas & NumPy', 'SQL', 'Excel Advanced Reporting'],
        liveUrl: 'https://omniretail-analytics.appteknow.site',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
        challengesSolved: 'Engineered ETL pipelines processing 2M+ transaction rows, optimizing SQL partition indexing and generating dynamic forecast simulations with 95.8% accuracy.',
        screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'],
        githubUrl: ''
      });
      console.log('Project successfully inserted into active SQLite database!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error inserting OmniRetail project:', err);
    process.exit(1);
  }
};

seedOmni();
