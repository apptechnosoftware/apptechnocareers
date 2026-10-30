import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Calendar, Server, UserCheck, ShieldCheck, Cpu, Clock, MapPin, ChevronDown, ChevronUp, TrendingUp, Users, Wrench, Target } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { useDataContext } from '../context/DataContext';
import StudentProjects from '../components/StudentProjects/StudentProjects';
import './CourseDetail.css';

// courseDataMap is now sourced dynamically from Context to allow admin editing.

const getBreadcrumbTitle = (slug: string | undefined) => {
  if (!slug) return '';
  if (slug.includes('java')) return 'Full Stack Java';
  if (slug.includes('python')) return 'Full Stack Python';
  if (slug.includes('testing')) return 'Software Testing';
  if (slug.includes('mern')) return 'MERN Stack';
  if (slug.includes('cyber-security')) return 'Cyber Security';
  if (slug.includes('data-analytics')) return 'Data Analytics';
  if (slug.includes('digital-marketing')) return 'Digital Marketing';
  if (slug.includes('tally')) return 'Tally ERP';
  if (slug.includes('softskills')) return 'Softskills & Aptitude';
  return 'Course Detail';
};

// Local metadata mapping specifically to inject SEO-focused visual dashboards per course ID
const courseRichAddons: Record<string, {
  audience: string[];
  tools: string[];
  salaryLow: string;
  salaryHigh: string;
  marketDemand: string;
}> = {
  java: {
    audience: ['CS / IT / Non-CS Freshers seeking high-paying IT jobs', 'Final Year engineering students preparing for campus placements', 'Testing professionals moving into Java development'],
    tools: ['Java JDK 21', 'Spring Boot', 'Hibernate', 'MySQL', 'Git & GitHub', 'Docker', 'ReactJS', 'JUnit'],
    salaryLow: '₹4.5 LPA',
    salaryHigh: '₹12+ LPA',
    marketDemand: 'Critical High'
  },
  python: {
    audience: ['Python enthusiasts & web developers', 'Data Science aspirants', 'Automation engineers', 'Fresh graduates'],
    tools: ['Python 3.x', 'Django', 'Flask', 'PostgreSQL', 'Pandas', 'NumPy', 'Git', 'Selenium'],
    salaryLow: '₹4.0 LPA',
    salaryHigh: '₹10+ LPA',
    marketDemand: 'High'
  },
  testing: {
    audience: ['Graduates seeking entry into IT without complex coding', 'Manual testers aiming for high-paying automation roles', 'BCA/MCA/BSc candidates'],
    tools: ['Selenium Webdriver', 'Java Core', 'Maven', 'TestNG', 'Jenkins CI/CD', 'Cucumber BDD', 'JIRA', 'Postman API'],
    salaryLow: '₹3.5 LPA',
    salaryHigh: '₹8.5 LPA',
    marketDemand: 'Very Stable'
  },
  mern: {
    audience: ['Full Stack JS enthusiasts', 'Frontend developers scaling to backend', 'MERN SaaS founders & startup engineers'],
    tools: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'AWS Lightsail', 'Vercel'],
    salaryLow: '₹5.0 LPA',
    salaryHigh: '₹14+ LPA',
    marketDemand: 'Exponential Growth'
  },
  cyber: {
    audience: ['Network admins & security enthusiasts', 'Ethical hacking hobbyists', 'IT security managers'],
    tools: ['Kali Linux', 'Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'Nessus', 'Splunk SIEM', 'OWASP ZAP'],
    salaryLow: '₹6.0 LPA',
    salaryHigh: '₹16+ LPA',
    marketDemand: 'Extreme High'
  },
  analytics: {
    audience: ['B.Com / BBA / MBA professionals scaling tech data analytics', 'Business analysts moving to modern dashboarding', 'Freshers'],
    tools: ['Microsoft Power BI', 'Tableau Prep', 'Advanced Excel / VBA', 'SQL Server', 'Python (Pandas)', 'Alteryx', 'Google Looker Studio', 'Jupyter'],
    salaryLow: '₹4.2 LPA',
    salaryHigh: '₹11+ LPA',
    marketDemand: 'Hyper Demand'
  },
  digital: {
    audience: ['Marketing graduates', 'Business owners seeking brand scale', 'Freelance content creators & SEO beginners'],
    tools: ['Google Analytics 4', 'Google Tag Manager', 'Ahrefs', 'SEMrush', 'Meta Ads Manager', 'Mailchimp', 'Canva Pro', 'ChatGPT API'],
    salaryLow: '₹3.0 LPA',
    salaryHigh: '₹7.5 LPA',
    marketDemand: 'High / Entrepreneurial'
  },
  tally: {
    audience: ['Accounting graduates', 'B.Com/M.Com job seekers', 'Finance assistants'],
    tools: ['Tally Prime', 'GST Portals', 'MS Excel (Adv)', 'Tax Filing Softwares', 'E-Way Bill Systems', 'Payroll Processors'],
    salaryLow: '₹2.5 LPA',
    salaryHigh: '₹5.0 LPA',
    marketDemand: 'Consistent'
  },
  softskills: {
    audience: ['Candidates facing recurring interview rejections', 'Professionals seeking corporate communication mastery', 'Final year graduates'],
    tools: ['AI Resume Graders', 'Mock Assessment Portals', 'Body Language AI Analyzers', 'Email Drafting Engine', 'LinkedIn Persona Builders'],
    salaryLow: 'N/A',
    salaryHigh: 'Boosts placement odds by 80%',
    marketDemand: 'Universal Essential'
  },
  'generative-ai': {
    audience: ['Python developers wanting to learn AI', 'Software engineers looking to transition to LLMs', 'AI hobbyists'],
    tools: ['OpenAI API', 'Gemini Pro API', 'LangChain', 'Pinecone Vector DB', 'Streamlit', 'Hugging Face', 'Ollama', 'Python'],
    salaryLow: '₹6.5 LPA',
    salaryHigh: '₹18+ LPA',
    marketDemand: 'Extreme High'
  },
  other: {
    audience: ['Engineering graduates looking for IT career entry', 'Non-CS students preparing for IT roles', 'Professionals seeking general bootcamps'],
    tools: ['Full Stack Architectures', 'QA Test Automation', 'Data Pipeline Engineering', 'Cyber Security Audits', 'Cloud Server Architecting'],
    salaryLow: '₹3.5 LPA',
    salaryHigh: '₹8.0 LPA',
    marketDemand: 'High / Flexible'
  }
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { courses } = useDataContext();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Fallback if route matching fails
  const defaultKey = 'java-training-in-bangalore-from-it-companies-with-ai-tools';
  const lookupKey = id ? id.replace(/_/g, '-') : defaultKey;
  const course = courses[id || defaultKey] || courses[lookupKey] || courses[defaultKey];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Retrieve rich metrics for the current course
  const courseId = course.emailKey || (typeof course.id === 'string' ? course.id : 'java');
  const richData = courseRichAddons[courseId] || courseRichAddons['java'];

  // Ultra High-Intent @graph JSON-LD to secure Course Listing AND Collapsible FAQ rich snippets on Google
  const courseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": course.title,
        "description": course.seoDesc,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Appteknow Careers",
          "sameAs": "https://appteknow.com"
        },
        "educationalLevel": "Intermediate to Advanced",
        "offers": {
          "@type": "Offer",
          "category": "Professional IT Training",
          "offeredBy": {
            "@type": "EducationalOrganization",
            "name": "Appteknow Careers"
          }
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": ["blended", "classroom", "online"],
          "location": course.location,
          "courseSchedule": {
            "@type": "Schedule",
            "duration": course.duration,
            "repeatFrequency": "Daily",
            "byDay": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": (course.faqs || []).map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <>
      {/* Dynamic SEO & Structured Data Management */}
      <SEO 
        title={course.seoTitle} 
        description={course.seoDesc} 
        schema={courseSchema}
        type="article"
      />

      <main className="course-detail-page">
        {/* Subpage Hero */}
        <div className="course-hero">
          <div className="container course-hero-container">
            <span className="bread">
              <Link to="/">Home</Link> &raquo; <Link to="/#courses">Courses</Link> &raquo; {getBreadcrumbTitle(id)}
            </span>
            <h1 className="course-title-main">{course.title}</h1>
            <p className="course-intro">{course.tagline}</p>
            
            <div className="course-meta-grid">
              <div className="meta-item">
                <Calendar size={18} />
                <span><strong>Duration:</strong> {course.duration}</span>
              </div>
              <div className="meta-item">
                <Clock size={18} />
                <span><strong>Shift:</strong> {course.shiftHours}</span>
              </div>
              <div className="meta-item">
                <Calendar size={18} />
                <span><strong>Days:</strong> {course.days}</span>
              </div>
              <div className="meta-item">
                <MapPin size={18} />
                <span><strong>Location:</strong> {course.location}</span>
              </div>
            </div>

            <div className="course-hero-actions">
              <a href="#syllabus" className="btn btn-primary btn-lg">
                Download Syllabus <ArrowRight size={18} />
              </a>
              <Link to="/contact" className="btn btn-outline btn-lg text-white border-white">
                Talk to Mentor
              </Link>
            </div>
          </div>
        </div>

        {/* Target Audience & Career Stats (High Value SEO & User Insights) */}
        <section className="career-stats-section section-padding">
          <div className="container">
            <div className="career-stats-grid">
              {/* Target Audience Card */}
              <div className="stats-info-card">
                <div className="stats-card-header">
                  <Target className="stats-icon-main" size={24} />
                  <h3>Who Should Take This Program?</h3>
                </div>
                <ul className="stats-audience-list">
                  {richData.audience.map((item, idx) => (
                    <li key={idx}>
                      <Users size={16} className="bullet-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Career Outlook Card */}
              <div className="stats-info-card career-accent-card">
                <div className="stats-card-header">
                  <TrendingUp className="stats-icon-main" size={24} />
                  <h3>Career Growth & Salary Outlook</h3>
                </div>
                <div className="salary-metrics">
                  <div className="salary-sub-item">
                    <span className="salary-label">Market Demand</span>
                    <span className="salary-value highlight-blue">{richData.marketDemand}</span>
                  </div>
                  <div className="salary-sub-item">
                    <span className="salary-label">Average Freshers Package</span>
                    <span className="salary-value">{richData.salaryLow}</span>
                  </div>
                  <div className="salary-sub-item">
                    <span className="salary-label">Experienced Package Up to</span>
                    <span className="salary-value">{richData.salaryHigh}</span>
                  </div>
                </div>
                <p className="salary-disclaimer">Source: Glassdoor & LinkedIn jobs index Bangalore.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose This Course Section */}
        <section className="why-choose-course section-padding bg-alt">
          <div className="container">
            <div className="why-choose-grid">
              <div className="why-choose-left">
                <span className="sub-heading">The AppTeknow Edge</span>
                <h2 className="why-title">Why Should You Join This Program?</h2>
                <p className="why-desc">
                  Unlike standard classroom theory, this immersive bootcamp is engineered from scratch to mirror working as a software professional inside a top-tier IT company.
                </p>
                <div className="metrics-badge-group">
                  <div className="metric-item">
                    <span className="num">100%</span>
                    <span className="lbl">Practical Labs</span>
                  </div>
                  <div className="metric-item">
                    <span className="num">1:1</span>
                    <span className="lbl">Expert Architects</span>
                  </div>
                </div>
              </div>
              
              <div className="why-choose-right">
                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <Server size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3>Enterprise Ecosystem</h3>
                    <p>Simulated deployment servers, modern git flows, and secure repos. Deploy on cloud labs, not just localhost.</p>
                  </div>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <UserCheck size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3>IT Architect Mentors</h3>
                    <p>Gain deep tactical advice directly from senior tech leads and managers actively delivering enterprise software daily.</p>
                  </div>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3>Placement Assurance</h3>
                    <p>Accelerated pipeline access. Plus, we guarantee 50% post-placement fee payment, aligned with your job win.</p>
                  </div>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <Cpu size={24} />
                  </div>
                  <div className="benefit-info">
                    <h3>Built-In AI Toolkits</h3>
                    <p>Free enterprise access to proprietary automated mock interviewer suites and dedicated AI English training modules.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills You Master Section */}
        <section className="skills-master-section section-padding">
          <div className="container">
            <div className="skills-grid">
              <div className="skills-content">
                <span className="sub-heading">Accelerated Learning</span>
                <h2 className="section-title">Skills You Master</h2>
                <p className="skills-lead">{course.details}</p>
                <p className="skills-lead">
                  Our innovative AI tools for Resume Building, Mock Interviews & English Communication keep you steps ahead of the competition. Pay 50% fee only after you secure your placement.
                </p>
                
                <div className="skills-bullets">
                  <div className="skill-bullet-item">
                    <CheckCircle2 size={20} className="accent" />
                    <span>Project training from IT companies</span>
                  </div>
                  <div className="skill-bullet-item">
                    <CheckCircle2 size={20} className="accent" />
                    <span>6 months corporate experience certificate</span>
                  </div>
                  <div className="skill-bullet-item">
                    <CheckCircle2 size={20} className="accent" />
                    <span>AI-powered placement ecosystem assistance</span>
                  </div>
                  <div className="skill-bullet-item">
                    <CheckCircle2 size={20} className="accent" />
                    <span>Daily dedicated interview training cycles</span>
                  </div>
                </div>
              </div>
              <div className="skills-alumni-logos">
                <div className="alumni-card">
                  <h4>Trusted By Enterprise Teams</h4>
                  <p>Our corporate partnerships facilitate direct tech placement access.</p>
                  <div className="brand-matrix">
                    <div className="brand-badge">Accenture</div>
                    <div className="brand-badge">TCS</div>
                    <div className="brand-badge">Infosys</div>
                    <div className="brand-badge">Wipro</div>
                    <div className="brand-badge">Capgemini</div>
                    <div className="brand-badge">Cognizant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies & Tools Ecosystem Grid (SEO Intent Optimization) */}
        <section className="tools-ecosystem bg-alt section-padding">
          <div className="container text-center">
            <div className="tools-header" style={{ marginBottom: '40px' }}>
              <span className="sub-heading">The Modern Toolkit</span>
              <h2 className="section-title">Ecosystem & Tools Covered</h2>
              <p className="section-subtitle">Gain hands-on execution mastery across standard professional tech architectures.</p>
            </div>
            <div className="tools-grid-container">
              {richData.tools.map((tool, idx) => (
                <div key={idx} className="tool-tag-card">
                  <div className="tool-icon-accent"><Wrench size={16} /></div>
                  <span className="tool-tag-name">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Syllabus & Details */}
        <section className="container syllabus-section section-padding" id="syllabus">
          <div className="syllabus-grid">
            <div className="syllabus-left">
              <h2 className="syllabus-header">Comprehensive Module Breakdown</h2>
              <p className="syllabus-sub">Each topic is designed with active IT enterprise standards in mind, including hands-on labs for each phase.</p>
              
              <div className="topics-list">
                {course.topics.map((topic: string, i: number) => (
                  <div key={i} className="topic-item">
                    <div className="topic-num">Phase {i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
                    <div className="topic-content">
                      <h4>{topic}</h4>
                      <p>Deep dive with practical deployments, corporate assessments, and dedicated mock interview readiness.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="syllabus-right">
              <div className="sticky-sidebar">
                <div className="sidebar-card">
                  <h3>Enroll in this batch</h3>
                  <p>Classes starting this coming Monday. Fully supported via AI tools & resume boosts.</p>
                  
                  <ul className="enroll-highlights">
                    <li><CheckCircle2 size={16} className="accent" /> Pay Up to 50% After Job</li>
                    <li><CheckCircle2 size={16} className="accent" /> Active IT Corporate Mentors</li>
                    <li><CheckCircle2 size={16} className="accent" /> Daily Scheduled Interviews</li>
                    <li><CheckCircle2 size={16} className="accent" /> Industry Experience Badge</li>
                  </ul>

                  <Link to="/contact" className="enroll-sidebar-btn">
                    Book Seat Now
                  </Link>
                  <Link 
                    to={`/pay-fees?course=${course.id}`} 
                    className="enroll-sidebar-pay-btn"
                    onClick={() => {
                      const stored = localStorage.getItem('appteknow_cart_courses');
                      let cart: string[] = [];
                      try {
                        if (stored) cart = JSON.parse(stored);
                      } catch {}
                      if (!cart.includes(course.id)) {
                        cart.push(course.id);
                        localStorage.setItem('appteknow_cart_courses', JSON.stringify(cart));
                        window.dispatchEvent(new Event('cart-updated'));
                      }
                    }}
                  >
                    Enroll & Pay Fees
                  </Link>
                  <span className="sidebar-notice">* Only 15 seats available per batch for maximum focus.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contextual Real Student Projects Grid */}
        <StudentProjects courseFilter={course.id} />

        {/* Course FAQ Section */}
        {course.faqs && course.faqs.length > 0 && (
          <section className="course-faq-section section-padding bg-alt">
            <div className="container mini-container">
              <div className="text-center mb-5">
                <span className="sub-heading">Got Questions?</span>
                <h2 className="section-title">Frequently Asked Questions</h2>
              </div>

              <div className="faq-accordion">
                {course.faqs.map((faq: any, idx: number) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className={`faq-item ${isOpen ? 'faq-open' : ''}`}>
                      <button className="faq-header" onClick={() => toggleFaq(idx)}>
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {isOpen && (
                        <div className="faq-body">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default CourseDetail;
