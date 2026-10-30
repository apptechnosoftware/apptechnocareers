import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import Course from '../models/Course';
import StudentProject from '../models/StudentProject';
import Placement from '../models/Placement';
import JobDrive from '../models/JobDrive';
import Inquiry from '../models/Inquiry';
import ChatConversation from '../models/ChatConversation';
import ChatMessage from '../models/ChatMessage';
import AdminSetting from '../models/AdminSetting';
import jwt_module from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'appteknow_super_secret_key_2026';

// Middleware to verify JWT
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt_module.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)!'));
    }
  }
});

// Upload route for placement student photo (single)
router.post('/upload/single', upload.single('image'), (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    res.json({ url: relativeUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
});

// Upload route for multiple screenshots
router.post('/upload/multiple', authMiddleware, upload.array('images', 10), (req: any, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const host = `${req.protocol}://${req.get('host')}`;
    const urls = (req.files as Express.Multer.File[]).map(
      file => `${host}/uploads/${file.filename}`
    );
    res.json({ urls });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
});

// --- AUTHENTICATION ---
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { username } }) as any;
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt_module.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- COURSES ---
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/courses/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ where: { slug } }) as any;
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const {
      title,
      tagline,
      details,
      duration,
      rating,
      seoTitle,
      seoDesc,
      topics,
      faqs,
      emailKey,
      emailDisplayName,
      brochureUrl,
      emailTools,
      emailHighlights
    } = req.body;

    await course.update({
      title: title !== undefined ? title : course.title,
      tagline: tagline !== undefined ? tagline : course.tagline,
      details: details !== undefined ? details : course.details,
      duration: duration !== undefined ? duration : course.duration,
      rating: rating !== undefined ? rating : course.rating,
      seoTitle: seoTitle !== undefined ? seoTitle : course.seoTitle,
      seoDesc: seoDesc !== undefined ? seoDesc : course.seoDesc,
      topics: topics !== undefined ? topics : course.topics,
      faqs: faqs !== undefined ? faqs : course.faqs,
      emailKey: emailKey !== undefined ? emailKey : course.emailKey,
      emailDisplayName: emailDisplayName !== undefined ? emailDisplayName : course.emailDisplayName,
      brochureUrl: brochureUrl !== undefined ? brochureUrl : course.brochureUrl,
      emailTools: emailTools !== undefined ? emailTools : course.emailTools,
      emailHighlights: emailHighlights !== undefined ? emailHighlights : course.emailHighlights
    });

    res.json(course);
  } catch (err: any) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// --- PROJECTS ---
router.get('/projects', async (req, res) => {
  try {
    const projects = await StudentProject.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/projects', authMiddleware, async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (!projectData.id && projectData.title) {
      projectData.id = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now();
    }
    const newProject = await StudentProject.create(projectData);
    res.status(201).json(newProject);
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// --- PLACEMENTS ---
async function getOrderedPlacements() {
  const placements = await Placement.findAll();
  const setting = await AdminSetting.findOne({ where: { key: 'placements_custom_order' } }) as any;
  
  let orderArray: number[] = [];
  if (setting && setting.value) {
    try {
      orderArray = JSON.parse(setting.value);
    } catch (e) {}
  }
  
  if (!Array.isArray(orderArray) || orderArray.length === 0) {
    // Default to id DESC
    const sorted = placements.sort((a: any, b: any) => Number(b.id) - Number(a.id));
    const defaultIds = sorted.map((p: any) => Number(p.id));
    if (setting) {
      await setting.update({ value: JSON.stringify(defaultIds) });
    } else {
      await AdminSetting.create({ key: 'placements_custom_order', value: JSON.stringify(defaultIds) });
    }
    return sorted;
  }
  
  const placementMap = new Map<number, any>();
  placements.forEach((p: any) => placementMap.set(Number(p.id), p));
  
  const orderedList: any[] = [];
  
  // Add items present in orderArray
  orderArray.forEach(id => {
    if (placementMap.has(Number(id))) {
      orderedList.push(placementMap.get(Number(id)));
      placementMap.delete(Number(id));
    }
  });
  
  // Any newly created items not in orderArray are prepended at the VERY TOP
  const unmapped = Array.from(placementMap.values()).sort((a, b) => Number(b.id) - Number(a.id));
  const finalOrdered = [...unmapped, ...orderedList];
  
  const newOrderArray = finalOrdered.map(p => Number(p.id));
  if (setting) {
    await setting.update({ value: JSON.stringify(newOrderArray) });
  } else {
    await AdminSetting.create({ key: 'placements_custom_order', value: JSON.stringify(newOrderArray) });
  }
  
  return finalOrdered;
}

router.get('/placements', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const ordered = await getOrderedPlacements();
    res.json(ordered);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/placements', async (req, res) => {
  try {
    const newPlacement = await Placement.create(req.body) as any;
    
    // Auto-prepend new placement to top of custom order
    const setting = await AdminSetting.findOne({ where: { key: 'placements_custom_order' } }) as any;
    let orderArray: number[] = [];
    if (setting && setting.value) {
      try { orderArray = JSON.parse(setting.value); } catch (e) {}
    }
    const updatedArray = [Number(newPlacement.id), ...orderArray.filter(id => Number(id) !== Number(newPlacement.id))];
    if (setting) {
      await setting.update({ value: JSON.stringify(updatedArray) });
    } else {
      await AdminSetting.create({ key: 'placements_custom_order', value: JSON.stringify(updatedArray) });
    }
    
    res.status(201).json(newPlacement);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/placements-reverse-order', authMiddleware, async (req, res) => {
  try {
    const setting = await AdminSetting.findOne({ where: { key: 'placements_custom_order' } }) as any;
    let orderArray: number[] = [];
    if (setting && setting.value) {
      try { orderArray = JSON.parse(setting.value); } catch (e) {}
    }
    if (orderArray.length === 0) {
      const all = await Placement.findAll();
      orderArray = all.map((p: any) => Number(p.id));
    }
    
    const reversed = [...orderArray].reverse();
    if (setting) {
      await setting.update({ value: JSON.stringify(reversed) });
    } else {
      await AdminSetting.create({ key: 'placements_custom_order', value: JSON.stringify(reversed) });
    }
    
    const freshOrdered = await getOrderedPlacements();
    res.json({ message: 'Placements order reversed successfully', placements: freshOrdered });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.put('/placements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await Placement.findByPk(id);
    if (!placement) return res.status(404).json({ error: 'Placement not found' });
    await placement.update(req.body);
    res.json(placement);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/placements/:id/move-to-top', async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = Number(id);
    const setting = await AdminSetting.findOne({ where: { key: 'placements_custom_order' } }) as any;
    let orderArray: number[] = [];
    if (setting && setting.value) {
      try { orderArray = JSON.parse(setting.value); } catch (e) {}
    }
    
    const filtered = orderArray.filter(i => Number(i) !== targetId);
    const newOrder = [targetId, ...filtered];
    
    if (setting) {
      await setting.update({ value: JSON.stringify(newOrder) });
    } else {
      await AdminSetting.create({ key: 'placements_custom_order', value: JSON.stringify(newOrder) });
    }
    
    const freshOrdered = await getOrderedPlacements();
    res.json({ message: 'Moved placement to top successfully', placements: freshOrdered });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/placements/:id/move-up', async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = Number(id);
    const setting = await AdminSetting.findOne({ where: { key: 'placements_custom_order' } }) as any;
    let orderArray: number[] = [];
    if (setting && setting.value) {
      try { orderArray = JSON.parse(setting.value); } catch (e) {}
    }
    
    const idx = orderArray.findIndex(i => Number(i) === targetId);
    if (idx > 0) {
      const temp = orderArray[idx];
      orderArray[idx] = orderArray[idx - 1];
      orderArray[idx - 1] = temp;
      await setting.update({ value: JSON.stringify(orderArray) });
    }
    
    const freshOrdered = await getOrderedPlacements();
    res.json({ message: 'Moved placement up successfully', placements: freshOrdered });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/placements/:id/move-down', async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = Number(id);
    const setting = await AdminSetting.findOne({ where: { key: 'placements_custom_order' } }) as any;
    let orderArray: number[] = [];
    if (setting && setting.value) {
      try { orderArray = JSON.parse(setting.value); } catch (e) {}
    }
    
    const idx = orderArray.findIndex(i => Number(i) === targetId);
    if (idx >= 0 && idx < orderArray.length - 1) {
      const temp = orderArray[idx];
      orderArray[idx] = orderArray[idx + 1];
      orderArray[idx + 1] = temp;
      await setting.update({ value: JSON.stringify(orderArray) });
    }
    
    const freshOrdered = await getOrderedPlacements();
    res.json({ message: 'Moved placement down successfully', placements: freshOrdered });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.delete('/placements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Placement.destroy({ where: { id } });
    res.json({ message: 'Placement deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.delete('/placements-all', async (req, res) => {
  try {
    await Placement.destroy({ where: {} });
    res.json({ message: 'All placements cleared successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/placements-clear', async (req, res) => {
  try {
    await Placement.destroy({ where: {} });
    res.json({ message: 'All placements cleared successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// --- JOB DRIVES ---
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await JobDrive.findAll({ order: [['createdAt', 'DESC']] });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/jobs', authMiddleware, async (req, res) => {
  try {
    const newJob = await JobDrive.create(req.body);
    res.status(201).json(newJob);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.put('/jobs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await JobDrive.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job drive not found' });
    await job.update(req.body);
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.delete('/jobs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await JobDrive.destroy({ where: { id } });
    res.json({ message: 'Job drive deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// --- INQUIRIES ---
router.get('/inquiries', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const sendResendNotification = async (inquiry: {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!apiKey || !adminEmail) {
    console.warn('[EMAIL WARNING] Resend notifications are skipped because RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL is not configured in .env');
    return;
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
            padding: 30px;
            margin: 0;
          }
          .card {
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 32px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
            border-bottom: 1px solid #334155;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .logo-text {
            font-size: 24px;
            font-weight: 800;
            color: #6366f1;
            letter-spacing: -0.5px;
          }
          .badge {
            background: rgba(99, 102, 241, 0.15);
            color: #818cf8;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 20px;
            float: right;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 5px;
          }
          .title {
            font-size: 18px;
            font-weight: 700;
            color: #f8fafc;
            margin: 0 0 15px 0;
            clear: both;
          }
          .grid {
            margin-bottom: 24px;
          }
          .grid-row {
            display: block;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            padding: 10px 0;
          }
          .label {
            font-size: 13px;
            color: #94a3b8;
            display: inline-block;
            width: 140px;
            font-weight: 600;
          }
          .value {
            font-size: 13px;
            color: #e2e8f0;
            display: inline-block;
            font-weight: 500;
          }
          .msg-box {
            background: #020617;
            border: 1px solid #1e293b;
            border-radius: 8px;
            padding: 16px;
            font-size: 13px;
            line-height: 1.6;
            color: #cbd5e1;
            margin-top: 8px;
            white-space: pre-wrap;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #475569;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="logo-text">TEKNOW</span>
            <span class="badge">Inquiry Alert</span>
          </div>
          
          <h2 class="title">New Student Inquiry Received</h2>
          
          <div class="grid">
            <div class="grid-row">
              <span class="label">Student Name:</span>
              <span class="value">${inquiry.name}</span>
            </div>
            <div class="grid-row">
              <span class="label">Email Address:</span>
              <span class="value"><a href="mailto:${inquiry.email}" style="color: #818cf8; text-decoration: none;">${inquiry.email}</a></span>
            </div>
            <div class="grid-row">
              <span class="label">Phone Number:</span>
              <span class="value"><a href="tel:${inquiry.phone}" style="color: #818cf8; text-decoration: none;">${inquiry.phone}</a></span>
            </div>
            <div class="grid-row">
              <span class="label">Target Course:</span>
              <span class="value" style="color: #fbbf24; font-weight: 700;">${inquiry.course}</span>
            </div>
          </div>
          
          <div style="font-size: 13px; color: #94a3b8; font-weight: 600;">Student Message:</div>
          <div class="msg-box">${inquiry.message}</div>
          
          <div class="footer">
            Sent automatically by Teknow Student Hub • ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Teknow Hub <onboarding@resend.dev>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [adminEmail],
        subject: `[INQUIRY ALERT] ${inquiry.name} - ${inquiry.course}`,
        html: htmlContent
      })
    });

    if (response.ok) {
      console.log(`[EMAIL SUCCESS] Resend notification dispatched successfully to ${adminEmail}`);
    } else {
      const errorText = await response.text();
      console.error(`[EMAIL ERROR] Resend API responded with error:`, errorText);
    }
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send email via Resend:`, err);
  }
};


interface StudentCourseMetadata {
  displayName: string;
  tools: string[];
  brochureUrl: string;
  keyHighlights: string[];
}

const COURSE_EMAIL_METADATA: Record<string, StudentCourseMetadata> = {
  java: {
    displayName: 'Full Stack Java Development with AI',
    tools: ['Java JDK 21', 'Spring Boot', 'Hibernate', 'MySQL', 'Git & GitHub', 'Docker', 'ReactJS', 'JUnit'],
    brochureUrl: '/brochures/JAVA-Full-Stack.pdf',
    keyHighlights: [
      'Spring Boot & Microservices enterprise architecture coding',
      'Production-grade database modeling and transaction isolation',
      'Modern frontend client integration using React.js',
      'AI Driven Code Automation with modern Copilots'
    ]
  },
  python: {
    displayName: 'Full Stack Python Development with AI',
    tools: ['Python 3.x', 'Django Framework', 'Flask Micro-services', 'PostgreSQL', 'Pandas & NumPy', 'Git & GitHub', 'Selenium Webdriver'],
    brochureUrl: '/brochures/Python-Full-Stack.pdf',
    keyHighlights: [
      'Clean modular Object-Oriented programming in Python 3',
      'High-performance backend API engineering via Django & Flask',
      'Data scientific structures using Pandas and NumPy',
      'Dynamic automated unit and UI testing integrations'
    ]
  },
  mern: {
    displayName: 'MERN Stack Web Engineering',
    tools: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redux Toolkit', 'Tailwind CSS', 'AWS Lightsail', 'Socket.io'],
    brochureUrl: '/brochures/MERN-Stack.pdf',
    keyHighlights: [
      'NoSQL database design & high concurrency query operations',
      'Highly concurrent web event loops using Node and Express',
      'Reactive state managers (Redux Toolkit) & custom hooks in React',
      'WebSocket networking streams and cloud pipeline deployment'
    ]
  },
  testing: {
    displayName: 'Software Testing & QA Automation',
    tools: ['Selenium Webdriver', 'Java Core', 'Maven Builders', 'TestNG', 'Jenkins CI/CD', 'Cucumber BDD', 'JIRA', 'Postman API'],
    brochureUrl: '/brochures/software-testing.pdf',
    keyHighlights: [
      'Cross-browser functional automation with Selenium Grid',
      'Behavior Driven Development orchestration via Cucumber',
      'CI/CD pipeline test execution triggers via Jenkins',
      'REST API regression suites using Postman and Newman'
    ]
  },
  analytics: {
    displayName: 'Data Analytics & BI Pipeline',
    tools: ['Microsoft Power BI', 'Tableau Desktop', 'SQL Server Databases', 'Pandas Analytics', 'NumPy Vectors', 'Advanced Excel VBA', 'Looker Studio'],
    brochureUrl: '/brochures/Data-Analytics.pdf',
    keyHighlights: [
      'Interactive dashboard design and data modeling inside Power BI',
      'Advanced multi-table joins, CTEs, and window procedures in SQL',
      'Large data set extraction and cleaning utilizing Pandas/NumPy',
      'Interactive reporting formats for corporate board presentations'
    ]
  },
  cyber: {
    displayName: 'Ethical Hacking & Cyber Security',
    tools: ['Kali Linux', 'Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'Nessus', 'Splunk SIEM', 'OWASP ZAP'],
    brochureUrl: '/brochures/General-Brochure.pdf',
    keyHighlights: [
      'Network defense and packet analysis using Wireshark',
      'Ethical hacking methods and vulnerability scanning',
      'Security Incident & Event Management (SIEM) operations',
      'OWASP security compliance verification'
    ]
  },
  digital: {
    displayName: 'Digital Marketing & Growth Hacking',
    tools: ['Google Analytics 4', 'Google Tag Manager', 'Ahrefs', 'SEMrush', 'Meta Ads Manager', 'Mailchimp', 'Canva Pro', 'ChatGPT API'],
    brochureUrl: '/brochures/Digital-marketing.pdf',
    keyHighlights: [
      'Advanced SEO ranking strategy & technical site audits',
      'Meta & Google paid ad campaign optimization',
      'Data tracking setups via GA4 and Google Tag Manager',
      'AI automation templates for content writing'
    ]
  },
  tally: {
    displayName: 'Tally Prime & Professional GST',
    tools: ['Tally Prime', 'GST Portals', 'MS Excel (Adv)', 'Tax Filing Softwares', 'E-Way Bill Systems', 'Payroll Processors'],
    brochureUrl: '/brochures/General-Brochure.pdf',
    keyHighlights: [
      'Account books creation & balance sheet reconciliations',
      'Direct & Indirect tax computation and GST filings',
      'Corporate payroll setups and TDS structures',
      'Advanced financial reports using Tally Prime dashboards'
    ]
  },
  softskills: {
    displayName: 'Corporate Softskills & Aptitude',
    tools: ['AI Resume Graders', 'Mock Assessment Portals', 'Body Language AI Analyzers', 'Email Drafting Engine', 'LinkedIn Persona Builders'],
    brochureUrl: '/brochures/General-Brochure.pdf',
    keyHighlights: [
      'Complete resume overhaul and LinkedIn optimization',
      'Live mock interview evaluations with panel feedback',
      'Quantitative reasoning and logical problem solving',
      'Business communication and writing tactics'
    ]
  },
  'generative-ai': {
    displayName: 'Generative AI & LLM Development',
    tools: ['OpenAI API', 'Gemini Pro API', 'LangChain', 'Pinecone Vector DB', 'Streamlit', 'Hugging Face', 'Ollama', 'Python'],
    brochureUrl: '/brochures/Generative_AI.pdf',
    keyHighlights: [
      'Prompt engineering best practices & multi-shot instructions',
      'RAG pipelines utilizing vector embeddings & databases',
      'Building complex workflows using LangChain',
      'Deploying live AI web applications'
    ]
  },
  other: {
    displayName: 'AppTeknow Tech Bootcamp',
    tools: ['Full Stack Architectures', 'QA Test Automation', 'Data Pipeline Engineering', 'Cyber Security Audits', 'Cloud Server Architecting'],
    brochureUrl: '/brochures/General-Brochure.pdf',
    keyHighlights: [
      '100% hands-on corporate lab exercises led by active architects',
      '6 Months Professional Corporate Experience Internship Badge',
      'Exclusive automated mock interview simulation ecosystem',
      '50% Course Fees Paid ONLY after you secure placement!'
    ]
  }
};

const sendStudentConfirmation = async (inquiry: {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}, host: string) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[EMAIL WARNING] Student confirmation email skipped because RESEND_API_KEY is not configured in .env');
    return;
  }

  try {
    // Resolve course metadata from database dynamically or fall back to static
    let metadata: StudentCourseMetadata | null = null;
    try {
      const courseKey = inquiry.course || 'other';
      const dbCourse = await Course.findOne({ where: { emailKey: courseKey } }) as any;
      if (dbCourse) {
        metadata = {
          displayName: dbCourse.emailDisplayName || dbCourse.title,
          tools: dbCourse.emailTools || [],
          brochureUrl: dbCourse.brochureUrl || 'https://appteknow.com/brochures/AppTeknow_General_Brochure.pdf',
          keyHighlights: dbCourse.emailHighlights || []
        };
      }
    } catch (dbErr) {
      console.error('[EMAIL ERROR] Failed to query Course from SQLite, falling back to static config:', dbErr);
    }

    if (!metadata) {
      const courseKey = inquiry.course && COURSE_EMAIL_METADATA[inquiry.course] ? inquiry.course : 'other';
      metadata = COURSE_EMAIL_METADATA[courseKey];
    }

    const toolsBadges = metadata.tools
      .map(
        tool =>
          `<span style="display: inline-block; background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.25); color: #a5b4fc; font-size: 12px; font-weight: 600; padding: 4px 10px; margin: 4px; border-radius: 6px; font-family: sans-serif;">${tool}</span>`
      )
      .join('');

    const highlightsList = metadata.keyHighlights
      .map(
        highlight =>
          `<li style="font-size: 14px; color: #cbd5e1; margin-bottom: 8px; font-family: sans-serif; line-height: 1.5;"><strong style="color: #818cf8;">✓</strong> ${highlight}</li>`
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AppTeknow Careers</title>
      </head>
      <body style="background-color: #0b0f19; color: #f8fafc; padding: 20px 10px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="background-color: #151d30; border: 1px solid #233252; border-radius: 16px; padding: 32px 24px; max-width: 600px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Brand Header -->
          <div style="border-bottom: 1px solid #233252; padding-bottom: 20px; margin-bottom: 28px; text-align: center;">
            <span style="font-size: 28px; font-weight: 800; color: #6366f1; letter-spacing: -0.5px;">AppTeknow</span>
            <span style="display: block; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Accelerate your tech career</span>
          </div>
          
          <!-- Dynamic Welcoming Title -->
          <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; text-align: center; margin: 0 0 16px 0;">Welcome to AppTeknow Careers! 🚀</h2>
          
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-top: 0;">Hey <strong>${inquiry.name}</strong>,</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            Thank you for taking the first step to launch your professional engineering journey. You have inquired about our premium <strong>${metadata.displayName}</strong>.
          </p>
          
          <!-- Key Course Highlights Card -->
          <div style="background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h4 style="font-size: 14px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">What you will master:</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0;">
              ${highlightsList}
            </ul>
          </div>
          
          <!-- Key Tools Badges Card -->
          <div style="margin: 24px 0;">
            <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0;">Ecosystem & Tools Covered:</h4>
            <div style="margin: 0 -4px;">
              ${toolsBadges}
            </div>
          </div>
          
          <!-- Action Call: Download Syllabus Brochure -->
          <div style="text-align: center; margin: 32px 0 24px 0;">
            <a href="${host}/thank-you-page?token=valid&course=${inquiry.course || 'other'}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; font-size: 15px; font-weight: 700; padding: 14px 28px; text-decoration: none; border-radius: 8px; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4); font-family: sans-serif;">
              Download Course Syllabus PDF
            </a>
            <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 10px;">Click above to access your dynamic curriculum outline instantly.</span>
          </div>
 
          <!-- Extra Brand Perks Box -->
          <div style="background-color: rgba(99, 102, 241, 0.05); border: 1px dashed rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 16px; margin: 24px 0 0 0; text-align: left;">
            <h5 style="font-size: 13px; font-weight: 700; color: #818cf8; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">The AppTeknow Assured Placement Model:</h5>
            <p style="font-size: 13px; line-height: 1.5; color: #cbd5e1; margin: 0;">
              Work under real corporate team simulations on live server projects. Get <strong>6 months of verified corporate experience credentials</strong>, and pay up to 50% of the course fees only **after** securing your dream job!
            </p>
          </div>
 
          <!-- Professional Footer & Signature -->
          <div style="border-top: 1px solid #233252; padding-top: 20px; margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.6;">
            <p style="margin: 0 0 4px 0;">Have immediate questions? Connect with our senior leads directly:</p>
            <p style="margin: 0 0 12px 0;">
              📞 <a href="tel:+917022928198" style="color: #818cf8; text-decoration: none; font-weight: 600;">+91 70229 28198</a> (Academic Counselors) <br>
              💬 <a href="https://wa.me/917022928198" style="color: #818cf8; text-decoration: none; font-weight: 600;">Chat on WhatsApp</a>
            </p>
            <p style="margin: 0; font-size: 11px; color: #475569;">
              AppTeknow Careers Hub • #15b, 1st Floor, Mico Layout, BTM II Stage, Bangalore - 560076
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `;

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'AppTeknow <onboarding@resend.dev>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [inquiry.email],
        subject: `Your ${metadata.displayName} Syllabus - AppTeknow Careers`,
        html: htmlContent
      })
    });

    if (response.ok) {
      console.log(`[STUDENT EMAIL SUCCESS] Dynamic welcome email dispatched successfully to ${inquiry.email}`);
    } else {
      const errorText = await response.text();
      console.error(`[STUDENT EMAIL ERROR] Resend API responded with error:`, errorText);
    }
  } catch (err) {
    console.error(`[STUDENT EMAIL ERROR] Failed to send email via Resend:`, err);
  }
};

router.post('/inquiries', async (req, res) => {
  try {
    // Honeypot anti-spam protection (bots tend to fill out all visible/invisible input fields)
    if (req.body.fax || req.body.website) {
      console.warn('[SPAM BLOCKED] Inquiry honeypot triggered by bot request.');
      // Return a simulated success so the bot does not retry
      return res.status(201).json({ id: 'bot-inquiry-id', name: req.body.name });
    }

    const newInq = await Inquiry.create(req.body) as any;

    // Asynchronously dispatch Resend notification to Admin (non-blocking)
    sendResendNotification({
      name: newInq.name,
      email: newInq.email,
      phone: newInq.phone,
      course: newInq.course,
      message: newInq.message
    });

    // Asynchronously dispatch custom welcome email to Student (non-blocking)
    const host = `${req.protocol}://${req.get('host')}`;
    sendStudentConfirmation({
      name: newInq.name,
      email: newInq.email,
      phone: newInq.phone,
      course: newInq.course,
      message: newInq.message
    }, host);

    res.status(201).json(newInq);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Inquiry.destroy({ where: { id } });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- LIVE CHAT ENDPOINTS ---

// Fetch all conversations (Admin View)
router.get('/chat/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await ChatConversation.findAll({ order: [['lastActivity', 'DESC']] }) as any[];
    const formattedConvos = await Promise.all(conversations.map(async (convo) => {
      const messages = await ChatMessage.findAll({
        where: { conversationId: convo.id },
        order: [['timestamp', 'ASC']]
      });
      return {
        id: convo.id,
        visitorName: convo.visitorName,
        visitorPhone: convo.visitorPhone,
        status: convo.status,
        lastActivity: convo.lastActivity,
        messages: messages.map((m: any) => ({
          id: m.id,
          senderType: m.senderType,
          senderName: m.senderName,
          message: m.message,
          timestamp: m.timestamp
        }))
      };
    }));
    res.json(formattedConvos);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Fetch single conversation messages (Visitor/Admin View)
router.get('/chat/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const convo = await ChatConversation.findByPk(id) as any;
    if (!convo) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const messages = await ChatMessage.findAll({
      where: { conversationId: id },
      order: [['timestamp', 'ASC']]
    });
    res.json({
      id: convo.id,
      visitorName: convo.visitorName,
      visitorPhone: convo.visitorPhone,
      status: convo.status,
      lastActivity: convo.lastActivity,
      messages: messages.map((m: any) => ({
        id: m.id,
        senderType: m.senderType,
        senderName: m.senderName,
        message: m.message,
        timestamp: m.timestamp
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Send message (Visitor / Admin)
router.post('/chat/messages', async (req, res) => {
  try {
    const { name, phone, message, conversationId, senderType, senderName } = req.body;
    
    let convoId = conversationId;
    let convo: any = null;

    if (convoId) {
      convo = await ChatConversation.findByPk(convoId);
    }

    if (!convo) {
      // Create new conversation
      convoId = conversationId || `chat-${Date.now()}`;
      convo = await ChatConversation.create({
        id: convoId,
        visitorName: name || 'Visitor',
        visitorPhone: phone || '',
        status: 'active',
        lastActivity: new Date()
      });
    } else {
      // Update conversation activity
      await convo.update({ lastActivity: new Date() });
    }

    const msgId = `msg-${Date.now()}`;
    const newMsg = await ChatMessage.create({
      id: msgId,
      conversationId: convoId,
      senderType: senderType || 'visitor',
      senderName: senderName || name || 'Visitor',
      message: message,
      timestamp: new Date()
    }) as any;

    res.status(201).json({
      conversationId: convoId,
      message: {
        id: newMsg.id,
        senderType: newMsg.senderType,
        senderName: newMsg.senderName,
        message: newMsg.message,
        timestamp: newMsg.timestamp
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Resolve a conversation (Admin View)
router.put('/chat/conversations/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const convo = await ChatConversation.findByPk(id) as any;
    if (!convo) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    await convo.update({ status: 'resolved' });
    res.json({ message: 'Conversation resolved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * GET /api/admin/payments
 * Lists all course registrations & fees payment logs.
 */
router.get('/payments', authMiddleware, async (req, res) => {
  try {
    const PaymentModel = require('../models/Payment').default;
    const payments = await PaymentModel.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * POST /api/admin/payments/:id/approve
 * Approves a pending screenshot payment.
 */
router.post('/payments/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const PaymentModel = require('../models/Payment').default;
    const payment = await PaymentModel.findByPk(id) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }
    await payment.update({ status: 'Success' });
    res.json({ success: true, message: 'Payment approved successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * POST /api/admin/payments/:id/reject
 * Rejects a pending screenshot payment with an optional failure message.
 */
router.post('/payments/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { failureMessage } = req.body;
    const PaymentModel = require('../models/Payment').default;
    const payment = await PaymentModel.findByPk(id) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }
    await payment.update({ 
      status: 'Failure',
      failureMessage: failureMessage || 'Payment screenshot verification failed.'
    });
    res.json({ success: true, message: 'Payment rejected.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * POST /api/admin/upi-details
 * Updates the UPI ID and/or uploads a new UPI QR Code image.
 */
router.post('/upi-details', authMiddleware, upload.single('qrCode'), async (req: any, res: any) => {
  try {
    const { upiId } = req.body;

    if (upiId) {
      const upiSetting = await AdminSetting.findOne({ where: { key: 'upi_id' } }) as any;
      if (upiSetting) {
        await upiSetting.update({ value: upiId });
      } else {
        await AdminSetting.create({ key: 'upi_id', value: upiId });
      }
    }

    if (req.file) {
      const qrCodeUrl = `/uploads_qr/${req.file.filename}`;
      const qrSetting = await AdminSetting.findOne({ where: { key: 'upi_qr_code' } }) as any;
      if (qrSetting) {
        await qrSetting.update({ value: qrCodeUrl });
      } else {
        await AdminSetting.create({ key: 'upi_qr_code', value: qrCodeUrl });
      }
    }

    // Return the updated values
    const finalUpiSetting = await AdminSetting.findOne({ where: { key: 'upi_id' } }) as any;
    const finalQrSetting = await AdminSetting.findOne({ where: { key: 'upi_qr_code' } }) as any;

    res.json({
      success: true,
      upiId: finalUpiSetting ? finalUpiSetting.value : 'pay@appteknow',
      upiQrCode: finalQrSetting ? finalQrSetting.value : ''
    });

  } catch (err: any) {
    console.error('Error updating UPI settings:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;

