import { Sequelize } from 'sequelize';
import path from 'path';
import seedJobs from './jobs_seed.json';
import seedPlacements from './placements_seed.json';

// Create Sequelize instance connected to a local SQLite file
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

// Load models after sequelize instance is defined to avoid circular dependency crashes
import './models/ChatConversation';
import './models/ChatMessage';
import './models/Payment';
import './models/JobDrive';
import './models/AdminSetting';



export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database connected successfully.');
    // Automatically sync models (create tables if they don't exist)
    await sequelize.sync();
    console.log('All models synchronized successfully.');

    // Safely add description column to JobDrives table if it doesn't exist (avoiding SQLite constraint crashes on other tables)
    try {
      await sequelize.query("ALTER TABLE JobDrives ADD COLUMN description TEXT;");
      console.log("Successfully added description column to JobDrives.");
    } catch (err: any) {
      if (err.message.includes('duplicate column name') || err.message.includes('already exists')) {
        console.log("description column already exists in JobDrives table.");
      } else {
        console.warn("Could not alter JobDrives table:", err.message);
      }
    }

    // Safely add screenshotUrl and paymentMode columns to Payments table if they don't exist
    try {
      await sequelize.query("ALTER TABLE Payments ADD COLUMN screenshotUrl VARCHAR(255);");
      console.log("Successfully added screenshotUrl column to Payments.");
    } catch (err: any) {
      if (err.message.includes('duplicate column name') || err.message.includes('already exists')) {
        console.log("screenshotUrl column already exists in Payments table.");
      } else {
        console.warn("Could not add screenshotUrl to Payments table:", err.message);
      }
    }

    try {
      await sequelize.query("ALTER TABLE Payments ADD COLUMN paymentMode VARCHAR(50) DEFAULT 'ONLINE';");
      console.log("Successfully added paymentMode column to Payments.");
    } catch (err: any) {
      if (err.message.includes('duplicate column name') || err.message.includes('already exists')) {
        console.log("paymentMode column already exists in Payments table.");
      } else {
        console.warn("Could not add paymentMode to Payments table:", err.message);
      }
    }

    // Seed default Admin if none exists
    const Admin = require('./models/Admin').default;
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin@teknow2026', salt);
      await Admin.create({
        username: 'admin',
        passwordHash
      });
      console.log('Successfully seeded database with default admin account!');
    }

    // Seed default UPI Settings if they don't exist
    const AdminSetting = require('./models/AdminSetting').default;
    const existingUpiId = await AdminSetting.findOne({ where: { key: 'upi_id' } });
    if (!existingUpiId) {
      await AdminSetting.create({ key: 'upi_id', value: 'aptech.dec-5@okicici' });
      console.log('Seeded default UPI ID: aptech.dec-5@okicici');
    } else {
      // Auto-update if still set to old seed to unblock client
      if ((existingUpiId as any).value === 'pay@appteknow') {
        await existingUpiId.update({ value: 'aptech.dec-5@okicici' });
      }
    }
    const existingQrCode = await AdminSetting.findOne({ where: { key: 'upi_qr_code' } });
    if (!existingQrCode) {
      await AdminSetting.create({ key: 'upi_qr_code', value: '/uploads_qr/upi_qr_code.png' });
      console.log('Seeded default QR Code image.');
    } else {
      const val = (existingQrCode as any).value;
      if (!val || val.includes('localhost') || val.includes('127.0.0.1') || val === '/upi_qr_code.png') {
        await existingQrCode.update({ value: '/uploads_qr/upi_qr_code.png' });
        console.log('Reset QR Code value to default uploads_qr path.');
      }
    }

    // Seed initial Courses & keep them synced
    const Course = require('./models/Course').default;
    const defaultCourses = [
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
        brochureUrl: '/brochures/JAVA-Full-Stack.pdf',
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
        brochureUrl: '/brochures/Python-Full-Stack.pdf',
        emailTools: ['Python 3.x', 'Django Framework', 'Flask Micro-services', 'PostgreSQL', 'Pandas & NumPy', 'Git & GitHub', 'Selenium Webdriver'],
        emailHighlights: [
          'Clean modular Object-Oriented programming in Python 3',
          'High-performance backend API engineering via Django & Flask',
          'Data scientific structures using Pandas and NumPy',
          'Dynamic automated unit and UI testing integrations'
        ]
      },
      {
        slug: 'mern-training-in-bangalore-from-it-companies-with-ai-tools-2',
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
        brochureUrl: '/brochures/MERN-Stack.pdf',
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
        brochureUrl: '/brochures/software-testing.pdf',
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
        brochureUrl: '/brochures/Data-Analytics.pdf',
        emailTools: ['Microsoft Power BI', 'Tableau Desktop', 'SQL Server Databases', 'Pandas Analytics', 'NumPy Vectors', 'Advanced Excel VBA', 'Looker Studio'],
        emailHighlights: [
          'Interactive dashboard design and data modeling inside Power BI',
          'Advanced multi-table joins, CTEs, and window procedures in SQL',
          'Large data set extraction and cleaning utilizing Pandas/NumPy',
          'Interactive reporting formats for corporate board presentations'
        ]
      },
      {
        slug: 'cyber-security-courses-in-bangalore',
        title: 'Cyber Security Course in Bangalore from IT Companies Hiring you',
        tagline: 'Learn Ethical Hacking, Network Security, and Cyber Security Operations from IT architects.',
        details: 'Protect networks, systems, and programs from digital attacks. Our comprehensive ethical hacking and operations bootcamps align with international standards and prepare you for active security lead placements.',
        duration: '3 Months',
        rating: '4.8 (1.2k+ Ratings)',
        seoTitle: 'Cyber Security Course in Bangalore with Placements - Appteknow Careers',
        seoDesc: 'Ethical Hacking & Cyber Security Course in Bangalore from IT companies. Join our cyber operations bootcamps with 100% placement assurance.',
        topics: [
          'Linux Fundamentals & Shell Scripting',
          'Networking Protocol Audits & Wireshark',
          'Ethical Hacking & Penetration Testing',
          'Metasploit & Burp Suite Vulnerability Scanning',
          'Splunk SIEM threat analysis',
          'OWASP Top 10 Web App Security Risks',
          'Firewalls, VPNs & Cryptography',
          'Incident Response & Threat Intel'
        ],
        faqs: [
          { q: 'Do I need to know coding for Cyber Security?', a: 'Basic scripting in python/bash is covered. Core logical understanding is more critical than extensive software engineering.' },
          { q: 'What certificates does this prepare me for?', a: 'Our curriculum aligns with CEH (Certified Ethical Hacker) and CompTIA Security+ frameworks.' }
        ],
        emailKey: 'cyber',
        emailDisplayName: 'Ethical Hacking & Cyber Security',
        brochureUrl: '/brochures/General-Brochure.pdf',
        emailTools: ['Kali Linux', 'Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'Nessus', 'Splunk SIEM', 'OWASP ZAP'],
        emailHighlights: [
          'Network defense and packet analysis using Wireshark',
          'Ethical hacking methods and vulnerability scanning',
          'Security Incident & Event Management (SIEM) operations',
          'OWASP security compliance verification'
        ]
      },
      {
        slug: 'digital-marketing-courses',
        title: 'Digital Marketing Course with AI Tools in Bangalore',
        tagline: 'Master SEO, SEM, SMM, and AI-driven growth marketing from active branding leads.',
        details: 'Scale business reach and master search engine positioning, social advertising campaigns, and generative AI content creation tools to 10X your marketing productivity.',
        duration: '3 Months',
        rating: '4.9 (1.4k+ Ratings)',
        seoTitle: 'Best Digital Marketing Course in Bangalore - Appteknow Careers',
        seoDesc: 'Master digital marketing and SEO with AI tools. Learn Meta Ads, Google Analytics 4, Ahrefs, SEMrush with placement support.',
        topics: [
          'Search Engine Optimization (SEO) & Google Search Console',
          'Google Analytics 4 & Tag Manager',
          'Ahrefs & SEMrush Competitor Profiling',
          'Meta Ads (Facebook & Instagram campaigns)',
          'Google Search & Display Ads (PPC)',
          'Email Marketing & Automation via Mailchimp',
          'AI Driven Content Generation with ChatGPT API',
          'Branding Strategy & Content Calendars'
        ],
        faqs: [
          { q: 'Is coding required for Digital Marketing?', a: 'No, coding is not required. You only need basic web navigation and logical planning skills.' },
          { q: 'Can I start a freelance agency after this?', a: 'Yes, we cover business acquisition, project pricing, and client dashboards.' }
        ],
        emailKey: 'digital',
        emailDisplayName: 'Digital Marketing & Growth Hacking',
        brochureUrl: '/brochures/Digital-marketing.pdf',
        emailTools: ['Google Analytics 4', 'Google Tag Manager', 'Ahrefs', 'SEMrush', 'Meta Ads Manager', 'Mailchimp', 'Canva Pro', 'ChatGPT API'],
        emailHighlights: [
          'Advanced SEO ranking strategy & technical site audits',
          'Meta & Google paid ad campaign optimization',
          'Data tracking setups via GA4 and Google Tag Manager',
          'AI automation templates for content writing'
        ]
      },
      {
        slug: 'tally-training-in-bangalore',
        title: 'Tally Prime & GST Professional Training',
        tagline: 'Master corporate accounting, inventory management, and GST tax filing.',
        details: 'A practical, hands-on syllabus covering corporate finance, balance sheet finalization, payroll setups, and online tax filing procedures.',
        duration: '2 Months',
        rating: '4.8 (850+ Ratings)',
        seoTitle: 'Tally Prime & GST Course in Bangalore - Appteknow Careers',
        seoDesc: 'Master accounting with Tally Prime, GST filing, Excel finance, and payroll setups in Bangalore. 100% practical training.',
        topics: [
          'Accounting Fundamentals & Journal Entries',
          'Tally Prime Operations & Vouchers',
          'Inventory Management & Purchase Orders',
          'GST computation and online return filing',
          'TDS calculation and deduction registries',
          'Advanced Excel for Finance & Pivot reporting',
          'E-Way bills and online portals processing',
          'Payroll structures and balance sheet setups'
        ],
        faqs: [
          { q: 'What accounting background is required?', a: 'B.Com/BBA/MBA finance is preferred, but any graduate can learn from absolute basics.' },
          { q: 'Is Tally Prime covered?', a: 'Yes, we train on the latest version of Tally Prime.' }
        ],
        emailKey: 'tally',
        emailDisplayName: 'Tally Prime & Professional GST',
        brochureUrl: '/brochures/General-Brochure.pdf',
        emailTools: ['Tally Prime', 'GST Portals', 'MS Excel (Adv)', 'Tax Filing Softwares', 'E-Way Bill Systems', 'Payroll Processors'],
        emailHighlights: [
          'Account books creation & balance sheet reconciliations',
          'Direct & Indirect tax computation and GST filings',
          'Corporate payroll setups and TDS structures',
          'Advanced financial reports using Tally Prime dashboards'
        ]
      },
      {
        slug: 'softskills-aptitude-training',
        title: 'Corporate Softskills & Interview Preparation',
        tagline: 'Boost your communication, logical aptitude, and confidence for placement success.',
        details: 'Overcome communication barriers, master corporate email drafting, build high-intent LinkedIn profiles, and solve logical reasoning questions under active time constraints.',
        duration: '1 Month',
        rating: '4.9 (900+ Ratings)',
        seoTitle: 'Best Softskills & Aptitude Training in Bangalore - Appteknow Careers',
        seoDesc: 'Aptitude and softskills training in Bangalore. Master mock interviews, logical reasoning, and corporate communication.',
        topics: [
          'Corporate communication styles & emails',
          'Mock interview drills and body language analysis',
          'Resume structuring and LinkedIn profile optimization',
          'Quantitative aptitude and speed math',
          'Logical reasoning and puzzle solving',
          'Group discussion tactics & public speaking',
          'Time management & stress reduction',
          'Active corporate etiquettes'
        ],
        faqs: [
          { q: 'Is this course available with tech courses?', a: 'Yes, softskills training is bundled for free with all our premium IT programs.' },
          { q: 'How do mock interviews work?', a: 'You will participate in weekly panel simulations with senior IT managers.' }
        ],
        emailKey: 'softskills',
        emailDisplayName: 'Corporate Softskills & Aptitude',
        brochureUrl: '/brochures/General-Brochure.pdf',
        emailTools: ['AI Resume Graders', 'Mock Assessment Portals', 'Body Language AI Analyzers', 'Email Drafting Engine', 'LinkedIn Persona Builders'],
        emailHighlights: [
          'Complete resume overhaul and LinkedIn optimization',
          'Live mock interview evaluations with panel feedback',
          'Quantitative reasoning and logical problem solving',
          'Business communication and writing tactics'
        ]
      },
      {
        slug: 'generative-ai-training-in-bangalore',
        title: 'Generative AI & LLM Developer Course',
        tagline: 'Build autonomous agents, prompt engineering systems, and custom LLM chatbots.',
        details: 'Master prompt engineering, retrieval-augmented generation (RAG), LangChain orchestration, and API integrations to build state-of-the-art AI applications.',
        duration: '2 Months',
        rating: '4.9 (600+ Ratings)',
        seoTitle: 'Generative AI & Prompt Engineering Course in Bangalore - Appteknow Careers',
        seoDesc: 'Learn Generative AI, LLM APIs, LangChain, and RAG in Bangalore. Build autonomous agents and secure AI roles.',
        topics: [
          'Prompt Engineering Principles & System Instructions',
          'OpenAI & Gemini API Integration',
          'Retrieval-Augmented Generation (RAG) & Vector DBs',
          'LangChain Orchestration Framework',
          'Building Autonomous AI Agents',
          'Fine-tuning Open Source Models (Llama 3)',
          'Deploying AI Apps to Cloud (Streamlit / Vercel)',
          'AI Security, Ethics & Guardrails'
        ],
        faqs: [
          { q: 'Do I need to know python for this course?', a: 'Yes, intermediate Python knowledge is required. We provide a refresher module on Python before starting.' },
          { q: 'What projects will I build?', a: 'You will build custom PDF chat assistants, RAG search engines, and autonomous agents.' }
        ],
        emailKey: 'generative-ai',
        emailDisplayName: 'Generative AI & LLM Development',
        brochureUrl: '/brochures/Generative_AI.pdf',
        emailTools: ['OpenAI API', 'Gemini Pro API', 'LangChain', 'Pinecone Vector DB', 'Streamlit', 'Hugging Face', 'Ollama', 'Python'],
        emailHighlights: [
          'Prompt engineering best practices & multi-shot instructions',
          'RAG pipelines utilizing vector embeddings & databases',
          'Building complex workflows using LangChain',
          'Deploying live AI web applications'
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
          { q: 'How does the Pay After Placement structure work?', a: 'You pay an initial basic registration fee, and the tuition fee is paid only after you secure a job placement.' }
        ],
        emailKey: 'other',
        emailDisplayName: 'AppTeknow Tech Bootcamp',
        brochureUrl: '/brochures/General-Brochure.pdf',
        emailTools: ['Full Stack Architectures', 'QA Test Automation', 'Data Pipeline Engineering', 'Cyber Security Audits', 'Cloud Server Architecting'],
        emailHighlights: [
          '100% hands-on corporate lab exercises led by active IT engineers',
          '6 Months Professional Corporate Experience Internship Badge',
          'General technical interview evaluations and portfolio setup',
          'Secure deployment steps on production application servers'
        ]
      }
    ];

    for (const c of defaultCourses) {
      const existing = await Course.findOne({ where: { slug: c.slug } });
      if (!existing) {
        await Course.create(c);
        console.log(`Seeded course database record for: ${c.slug}`);
      } else {
        await Course.update(c, { where: { slug: c.slug } });
        console.log(`Updated/synchronized course database record for: ${c.slug}`);
      }
    }
    console.log('Successfully synchronized database courses!');

    // Ensure all existing course brochure URLs point to local directory paths (database migration)
    try {
      const coursesToUpdate = await Course.findAll();
      for (const course of coursesToUpdate) {
        let updatedUrl = null;
        if (course.slug.startsWith('java-training')) {
          updatedUrl = '/brochures/JAVA-Full-Stack.pdf';
        } else if (course.slug.startsWith('python-training')) {
          updatedUrl = '/brochures/Python-Full-Stack.pdf';
        } else if (course.slug.startsWith('mern-stack') || course.slug.startsWith('mern-training')) {
          updatedUrl = '/brochures/MERN-Stack.pdf';
        } else if (course.slug.startsWith('software-testing')) {
          updatedUrl = '/brochures/software-testing.pdf';
        } else if (course.slug.startsWith('data-analytics')) {
          updatedUrl = '/brochures/Data-Analytics.pdf';
        } else if (course.slug.startsWith('digital-marketing')) {
          updatedUrl = '/brochures/Digital-marketing.pdf';
        } else if (course.slug.startsWith('generative-ai')) {
          updatedUrl = '/brochures/Generative_AI.pdf';
        } else if (course.slug.startsWith('other-tech') || course.slug.startsWith('cyber-security') || course.slug.startsWith('tally-training') || course.slug.startsWith('softskills-aptitude')) {
          updatedUrl = '/brochures/General-Brochure.pdf';
        }
        
        if (updatedUrl && course.brochureUrl !== updatedUrl) {
          await course.update({ brochureUrl: updatedUrl });
          console.log(`Updated course ${course.slug} brochure URL to ${updatedUrl}`);
        }
      }
    } catch (e) {
      console.error('Failed to run brochure URL updates on startup:', e);
    }

    // Seed initial student projects if none exist
    const StudentProject = require('./models/StudentProject').default;
    const count = await StudentProject.count();
    if (count === 0) {
      await StudentProject.bulkCreate([
        {
          id: 'edusuite-erp-system',
          title: 'EduSuite — Institute ERP & Management System',
          studentName: 'AppTeknow Tech Team',
          placedCompany: 'AppTeknow',
          courseId: 'mern',
          description: 'EduSuite is an AI-powered ERP platform for coaching institutes — admissions, attendance, fees, digital certificates, lead CRM, and placements, all in one system.',
          techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AI Assistant', 'Redux', 'JSON-LD'],
          liveUrl: 'https://edusuite.appteknow.com',
          thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Engineered a unified student lifecycle dashboard and admissions funnel, integrating secure digital certificate validation and Automated SMS/Email CRM alerts.',
          screenshots: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'java-banking-system',
          title: 'TrustNet Core Banking & Microservices',
          studentName: 'Rajesh Kumar',
          placedCompany: 'Accenture',
          courseId: 'java',
          description: 'A robust and secure core banking middleware handling thousands of transaction requests per second with Spring Boot microservices.',
          techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST API'],
          liveUrl: '/live-sandbox/java-banking-system',
          thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Architected fully redundant PostgreSQL transaction logs preventing data divergence, reducing api latency by 42%.',
          screenshots: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'testing-ecom-suite',
          title: 'Apex E-Commerce Test Suite',
          studentName: 'Priya Sharma',
          placedCompany: 'Capgemini',
          courseId: 'testing',
          description: 'High-performance end-to-end test suite using Selenium Grid and Cucumber BDD, executing cross-browser sanity checks for a major retail website.',
          techStack: ['Selenium Automation', 'Core JAVA', 'Cucumber BDD', 'Maven', 'Jenkins'],
          liveUrl: '/live-sandbox/testing-ecom-suite',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Developed dynamic web element waiters, reducing execution flaky failures by 85% and cutting build times in half.',
          screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'python-retail-dashboard',
          title: 'PyInsight Predictive Retail Dashboard',
          studentName: 'Amit Patel',
          placedCompany: 'Cognizant',
          courseId: 'python',
          description: 'An interactive sales and analytics forecasting platform built using Django REST Framework and pandas to project future store inventory demands.',
          techStack: ['Python', 'Django Framework', 'Pandas & NumPy', 'HTML/CSS', 'PostgreSQL'],
          liveUrl: '/live-sandbox/python-retail-dashboard',
          thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Implemented a sliding window forecasting algorithm, achieving an 94.2% demand projection accuracy.',
          screenshots: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'data-analytics-omni',
          title: 'OmniRetail Predictive BI Pipeline',
          studentName: 'Kiran Das',
          placedCompany: 'Cognizant',
          courseId: 'data',
          description: 'A comprehensive sales forecasting and inventory prediction dashboard combining SQLite, Python (pandas/NumPy), and interactive Power BI embeds to project future supply demands with high precision.',
          techStack: ['Python', 'Power BI', 'Pandas & NumPy', 'SQL', 'Excel Advanced Reporting'],
          liveUrl: '/live-sandbox/data-analytics-omni',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Engineered ETL pipelines processing 2M+ transaction rows, optimizing SQL partition indexing and generating dynamic forecast simulations with 95.8% accuracy.',
          screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'mern-dev-network',
          title: 'DevConnect SaaS Developer Network',
          studentName: 'Sanjay Mehta',
          placedCompany: 'Infosys',
          courseId: 'mern',
          description: 'A full-stack social collaboration dashboard for developers, featuring real-time feed synchronization via WebSockets and secure JWT authorization flows.',
          techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'Tailwind CSS'],
          liveUrl: '/live-sandbox/mern-dev-network',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Designed dual-token refresh protocols safeguarding user sessions and architected high-performance feed indices reducing DB fetch latencies.',
          screenshots: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'cyber-threat-engine',
          title: 'Aegis Shield Threat Intelligence Engine',
          studentName: 'Nisha Rao',
          placedCompany: 'Wipro',
          courseId: 'cyber',
          description: 'A robust cybersecurity operations scan dashboard monitoring threat indexes, capturing mock packet dumps, and performing multi-threaded subnet vulnerability assessments.',
          techStack: ['Kali Linux', 'Burp Suite', 'Python Scapy', 'Nmap Audit', 'Splunk SIEM'],
          liveUrl: '/live-sandbox/cyber-threat-engine',
          thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Implemented non-blocking scanner loops analyzing 250+ endpoints, auditing active system ports and compiling CVE alerts in real-time.',
          screenshots: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        },
        {
          id: 'logistics-delivery-system',
          title: 'QuickRun Logistics Smart Delivery System',
          studentName: 'Rahul Verma',
          placedCompany: 'Capgemini',
          courseId: 'python',
          description: 'An advanced courier dispatch and map tracking console tracing live delivery progression through active geofencing and dynamic ETA calculation models.',
          techStack: ['Python', 'Django Framework', 'SQLite', 'Google Maps API', 'HTML/CSS/JS'],
          liveUrl: '/live-sandbox/logistics-delivery-system',
          thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500',
          challengesSolved: 'Engineered clean routing paths utilizing vector interpolation, offering real-time updates and resolving travel delay calculations efficiently.',
          screenshots: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'],
          githubUrl: ''
        }
      ]);
      console.log('Successfully seeded database with beautiful mock student projects!');
    }

    // Seed initial placements — reseed if fewer placements exist than in seed file (handles old mock data)
    const Placement = require('./models/Placement').default;
    
    // Clean up any placeholder placements with numerical names (like 1024x727) from the database on startup
    try {
      const allPlac = await Placement.findAll();
      for (const p of allPlac) {
        if (/\d/.test(p.name) || p.name === '1024x727') {
          await p.destroy();
          console.log(`Deleted numerical placeholder placement: ${p.name}`);
        }
      }
    } catch (err) {
      console.warn('Could not run database placements cleanup:', err);
    }

    // Auto-reseeding of Placements from disk is disabled so admin edits remain permanent.
    // Placements are managed exclusively via Admin Dashboard / SQLite database.

    // Seed initial job drives — reseed if fewer jobs exist than in seed file (handles old mock data)
    const JobDrive = require('./models/JobDrive').default;
    const jobCount = await JobDrive.count();
    if (jobCount === 0 || jobCount < seedJobs.length) {
      if (jobCount > 0) {
        await JobDrive.destroy({ where: {}, truncate: true });
        console.log(`Cleared ${jobCount} stale job drives to reseed with ${seedJobs.length} live drives.`);
      }
      await JobDrive.bulkCreate(seedJobs);
      console.log(`Successfully seeded database with ${seedJobs.length} live job drives!`);
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
