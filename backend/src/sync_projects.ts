import { sequelize } from './db';
import StudentProject from './models/StudentProject';

const syncProjects = async () => {
  try {
    console.log('Connecting to SQLite database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    console.log('Force-syncing StudentProject table to apply primaryKey schema updates...');
    // force: true drops the existing table and recreates it
    await StudentProject.sync({ force: true });
    console.log('StudentProject table dropped and recreated.');

    console.log('Inserting 8 premium sandboxed student projects...');
    await StudentProject.bulkCreate([
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
      },
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
      }
    ]);

    console.log('Successfully synchronized database! 8 sandboxed student projects are fully seeded.');
    process.exit(0);
  } catch (err) {
    console.error('Error synchronizing projects database:', err);
    process.exit(1);
  }
};

syncProjects();
