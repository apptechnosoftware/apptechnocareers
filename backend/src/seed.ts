import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { sequelize } from './db';
import Admin from './models/Admin';
import Course from './models/Course';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Connecting to SQLite for Seeding...');
    await sequelize.authenticate();
    
    // force: true will drop the tables and recreate them, providing a clean slate
    await sequelize.sync({ force: true });
    console.log('Database synced (tables recreated).');

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin@teknow2026', salt);
    
    await Admin.create({
      username: 'admin',
      passwordHash
    });

    console.log('Admin user seeded (admin / admin@teknow2026)');

    // Seed Courses
    await Course.bulkCreate([
      {
        slug: 'java-training-in-bangalore-from-it-companies-with-ai-tools',
        title: 'Full Stack Java Course with AI from IT Companies Hiring you',
        tagline: 'Learn Java from IT companies live projects in 3 months & get job 100%. First time in IT education industry, Appteknow Careers is introducing On The Job Training model.',
        details: 'In today’s dynamic digital era, IT companies are in constant pursuit of technologies that bridge innovation and efficiency. Full Stack Java with AI is emerging as a revolutionary combination, redefining how applications are developed, deployed, and scaled. Our training program focuses on using AI tools in Full Stack Java and enables you to learn 10X faster.',
        duration: '3 Months',
        rating: '4.9 (2.3k+ Ratings)',
        seoTitle: 'Java Training in Bangalore from IT Companies with AI tools - Appteknow Careers',
        seoDesc: 'Java Training in Bangalore with AI from IT Companies who hire you. Learn Java from IT companies live projects in 3 months & get job 100%.',
        topics: [
          'Java Fundamentals & OOP Concepts',
          'Advanced Data Structures & Algorithms in Java',
          'Relational Databases & SQL Mastery',
          'Hibernate & JPA ORM Frameworks',
          'Spring Framework & Spring Boot REST APIs',
          'Microservices Architecture & Cloud Orchestration',
          'Frontend Integration with React & Angular',
          'AI Driven Code Automation & Copilots'
        ],
        faqs: [
          { q: 'What are the eligibility criteria to learn Full Stack Java?', a: 'Any engineering / technology computers & electronics student who completed graduation can learn to get a better career.' },
          { q: 'How Appteknow Careers is different than other institutions?', a: 'We are the only institution who offers practical training under corporate environment. You will get training from IT companies on their live projects. You will get AI tools for placements, resume building, mock interviews & English communication.' },
          { q: 'Which companies hire Java freshers?', a: 'Almost all software companies build software using Java as backend technology. Hence every software company has openings for Java candidates.' }
        ],
        emailKey: 'java',
        emailDisplayName: 'Full Stack Java Development with AI',
        brochureUrl: 'https://appteknow.com/brochures/AppTeknow_Full_Stack_Java_Syllabus.pdf',
        emailTools: ['Java JDK 21', 'Spring Boot', 'Hibernate', 'MySQL', 'Git & GitHub', 'Docker', 'ReactJS', 'JUnit'],
        emailHighlights: [
          'Spring Boot & Microservices enterprise architecture coding',
          'Production-grade database modeling and transaction isolation',
          'Modern frontend client integration using React.js',
          'AI Driven Code Automation with modern Copilots'
        ]
      },
      {
        slug: 'python-training-in-bangalore-from-it-companies-with-ai-tools',
        title: 'Full Stack Python Course with AI in Bangalore from IT Companies Hiring you',
        tagline: 'Master Python, Django, and React for full stack web development. In 3 months training IT companies will make you work under corporate environments.',
        details: 'Python is the heart of modern web engineering and machine learning pipelines. Our immersive training modules pair standard web backend architectures with production-ready Django ecosystems, integrated with cutting-edge generative AI assistance tools for instant scaffolding.',
        duration: '3 Months',
        rating: '4.8 (1.9k+ Ratings)',
        seoTitle: 'Python Training in Bangalore from IT Companies with AI tools - Appteknow Careers',
        seoDesc: 'Python Training in Bangalore with AI from IT Companies who hire you. Master Python, Django, React for full stack web development with AI tools.',
        topics: [
          'Python core syntax, sequences, and file structures',
          'Object-Oriented Python paradigms',
          'Database access and Object-Relational Mappings',
          'Django and Flask micro-frameworks',
          'Building secure APIs and JWT Authenticators',
          'Scientific libraries and ML pipelines introduction',
          'Automating scripts and cloud function execution',
          'React front-end framework pairing'
        ],
        faqs: [
          { q: 'Is coding experience mandatory to learn Python?', a: 'No, Python has clean and friendly syntax. Highly recommended for non-tech professionals attempting carrier shifts.' },
          { q: 'Do IT firms recruit freshers for Django positions?', a: 'Absolutely. Modern tech-startups and large enterprises rely heavily on Django for scalable backends.' }
        ],
        emailKey: 'python',
        emailDisplayName: 'Full Stack Python Development with AI',
        brochureUrl: 'https://appteknow.com/brochures/AppTeknow_Full_Stack_Python_Syllabus.pdf',
        emailTools: ['Python 3.x', 'Django Framework', 'Flask Micro-services', 'PostgreSQL', 'Pandas & NumPy', 'Git & GitHub', 'Selenium Webdriver'],
        emailHighlights: [
          'Clean modular Object-Oriented programming in Python 3',
          'High-performance backend API engineering via Django & Flask',
          'Data scientific structures using Pandas and NumPy',
          'Dynamic automated unit and UI testing integrations'
        ]
      },
      {
        slug: 'mern-stack-training-in-bangalore-with-ai-tools',
        title: 'MERN Stack Web Engineering Job Training',
        tagline: 'Become a Full Stack JS expert. Master MongoDB, Express, React, and Node.js with live enterprise deployment models.',
        details: 'JavaScript runs the modern web ecosystem. The MERN stack is highly sought after by modern high-growth product teams and startups. Master event-driven Node.js execution, MongoDB query profiling, dynamic React state trees, and high-performance WebSockets.',
        duration: '3 Months',
        rating: '4.9 (1.5k+ Ratings)',
        seoTitle: 'MERN Stack Web Engineering in Bangalore with AI - Appteknow Careers',
        seoDesc: 'Learn MERN Stack Web Engineering from IT active architects. Master React, Node, Express, MongoDB with live cloud deployments and 100% placement.',
        topics: [
          'JavaScript Core Elements & Event Loops',
          'React.js Component lifecycles & Context APIs',
          'MongoDB NoSQL database design & aggregation operations',
          'Express.js middleware controllers & routers',
          'Node.js file streams and asynchronous thread execution',
          'State management via Redux Toolkit',
          'Realtime streams utilizing Socket.io',
          'Production build pipelines and AWS/Vercel deployment'
        ],
        faqs: [
          { q: 'Why is MERN stack highly demanded?', a: 'Startups and product firms favor MERN because a single programming language (JS/TS) controls both frontend and backend.' },
          { q: 'What real projects will I build?', a: 'You will build corporate dashboards, real-time messaging hubs, and full e-commerce checkout platforms.' }
        ],
        emailKey: 'mern',
        emailDisplayName: 'MERN Stack Web Engineering',
        brochureUrl: 'https://appteknow.com/brochures/AppTeknow_MERN_Stack_Syllabus.pdf',
        emailTools: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redux Toolkit', 'Tailwind CSS', 'AWS Lightsail', 'Socket.io'],
        emailHighlights: [
          'NoSQL database design & high concurrency query operations',
          'Highly concurrent web event loops using Node and Express',
          'Reactive state managers (Redux Toolkit) & custom hooks in React',
          'WebSocket networking streams and cloud pipeline deployment'
        ]
      },
      {
        slug: 'software-testing-selenium-with-al-from-it-companies',
        title: 'Software Testing & QA Automation Job Training',
        tagline: 'Master manual verification and enterprise automated testing pipelines using Selenium Grid and BDD frameworks.',
        details: 'Quality assurance is a cornerstone of modern development. Automated validation ensures bug-free updates are delivered seamlessly in continuous integration suites. Master Java core for testing, page-object architectures, and regression runners.',
        duration: '3 Months',
        rating: '4.8 (2.1k+ Ratings)',
        seoTitle: 'Software Testing & QA Automation in Bangalore - Appteknow Careers',
        seoDesc: 'Premiere Software Testing training in BTM Layout Bangalore. Learn Selenium Grid, Java Core, Maven, BDD Cucumber with 100% placements.',
        topics: [
          'Software Testing Lifecycle (STLC) & Agile principles',
          'Manual test case design and defect tracking grids',
          'Java basics for automation suites',
          'Selenium WebDriver component selection methods',
          'TestNG and Maven pipeline builders',
          'Behavior Driven Development utilizing Cucumber BDD',
          'API sanity checks with Postman and Newman',
          'Continuous integration triggers using Jenkins'
        ],
        faqs: [
          { q: 'Can non-technical students enter QA?', a: 'Yes. Testing starts with manual workflows that do not require code, allowing a smooth transition into Java-based automation.' },
          { q: 'Is automation mandatory for testing careers now?', a: 'Automation is extremely favored by recruiters and yields significantly higher salary packages.' }
        ],
        emailKey: 'testing',
        emailDisplayName: 'Software Testing & QA Automation',
        brochureUrl: 'https://appteknow.com/brochures/AppTeknow_Software_Testing_Syllabus.pdf',
        emailTools: ['Selenium Webdriver', 'Java Core', 'Maven Builders', 'TestNG', 'Jenkins CI/CD', 'Cucumber BDD', 'JIRA', 'Postman API'],
        emailHighlights: [
          'Cross-browser functional automation with Selenium Grid',
          'Behavior Driven Development orchestration via Cucumber',
          'CI/CD pipeline test execution triggers via Jenkins',
          'REST API regression suites using Postman and Newman'
        ]
      },
      {
        slug: 'data-analytics-course-in-bangalore-from-it-companies',
        title: 'Data Analytics & Business Intelligence Pipeline',
        tagline: 'Transform raw numbers into dynamic visual narratives. Master Power BI, SQL databases, and Python Pandas.',
        details: 'Data is the oil of the 21st century. Business intelligence engineers bridge database administration and corporate strategy, creating responsive dashboards that reveal insights in realtime.',
        duration: '3 Months',
        rating: '4.9 (1.8k+ Ratings)',
        seoTitle: 'Best Data Analytics Course in Bangalore - Appteknow Careers',
        seoDesc: 'Master Data Analytics in Bangalore from IT companies. Learn Power BI, Tableau, SQL, Pandas, advanced Excel with Pay After Placement guarantee.',
        topics: [
          'Data warehousing concepts & SQL Server schemas',
          'Advanced multi-table joins, views, and index triggers',
          'Microsoft Power BI visuals, modeling, and DAX functions',
          'Tableau Desktop dashboard design and filters',
          'Python analytics utilizing Pandas & NumPy structures',
          'Excel spreadsheet mastery, pivots, and VBA macros',
          'Looker Studio analytics reporting layouts',
          'Interpreting predictive analytics for business executives'
        ],
        faqs: [
          { q: 'Is python mandatory for Data Analytics?', a: 'Basic python syntax for data scientific actions is covered. Our course focuses extensively on visual layout engines like Power BI.' },
          { q: 'What is the role of a data analyst?', a: 'Data Analysts extract complex transactions from databases, clean the results, and format them into visual charts for management.' }
        ],
        emailKey: 'analytics',
        emailDisplayName: 'Data Analytics & BI Pipeline',
        brochureUrl: 'https://appteknow.com/brochures/AppTeknow_Data_Analytics_Syllabus.pdf',
        emailTools: ['Microsoft Power BI', 'Tableau Desktop', 'SQL Server Databases', 'Pandas Analytics', 'NumPy Vectors', 'Advanced Excel VBA', 'Looker Studio'],
        emailHighlights: [
          'Interactive dashboard design and data modeling inside Power BI',
          'Advanced multi-table joins, CTEs, and window procedures in SQL',
          'Large data set extraction and cleaning utilizing Pandas/NumPy',
          'Interactive reporting formats for corporate board presentations'
        ]
      },
      {
        slug: 'other-tech-bootcamp',
        title: 'AppTeknow Tech Internship & Career Placement Bootcamp',
        tagline: 'General technology consultation, system architecture preparation, and custom tech learning paths.',
        details: 'Our customized corporate internship model allows engineering graduates to train under real corporate teams on active live servers, secure a 6 months experience credential, and pay course fees after placement.',
        duration: '3 Months',
        rating: '4.9 (950+ Ratings)',
        seoTitle: 'AppTeknow Tech Placement Bootcamp - Bangalore IT Training',
        seoDesc: 'Premium IT learning path with 100% placement assurance and industry experience credentials. Join Bangalore\'s top training bootcamp.',
        topics: [
          'Standard coding logic and algorithms framework',
          'Full-stack architecture reviews (Model-View-Controller)',
          'Local development environments and git operations',
          'Relational database configurations and tables',
          'API endpoints integration and parameters mapping',
          'Mock technical interviews and communication drills',
          'Resume writing, portfolio pages, and professional profiles',
          'Live project deployment steps on production servers'
        ],
        faqs: [
          { q: 'What if my target course is not in the list?', a: 'Select this general path. Our tech leads will counsel you and build a custom syllabus suited for your career aspirations.' },
          { q: 'How does the Pay After Placement structure work?', a: 'You pay an initial basic registration fee, and the core tuition fee is paid only after you secure a job placement.' }
        ],
        emailKey: 'other',
        emailDisplayName: 'AppTeknow Tech Bootcamp',
        brochureUrl: 'https://appteknow.com/brochures/AppTeknow_General_Brochure.pdf',
        emailTools: ['Full Stack Architectures', 'QA Test Automation', 'Data Pipeline Engineering', 'Cyber Security Audits', 'Cloud Server Architecting'],
        emailHighlights: [
          '100% hands-on corporate lab exercises led by active architects',
          '6 Months Professional Corporate Experience Internship Badge',
          'Exclusive automated mock interview simulation ecosystem',
          '50% Course Fees Paid ONLY after you secure placement!'
        ]
      }
    ]);

    console.log('Courses seeded');
    console.log('Database Seeding Completed Successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
