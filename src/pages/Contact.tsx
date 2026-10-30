import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ConsultationForm from '../components/ConsultationForm/ConsultationForm';
import SEO from '../components/SEO/SEO';
import './Contact.css';

const Contact = () => {
  return (
    <>
      <SEO 
        title="Contact Best Job Training Institute - AppTeknow Careers Bangalore" 
        description="Visit the premier Job Training Institute in BTM Layout, Bangalore. Connect with IT training career advisors directly to book a free demo class today!"
      />
      <main className="contact-page">
      <div className="contact-hero text-center bg-primary">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>Have any questions about our syllabus, certifications, or placements? We are here to guide you.</p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="contact-top-grid">
          <div className="contact-info-card">
            <div className="info-icon"><MapPin size={24} /></div>
            <h3>Visit Our BTM Institute Campus</h3>
            <p>#15b, 1st Floor, Mico Layout BTM II Stage, Bangalore - 560 076</p>
            <span className="landmark">Landmark: Near Jayadeva Bridge, BTM Layout</span>
          </div>

          <div className="contact-info-card">
            <div className="info-icon"><Phone size={24} /></div>
            <h3>Call Directly</h3>
            <p>Connect with our academic counselors.</p>
            <a href="tel:+917022928198" className="contact-val">+91 70229 28198</a>
          </div>

          <div className="contact-info-card">
            <div className="info-icon"><Mail size={24} /></div>
            <h3>Email Us</h3>
            <p>We will respond to queries in 1 business hour.</p>
            <a href="mailto:connect@appteknow.com" className="contact-val">connect@appteknow.com</a>
          </div>

          <div className="contact-info-card">
            <div className="info-icon"><Clock size={24} /></div>
            <h3>Office Hours</h3>
            <p>Monday - Saturday: 9:00 AM to 7:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        {/* Google Map Frame Replica */}
        <div className="map-wrapper">
          <iframe 
            title="AppTeknow Careers BTM Institute Campus Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9624587983424!2d77.60215587454466!3d12.909803316234163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae14f0d2b7b5c9%3A0x2c7e5b8f2e8d4a6c!2sMico%20Layout%2C%20BTM%202nd%20Stage%2C%20Bengaluru%2C%20Karnataka%20560076!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '16px' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Reuse Consultation Form for direct query submissions */}
      <ConsultationForm />
    </main>
    </>
  );
};

export default Contact;
