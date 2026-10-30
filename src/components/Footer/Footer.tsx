import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top section-padding">
        <div className="container footer-grid">
          {/* Brand Info Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-card">
                <img src={logoImg} alt="AppTeknow Careers Logo" />
              </span>
            </Link>
            <p className="brand-desc">
              Appteknow Careers BTM branch has 20+ years of Training & Placement Legacy. 
              Empowering careers by training students directly from IT companies with 100% placement support.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/appteknowcareers" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/appteknowcareers" target="_blank" rel="noopener noreferrer" aria-label="Linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://www.instagram.com/appteknowcareers/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UC7z7-_cMmvzBng3FzSibiYg" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* IT Courses Links */}
          <div className="footer-col">
            <h4 className="footer-title">IT Courses</h4>
            <ul className="footer-links">
              <li><Link to="/java-training-in-bangalore-from-it-companies-with-ai-tools"><ArrowRight size={14} /> Full Stack Java</Link></li>
              <li><Link to="/python-training-in-bangalore-from-it-companies-with-ai-tools"><ArrowRight size={14} /> Full Stack Python</Link></li>
              <li><Link to="/software-testing-selenium-with-al-from-it-companies"><ArrowRight size={14} /> Software Testing</Link></li>
              <li><Link to="/mern-training-in-bangalore-from-it-companies-with-ai-tools-2"><ArrowRight size={14} /> MERN Stack</Link></li>
              <li><Link to="/cyber-security-courses-in-bangalore"><ArrowRight size={14} /> Cyber Security</Link></li>
            </ul>
          </div>

          {/* Non-IT / Other Links */}
          <div className="footer-col">
            <h4 className="footer-title">Non-IT / Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/data-analytics-course-in-bangalore-from-it-companies"><ArrowRight size={14} /> Data Analytics</Link></li>
              <li><Link to="/digital-marketing-courses"><ArrowRight size={14} /> Digital Marketing</Link></li>
              <li><Link to="/tally-training-in-bangalore"><ArrowRight size={14} /> Tally ERP 9 + GST</Link></li>
              <li><Link to="/softskills-aptitude-training"><ArrowRight size={14} /> Soft Skills</Link></li>
              <li><Link to="/blogs"><ArrowRight size={14} /> Tech Blogs & Guides</Link></li>
              <li><Link to="/placements"><ArrowRight size={14} /> Recent Placements</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col contact-col">
            <h4 className="footer-title">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>#15b, 1st Floor, Mico Layout BTM II Stage, Bangalore - 560 076 (Near Jayadeva Bridge)</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <a href="tel:+917022928198">+91 70229 28198</a>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <a href="mailto:connect@appteknow.com">connect@appteknow.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {currentYear} AppTeknow Careers. All Rights Reserved.</p>
          <div className="legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <span className="separator">|</span>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
