import React, { useState, useEffect } from 'react';
import { Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import './ConsultationForm.css';

const ConsultationForm = () => {
  const { addInquiry } = useDataContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const applyJob = params.get('applyJob');
    const company = params.get('company');
    const courseParam = params.get('course');

    const updates: Partial<typeof formData> = {};

    if (applyJob && company) {
      updates.message = `I would like to apply for the position of "${applyJob}" at "${company}". Please guide me through the priority referral process.`;
    }

    if (courseParam) {
      const validCourses = ['java', 'python', 'mern', 'testing', 'analytics', 'other'];
      if (validCourses.includes(courseParam)) {
        updates.course = courseParam;
      }
    } else if (applyJob) {
      const titleLower = applyJob.toLowerCase();
      if (titleLower.includes('java')) {
        updates.course = 'java';
      } else if (titleLower.includes('python')) {
        updates.course = 'python';
      } else if (titleLower.includes('mern') || titleLower.includes('react') || titleLower.includes('node') || titleLower.includes('web') || titleLower.includes('frontend')) {
        updates.course = 'mern';
      } else if (titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation')) {
        updates.course = 'testing';
      } else if (titleLower.includes('data') || titleLower.includes('analytics') || titleLower.includes('power') || titleLower.includes('bi')) {
        updates.course = 'analytics';
      }
    }

    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, []);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'phone') {
      // Restrict strictly to digits only, and max 10 digits
      filteredValue = value.replace(/\D/g, '').slice(0, 10);
    } else {
      // Simple sanitization: strip basic script tag strings on input
      filteredValue = value.replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '');
    }
    
    setFormData({
      ...formData,
      [name]: filteredValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Security Step 1: Honeypot Trigger Detection
    if (honeypot.trim() !== '') {
      console.warn("Bot detected via honeypot validation.");
      // Fail silently to bot agents
      setSubmitted(true); 
      return;
    }

    // Security Step 2: Enforce clean server strings
    const safeData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim().replace(/\D/g, ''), // allow only numbers
      course: formData.course,
      message: formData.message.trim()
    };

    // Save Inquiry to Global DataContext (Admin viewable)
    addInquiry(safeData);

    // Mock submit logic
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', course: '', message: '' });
      setHoneypot('');
    }, 800);
  };

  return (
    <section className="consultation-section section-padding bg-primary">
      <div className="container form-container">
        <div className="info-side">
          <h2 className="form-heading text-white">Ready to Launch Your Tech Career?</h2>
          <p className="form-desc">
            Fill in your details to book a **Free Demo Session** or schedule a direct counseling call with our senior software instructors.
          </p>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="bullet">✓</span>
              <div>
                <strong>Get Syllabus Brief:</strong> Complete breakdowns of Java, Python, or MERN.
              </div>
            </div>
            <div className="benefit-item">
              <span className="bullet">✓</span>
              <div>
                <strong>Placement Details:</strong> Learn about hiring partner lists and packages.
              </div>
            </div>
            <div className="benefit-item">
              <span className="bullet">✓</span>
              <div>
                <strong>Fee Plans:</strong> Clear up details regarding "Pay After Placement".
              </div>
            </div>
          </div>
          <div className="spam-warning">
            <ShieldAlert size={18} />
            <span>We respect your privacy. Your details will not be shared with any 3rd party recruiters.</span>
          </div>
        </div>

        <div className="form-side">
          {submitted ? (
            <div className="success-message">
              <CheckCircle2 size={60} className="success-icon" />
              <h3>Details Received Successfully!</h3>
              <p>One of our senior counselors will connect with you shortly on your registered number.</p>
              <button className="reset-btn" onClick={() => setSubmitted(false)}>Send Another Inquiry</button>
            </div>
          ) : (
            <form className="consult-form" onSubmit={handleSubmit}>
              <h3 className="form-title">Talk to Our Counsellor</h3>
              
              {/* Bot Protection Honeypot field */}
              <input 
                type="text" 
                name="address_verification_hidden"
                autoComplete="off"
                tabIndex={-1}
                style={{ display: 'none', visibility: 'hidden' }}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Ex. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Mobile / WhatsApp *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    maxLength={10}
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="course">Interested In *</label>
                <select 
                  id="course" 
                  name="course" 
                  required
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">-- Select Program --</option>
                  <option value="java">Full Stack Java</option>
                  <option value="python">Full Stack Python</option>
                  <option value="mern">MERN Stack</option>
                  <option value="testing">Software Testing</option>
                  <option value="analytics">Data Analytics</option>
                  <option value="other">Other / Unsure</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message (Optional)</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={3} 
                  placeholder="Any specific questions for the mentor?"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Request Callback <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConsultationForm;
