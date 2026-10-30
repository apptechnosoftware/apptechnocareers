import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Types definitions
export interface FAQ {
  q: string;
  a: string;
}

export interface CourseData {
  id: string;
  title: string;
  tagline: string;
  seoTitle: string;
  seoDesc: string;
  duration: string;
  shiftHours: string;
  days: string;
  location: string;
  rating: string;
  details: string;
  topics: string[];
  faqs: FAQ[];
  emailKey?: string;
  emailDisplayName?: string;
  brochureUrl?: string;
  emailTools?: string[];
  emailHighlights?: string[];
}

export interface Placement {
  id: string;
  name: string;
  company: string;
  role: string;
  package: string;
  studentImage?: string;
}

export interface JobDrive {
  id: string;
  title: string;
  company: string;
  exp: string;
  location: string;
  ctc: string;
  status: string;
  hot: boolean;
  description?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  date: string;
}

export interface StudentProject {
  id: string;
  title: string;
  studentName: string;
  placedCompany: string;
  courseId: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  challengesSolved: string;
  screenshots: string[];
}

export interface ChatMessage {
  id: string;
  senderType: 'visitor' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  messages: ChatMessage[];
  status: 'active' | 'resolved';
  lastActivity: string;
}

interface DataContextType {
  courses: Record<string, CourseData>;
  placements: Placement[];
  jobs: JobDrive[];
  inquiries: Inquiry[];
  projects: StudentProject[];
  chatConversations: ChatConversation[];
  updateCourse: (slug: string, updatedData: CourseData) => void;
  addPlacement: (p: Omit<Placement, 'id'>) => void;
  deletePlacement: (id: string) => void;
  clearAllPlacements: () => void;
  updatePlacement: (id: string, p: Partial<Placement>) => void;
  addJob: (j: Omit<JobDrive, 'id'>) => void;
  deleteJob: (id: string) => void;
  updateJob: (id: string, j: Partial<JobDrive>) => void;
  addInquiry: (inq: Omit<Inquiry, 'id' | 'date'>) => void;
  deleteInquiry: (id: string) => void;
  addProject: (proj: Omit<StudentProject, 'id'>) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updatedProj: StudentProject) => void;
  sendVisitorMessage: (visitorName: string, visitorPhone: string, message: string, conversationId?: string) => string;
  sendAdminReply: (conversationId: string, message: string) => void;
  resolveChat: (conversationId: string) => void;
  refreshChats: () => void;
  refreshInquiries: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_COURSES: Record<string, CourseData> = {
  'java-training-in-bangalore-from-it-companies-with-ai-tools': {
    id: 'java',
    title: 'Full Stack Java Course with AI from IT Companies Hiring you',
    tagline: 'Learn Java from IT companies live projects in 3 months & get job 100%. First time in IT education industry, Appteknow Careers is introducing On The Job Training model.',
    seoTitle: 'Java Training in Bangalore from IT Companies with AI tools - Appteknow Careers',
    seoDesc: 'Java Training in Bangalore with AI from IT Companies who hire you. Learn Java from IT companies live projects in 3 months & get job 100%.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (2.3k+ Ratings)',
    details: 'In today’s dynamic digital era, IT companies are in constant pursuit of technologies that bridge innovation and efficiency. Full Stack Java with AI is emerging as a revolutionary combination, redefining how applications are developed, deployed, and scaled. Our training program focuses on using AI tools in Full Stack Java and enables you to learn 10X faster.',
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
  'python-training-in-bangalore-from-it-companies-with-ai-tools': {
    id: 'python',
    title: 'Full Stack Python Course with AI in Bangalore from IT Companies Hiring you',
    tagline: 'Master Python, Django, and React for full stack web development. In 3 months training IT companies will make you work under corporate environments.',
    seoTitle: 'Python Training in Bangalore from IT Companies with AI tools - Appteknow Careers',
    seoDesc: 'Python Training in Bangalore with AI from IT Companies who hire you. Master Python, Django, React for full stack web development with AI tools.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.8 (1.9k+ Ratings)',
    details: 'Python is the heart of modern web engineering and machine learning pipelines. Our immersive training modules pair standard web backend architectures with production-ready Django ecosystems, integrated with cutting-edge generative AI assistance tools for instant scaffolding.',
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
  'mern-training-in-bangalore-from-it-companies-with-ai-tools-2': {
    id: 'mern',
    title: 'MERN Stack Web Engineering Job Training',
    tagline: 'Become a Full Stack JS expert. Master MongoDB, Express, React, and Node.js with live enterprise deployment models.',
    seoTitle: 'MERN Stack Web Engineering in Bangalore with AI - Appteknow Careers',
    seoDesc: 'Learn MERN Stack Web Engineering from IT active architects. Master React, Node, Express, MongoDB with live cloud deployments and 100% placement.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (1.5k+ Ratings)',
    details: 'JavaScript runs the modern web ecosystem. The MERN stack is highly sought after by modern high-growth product teams and startups. Master event-driven Node.js execution, MongoDB query profiling, dynamic React state trees, and high-performance WebSockets.',
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
  'software-testing-selenium-with-al-from-it-companies': {
    id: 'testing',
    title: 'Software Testing & QA Automation Job Training',
    tagline: 'Master manual verification and enterprise automated testing pipelines using Selenium Grid and BDD frameworks.',
    seoTitle: 'Software Testing & QA Automation in Bangalore - Appteknow Careers',
    seoDesc: 'Premiere Software Testing training in BTM Layout Bangalore. Learn Selenium Grid, Java Core, Maven, BDD Cucumber with 100% placements.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.8 (2.1k+ Ratings)',
    details: 'Quality assurance is a cornerstone of modern development. Automated validation ensures bug-free updates are delivered seamlessly in continuous integration suites. Master Java core for testing, page-object architectures, and regression runners.',
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
  'data-analytics-course-in-bangalore-from-it-companies': {
    id: 'analytics',
    title: 'Data Analytics & Business Intelligence Pipeline',
    tagline: 'Transform raw numbers into dynamic visual narratives. Master Power BI, SQL databases, and Python Pandas.',
    seoTitle: 'Best Data Analytics Course in Bangalore - Appteknow Careers',
    seoDesc: 'Master Data Analytics in Bangalore from IT companies. Learn Power BI, Tableau, SQL, Pandas, advanced Excel with Pay After Placement guarantee.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (1.8k+ Ratings)',
    details: 'Data is the oil of the 21st century. Business intelligence engineers bridge database administration and corporate strategy, creating responsive dashboards that reveal insights in realtime.',
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
  'cyber-security-courses-in-bangalore': {
    id: 'cyber',
    title: 'Cyber Security Course in Bangalore from IT Companies Hiring you',
    tagline: 'Learn Ethical Hacking, Network Security, and Cyber Security Operations from IT architects.',
    seoTitle: 'Cyber Security Course in Bangalore with Placements - Appteknow Careers',
    seoDesc: 'Ethical Hacking & Cyber Security Course in Bangalore from IT companies. Join our cyber operations bootcamps with 100% placement assurance.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.8 (1.2k+ Ratings)',
    details: 'Protect networks, systems, and programs from digital attacks. Our comprehensive ethical hacking and operations bootcamps align with international standards and prepare you for active security lead placements.',
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
  'digital-marketing-courses': {
    id: 'digital',
    title: 'Digital Marketing Course with AI Tools in Bangalore',
    tagline: 'Master SEO, SEM, SMM, and AI-driven growth marketing from active branding leads.',
    seoTitle: 'Best Digital Marketing Course in Bangalore - Appteknow Careers',
    seoDesc: 'Master digital marketing and SEO with AI tools. Learn Meta Ads, Google Analytics 4, Ahrefs, SEMrush with placement support.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (1.4k+ Ratings)',
    details: 'Scale business reach and master search engine positioning, social advertising campaigns, and generative AI content creation tools to 10X your marketing productivity.',
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
  'tally-training-in-bangalore': {
    id: 'tally',
    title: 'Tally Prime & GST Professional Training',
    tagline: 'Master corporate accounting, inventory management, and GST tax filing.',
    seoTitle: 'Tally Prime & GST Course in Bangalore - Appteknow Careers',
    seoDesc: 'Master accounting with Tally Prime, GST filing, Excel finance, and payroll setups in Bangalore. 100% practical training.',
    duration: '2 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.8 (850+ Ratings)',
    details: 'A practical, hands-on syllabus covering corporate finance, balance sheet finalization, payroll setups, and online tax filing procedures.',
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
  'softskills-aptitude-training': {
    id: 'softskills',
    title: 'Corporate Softskills & Interview Preparation',
    tagline: 'Boost your communication, logical aptitude, and confidence for placement success.',
    seoTitle: 'Best Softskills & Aptitude Training in Bangalore - Appteknow Careers',
    seoDesc: 'Aptitude and softskills training in Bangalore. Master mock interviews, logical reasoning, and corporate communication.',
    duration: '1 Month',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (900+ Ratings)',
    details: 'Overcome communication barriers, master corporate email drafting, build high-intent LinkedIn profiles, and solve logical reasoning questions under active time constraints.',
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
  'generative-ai-training-in-bangalore': {
    id: 'generative-ai',
    title: 'Generative AI & LLM Developer Course',
    tagline: 'Build autonomous agents, prompt engineering systems, and custom LLM chatbots.',
    seoTitle: 'Generative AI & Prompt Engineering Course in Bangalore - Appteknow Careers',
    seoDesc: 'Learn Generative AI, LLM APIs, LangChain, and RAG in Bangalore. Build autonomous agents and secure AI roles.',
    duration: '2 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (600+ Ratings)',
    details: 'Master prompt engineering, retrieval-augmented generation (RAG), LangChain orchestration, and API integrations to build state-of-the-art AI applications.',
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
  'other-tech-bootcamp': {
    id: 'other',
    title: 'AppTeknow Tech Internship & Career Placement Bootcamp',
    tagline: 'General technology consultation, system architecture preparation, and custom tech learning paths.',
    seoTitle: 'AppTeknow Tech Placement Bootcamp - Bangalore IT Training',
    seoDesc: 'Premium IT learning path with 100% placement assurance and industry experience credentials. Join Bangalore\'s top training bootcamp.',
    duration: '3 Months',
    shiftHours: '9am to 6pm',
    days: 'Monday to Saturday',
    location: 'BTM Layout, Bangalore & Online',
    rating: '4.9 (950+ Ratings)',
    details: 'Our customized corporate internship model allows engineering graduates to train under real corporate teams on active live servers, secure a 6 months experience credential, and pay course fees after placement.',
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
};

const INITIAL_PLACEMENTS: Placement[] = [];

const INITIAL_JOBS = [
  { 
    id: '1', 
    title: "Full Stack Java Developer", 
    company: "InnoTech Solutions", 
    exp: "0-2 Years", 
    location: "Bangalore",
    ctc: "5.5 - 8.0 LPA",
    status: "Active - Hiring Now",
    hot: true
  },
  { 
    id: '2', 
    title: "Automation QA Analyst", 
    company: "CloudCore Systems", 
    exp: "Fresher", 
    location: "BTM Layout (On-site)",
    ctc: "4.2 - 5.8 LPA",
    status: "Walk-in Next Monday",
    hot: true
  }
];

const INITIAL_PROJECTS: StudentProject[] = [
  {
    id: 'edusuite-erp-system',
    title: 'EduSuite — Institute ERP & Management System',
    studentName: 'AppTeknow Tech Team',
    placedCompany: 'AppTeknow',
    courseId: 'mern',
    description: 'EduSuite is an AI-powered ERP platform for coaching institutes — admissions, attendance, fees, digital certificates, lead CRM, and placements, all in one system.',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AI Assistant', 'Redux', 'JSON-LD'],
    githubUrl: '',
    liveUrl: 'https://edusuite.appteknow.com',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Engineered a unified student lifecycle dashboard and admissions funnel, integrating secure digital certificate validation and Automated SMS/Email CRM alerts.',
    screenshots: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'java-banking-system',
    title: 'TrustNet Core Banking & Microservices',
    studentName: 'Rajesh Kumar',
    placedCompany: 'Accenture',
    courseId: 'java',
    description: 'A robust and secure core banking middleware handling thousands of transaction requests per second with Spring Boot microservices.',
    techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST API'],
    githubUrl: '',
    liveUrl: '/live-sandbox/java-banking-system',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Architected fully redundant PostgreSQL transaction logs preventing data divergence, reducing api latency by 42%.',
    screenshots: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'testing-ecom-suite',
    title: 'Apex E-Commerce Test Suite',
    studentName: 'Priya Sharma',
    placedCompany: 'Capgemini',
    courseId: 'testing',
    description: 'High-performance end-to-end test suite using Selenium Grid and Cucumber BDD, executing cross-browser sanity checks for a major retail website.',
    techStack: ['Selenium Automation', 'Core JAVA', 'Cucumber BDD', 'Maven', 'Jenkins'],
    githubUrl: '',
    liveUrl: '/live-sandbox/testing-ecom-suite',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Developed dynamic web element waiters, reducing execution flaky failures by 85% and cutting build times in half.',
    screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'python-retail-dashboard',
    title: 'PyInsight Predictive Retail Dashboard',
    studentName: 'Amit Patel',
    placedCompany: 'Cognizant',
    courseId: 'python',
    description: 'An interactive sales and analytics forecasting platform built using Django REST Framework and pandas to project future store inventory demands.',
    techStack: ['Python', 'Django Framework', 'Pandas & NumPy', 'HTML/CSS', 'PostgreSQL'],
    githubUrl: '',
    liveUrl: '/live-sandbox/python-retail-dashboard',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Implemented a sliding window forecasting algorithm, achieving an 94.2% demand projection accuracy.',
    screenshots: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'data-analytics-omni',
    title: 'OmniRetail Predictive BI Pipeline',
    studentName: 'Kiran Das',
    placedCompany: 'Cognizant',
    courseId: 'data',
    description: 'A comprehensive sales forecasting and inventory prediction dashboard combining SQLite, Python (pandas/NumPy), and interactive Power BI embeds to project future supply demands with high precision.',
    techStack: ['Python', 'Power BI', 'Pandas & NumPy', 'SQL', 'Excel Advanced Reporting'],
    githubUrl: '',
    liveUrl: '/live-sandbox/data-analytics-omni',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Engineered ETL pipelines processing 2M+ transaction rows, optimizing SQL partition indexing and generating dynamic forecast simulations with 95.8% accuracy.',
    screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'mern-dev-network',
    title: 'DevConnect SaaS Developer Network',
    studentName: 'Sanjay Mehta',
    placedCompany: 'Infosys',
    courseId: 'mern',
    description: 'A full-stack social collaboration dashboard for developers, featuring real-time feed synchronization via WebSockets and secure JWT authorization flows.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'Tailwind CSS'],
    githubUrl: '',
    liveUrl: '/live-sandbox/mern-dev-network',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Designed dual-token refresh protocols safeguarding user sessions and architected high-performance feed indices reducing DB fetch latencies.',
    screenshots: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'cyber-threat-engine',
    title: 'Aegis Shield Threat Intelligence Engine',
    studentName: 'Nisha Rao',
    placedCompany: 'Wipro',
    courseId: 'cyber',
    description: 'A robust cybersecurity operations scan dashboard monitoring threat indexes, capturing mock packet dumps, and performing multi-threaded subnet vulnerability assessments.',
    techStack: ['Kali Linux', 'Burp Suite', 'Python Scapy', 'Nmap Audit', 'Splunk SIEM'],
    githubUrl: '',
    liveUrl: '/live-sandbox/cyber-threat-engine',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Implemented non-blocking scanner loops analyzing 250+ endpoints, auditing active system ports and compiling CVE alerts in real-time.',
    screenshots: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'logistics-delivery-system',
    title: 'QuickRun Logistics Smart Delivery System',
    studentName: 'Rahul Verma',
    placedCompany: 'Capgemini',
    courseId: 'python',
    description: 'An advanced courier dispatch and map tracking console tracing live delivery progression through active geofencing and dynamic ETA calculation models.',
    techStack: ['Python', 'Django Framework', 'SQLite', 'Google Maps API', 'HTML/CSS/JS'],
    githubUrl: '',
    liveUrl: '/live-sandbox/logistics-delivery-system',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500',
    challengesSolved: 'Engineered clean routing paths utilizing vector interpolation, offering real-time updates and resolving travel delay calculations efficiently.',
    screenshots: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800']
  }
];

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000' : '';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Record<string, CourseData>>(() => {
    try {
      const stored = localStorage.getItem('appteknow_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      }
      return INITIAL_COURSES;
    } catch { return INITIAL_COURSES; }
  });

  const [placements, setPlacements] = useState<Placement[]>(INITIAL_PLACEMENTS);

  const [jobs, setJobs] = useState<JobDrive[]>(() => {
    try {
      const stored = localStorage.getItem('appteknow_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return INITIAL_JOBS;
    } catch { return INITIAL_JOBS; }
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const stored = localStorage.getItem('appteknow_inquiries');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch { return []; }
  });

  const [projects, setProjects] = useState<StudentProject[]>(() => {
    try {
      const stored = localStorage.getItem('appteknow_projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return INITIAL_PROJECTS;
    } catch { return INITIAL_PROJECTS; }
  });

  const [chatConversations, setChatConversations] = useState<ChatConversation[]>(() => {
    try {
      const stored = localStorage.getItem('appteknow_chats');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch { return []; }
  });

  // Try fetching live data from backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [coursesRes, placementsRes, jobsRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses`),
          fetch(`${API_BASE}/api/placements`),
          fetch(`${API_BASE}/api/jobs`),
          fetch(`${API_BASE}/api/projects`)
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          if (Array.isArray(coursesData) && coursesData.length > 0) {
            setCourses(prev => {
              const merged = { ...prev };
              coursesData.forEach((c: any) => { if (c.slug) merged[c.slug] = c; });
              return merged;
            });
          }
        }
        
        if (placementsRes.ok) {
          const placementsData = await placementsRes.json();
          if (Array.isArray(placementsData)) {
            setPlacements(placementsData);
          } else {
            setPlacements([]);
          }
        } else {
          setPlacements([]);
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          if (Array.isArray(jobsData) && jobsData.length > 0) setJobs(jobsData);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (Array.isArray(projectsData) && projectsData.length > 0) setProjects(projectsData);
        }

        const token = sessionStorage.getItem('appteknow_admin_token');
        if (token) {
          try {
            const inqRes = await fetch(`${API_BASE}/api/inquiries`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (inqRes.ok) {
              const inquiriesData = await inqRes.json();
              if (Array.isArray(inquiriesData)) {
                const formattedInqs = inquiriesData.map((item: any) => ({
                  ...item,
                  id: item.id.toString(),
                  date: item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString()
                }));
                setInquiries(formattedInqs);
              }
            }
          } catch (e) {
            console.error("Failed to fetch inquiries");
          }
        }
      } catch (err) {
        console.warn('Live Backend unreachable.');
      }
    };

    fetchBackendData();
  }, []);

  // Sync to localStorage as fallback
  useEffect(() => {
    localStorage.setItem('appteknow_courses', JSON.stringify(courses));
    localStorage.setItem('appteknow_placements', JSON.stringify(placements));
    localStorage.setItem('appteknow_jobs', JSON.stringify(jobs));
    localStorage.setItem('appteknow_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('appteknow_projects', JSON.stringify(projects));
    localStorage.setItem('appteknow_chats', JSON.stringify(chatConversations));
  }, [courses, placements, jobs, inquiries, projects, chatConversations]);

  // Action Handlers (Wired to Backend)
  const updateCourse = useCallback(async (slug: string, updatedData: CourseData) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/courses/${slug}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const saved = await res.json();
        setCourses(prev => ({ ...prev, [slug]: saved }));
      } else {
        throw new Error('Failed to update course');
      }
    } catch (err) {
      console.error('Failed to update course in SQLite backend, syncing local state only:', err);
      setCourses(prev => ({ ...prev, [slug]: updatedData }));
    }
  }, []);

  const addPlacement = useCallback(async (p: Omit<Placement, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/api/placements`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const saved = await res.json();
        const formatted: Placement = {
          ...saved,
          id: saved.id ? saved.id.toString() : Date.now().toString()
        };
        setPlacements(prev => [formatted, ...prev]);
      } else {
        const newP = { ...p, id: Date.now().toString() };
        setPlacements(prev => [newP, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add placement to backend', err);
      const newP = { ...p, id: Date.now().toString() };
      setPlacements(prev => [newP, ...prev]);
    }
  }, []);

  const deletePlacement = useCallback(async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/placements/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete placement from backend', err);
    }
    setPlacements(prev => prev.filter(item => item.id.toString() !== id.toString()));
  }, []);

  const clearAllPlacements = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/placements-all`, { method: 'DELETE' });
      await fetch(`${API_BASE}/api/placements-clear`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to clear placements from backend', err);
    }
    setPlacements([]);
  }, []);

  const updatePlacement = useCallback(async (id: string, p: Partial<Placement>) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/placements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const saved = await res.json();
        setPlacements(prev => prev.map(item => item.id.toString() === id.toString() ? { ...item, ...saved, id: saved.id.toString() } : item));
      }
    } catch (err) {
      console.error('Failed to update placement', err);
      setPlacements(prev => prev.map(item => item.id.toString() === id.toString() ? { ...item, ...p } : item));
    }
  }, []);

  const addJob = useCallback(async (j: Omit<JobDrive, 'id'>) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(j)
      });
      if (res.ok) {
        const saved = await res.json();
        const formatted: JobDrive = {
          ...saved,
          id: saved.id ? saved.id.toString() : Date.now().toString()
        };
        setJobs(prev => [formatted, ...prev]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error('Failed to add job to backend, falling back to local state only', err);
      const newJ = { ...j, id: Date.now().toString() };
      setJobs(prev => [newJ, ...prev]);
    }
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      if (token) {
        await fetch(`${API_BASE}/api/jobs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Failed to delete job from backend', err);
    }
    setJobs(prev => prev.filter(item => item.id.toString() !== id.toString()));
  }, []);

  const updateJob = useCallback(async (id: string, j: Partial<JobDrive>) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(j)
      });
      if (res.ok) {
        const saved = await res.json();
        setJobs(prev => prev.map(item => item.id.toString() === id.toString() ? { ...item, ...saved, id: saved.id.toString() } : item));
      }
    } catch (err) {
      console.error('Failed to update job', err);
      setJobs(prev => prev.map(item => item.id.toString() === id.toString() ? { ...item, ...j } : item));
    }
  }, []);

  const addInquiry = useCallback(async (inq: Omit<Inquiry, 'id' | 'date'>) => {
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inq)
      });
      if (res.ok) {
        const savedInq = await res.json();
        const newInq: Inquiry = {
          ...inq,
          id: savedInq.id ? savedInq.id.toString() : Date.now().toString(),
          date: savedInq.createdAt ? new Date(savedInq.createdAt).toLocaleString() : new Date().toLocaleString()
        };
        setInquiries(prev => [newInq, ...prev]);
      } else {
        throw new Error("Failed to save to backend");
      }
    } catch (err) {
      console.error('Inquiry backend failed, falling back to local state only', err);
      const newInq: Inquiry = {
        ...inq,
        id: Date.now().toString(),
        date: new Date().toLocaleString()
      };
      setInquiries(prev => [newInq, ...prev]);
    }
  }, []);

  const deleteInquiry = useCallback(async (id: string) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      if (token) {
        await fetch(`${API_BASE}/api/inquiries/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Failed to delete inquiry from backend', err);
    }
    setInquiries(prev => prev.filter(item => item.id.toString() !== id.toString()));
  }, []);

  const addProject = useCallback(async (proj: Omit<StudentProject, 'id'>) => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(proj)
      });
      if (res.ok) {
        const saved = await res.json();
        setProjects(prev => [saved, ...prev]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      const newProj = { ...proj, id: `project-${Date.now()}` };
      setProjects(prev => [newProj, ...prev]);
    }
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateProject = useCallback((id: string, updatedProj: StudentProject) => {
    setProjects(prev => prev.map(p => p.id === id ? updatedProj : p));
  }, []);

  const sendVisitorMessage = useCallback((visitorName: string, visitorPhone: string, message: string, conversationId?: string): string => {
    const convoId = conversationId || `chat-${Date.now()}`;
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      senderType: 'visitor',
      senderName: visitorName,
      message,
      timestamp: new Date().toISOString()
    };

    setChatConversations(prev => {
      const existing = prev.find(c => c.id === convoId);
      if (existing) {
        return prev.map(c => c.id === convoId ? { ...c, messages: [...c.messages, newMsg], lastActivity: new Date().toISOString() } : c);
      } else {
        const newConvo: ChatConversation = {
          id: convoId,
          visitorName,
          visitorPhone,
          messages: [newMsg],
          status: 'active',
          lastActivity: new Date().toISOString()
        };
        return [newConvo, ...prev];
      }
    });

    fetch(`${API_BASE}/api/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: visitorName,
        phone: visitorPhone,
        message,
        conversationId: convoId,
        senderType: 'visitor',
        senderName: visitorName
      })
    }).catch(err => console.error('Failed to sync message to server:', err));

    return convoId;
  }, []);

  const sendAdminReply = useCallback((id: string, message: string) => {
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      senderType: 'admin',
      senderName: 'Support',
      message,
      timestamp: new Date().toISOString()
    };

    setChatConversations(prev => prev.map(c => c.id === id ? { ...c, messages: [...c.messages, newMsg], lastActivity: new Date().toISOString() } : c));

    fetch(`${API_BASE}/api/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationId: id,
        senderType: 'admin',
        senderName: 'Support'
      })
    }).catch(err => console.error('Failed to sync admin reply to server:', err));
  }, []);

  const resolveChat = useCallback((id: string) => {
    setChatConversations(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' as const } : c));

    const token = sessionStorage.getItem('appteknow_admin_token');
    fetch(`${API_BASE}/api/chat/conversations/${id}/resolve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(err => console.error('Failed to resolve chat on server:', err));
  }, []);

  const refreshChats = useCallback(async () => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/chat/conversations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setChatConversations(data);
          }
        }
      } catch (err) {
        console.error('Failed to poll conversations for admin:', err);
      }
    } else {
      const storedConvoId = sessionStorage.getItem('appteknow_convo_id');
      if (storedConvoId) {
        try {
          const res = await fetch(`${API_BASE}/api/chat/conversations/${storedConvoId}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.id) {
              setChatConversations(prev => {
                const exists = prev.some(c => c.id === data.id);
                if (exists) {
                  return prev.map(c => c.id === data.id ? data : c);
                } else {
                  return [data, ...prev];
                }
              });
            }
          }
        } catch (err) {
          console.error('Failed to poll conversation for visitor:', err);
        }
      }
    }
  }, []);

  const refreshInquiries = useCallback(async () => {
    const token = sessionStorage.getItem('appteknow_admin_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formattedInqs = data.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            date: item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString()
          }));
          setInquiries(formattedInqs);
        }
      }
    } catch (err) {
      console.error('Failed to refresh inquiries', err);
    }
  }, []);

  return (
    <DataContext.Provider value={{ 
      courses, placements, jobs, inquiries, projects, chatConversations,
      updateCourse, addPlacement, deletePlacement, clearAllPlacements, updatePlacement, addJob, deleteJob, updateJob,
      addInquiry, deleteInquiry, addProject, deleteProject, updateProject,
      sendVisitorMessage, sendAdminReply, resolveChat, refreshChats, refreshInquiries
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within a DataProvider');
  return ctx;
};
