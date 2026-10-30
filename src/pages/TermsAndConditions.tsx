import React from 'react';
import './LegalPages.css';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="legal-page-container">
      <div className="container">
        <header className="legal-header">
          <h1>Terms & Conditions</h1>
          <p className="legal-subtitle">Appteknow Careers — EDGtal Academy LLP</p>
        </header>

        <div className="legal-content-card">
          <p>
            Welcome to Appteknow Careers (“we,” “us,” “our”). Appteknow Careers is a brand name of EDGtal Academy LLP registered under ROC India on 05th July 2020.
          </p>
          <p>
            By accessing or using our website (<a href="https://appteknow.com" target="_blank" rel="noreferrer">https://appteknow.com</a>), you agree to comply with and be bound by the following Terms and Conditions (“Terms”). Please read these Terms carefully before using our website. If you do not agree to these Terms, please do not use our website.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing our website, you confirm that you have read, understood, and agree to be bound by these Terms and any policies referenced herein.
          </p>

          <h2>2. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2>3. Use of Website</h2>
          <p><strong>a. Eligibility:</strong> You must be at least 18 years old or have parental/guardian consent to use this website.</p>
          <p><strong>b. User Conduct:</strong> You agree not to use the website for unlawful purposes, upload or transmit harmful content (viruses/malware), or attempt to gain unauthorized access to any portion of the website.</p>
          <p><strong>c. Account Responsibilities:</strong> If you create an account, you are responsible for maintaining confidentiality of your credentials.</p>
          <p className="legal-box">
            <strong>d. Data Collection:</strong> “We collect personal details like your name, email address, and phone number etc. By sharing your information, you authorize Appteknow to contact you via SMS, RCS, WhatsApp, Email, and other communication channels. This consent overrides any NDNC/DND registration as per TRAI regulations.”
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and software, is the property of Appteknow Careers and is protected by applicable copyright and trademark laws. Unauthorized use of this content is strictly prohibited.
          </p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            Our website is provided “as is” and “as available.” We do not guarantee that the website will be error-free or uninterrupted, or the complete accuracy of all content.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Appteknow Careers will not be liable for any indirect, incidental, or consequential damages arising from your use of our website.
          </p>

          <h2>7. Third-Party Links & Governance</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the content or privacy policies of external sites. These Terms are governed by and construed in accordance with the laws of India.
          </p>

          <h2>8. Candidate Code Of Conduct</h2>
          <h3>Related to Training:</h3>
          <ul>
            <li>You are expected to attend all classes regularly with minimum 95% attendance.</li>
            <li>Only 10 minutes’ buffer time is given from the scheduled class time to join the class. Post that, trainers may mark you as absent.</li>
            <li>You should ensure completing all live assignments and assessments on time.</li>
            <li>While working on live projects, you are expected to work at Appteknow Careers institute or designated work spaces.</li>
            <li>Assets of the institute (laptops, desktops, chairs, infrastructure) are student responsibility during usage.</li>
            <li>All study materials, class videos, and courseware are the proprietary property of Appteknow Careers. Sharing this content attracts legal action.</li>
            <li><strong>Drop out Condition:</strong> As you pay partial fees up front with balance fees due post placement, dropping out within 8 months yields organizational loss. You must pay 75% of the balance fee to opt out and receive your course completion certificate.</li>
          </ul>

          <h3>Placement Process & Eligibility:</h3>
          <ul>
            <li>Minimum 95% attendance and completion of all assessments is mandatory for placement eligibility.</li>
            <li>Only candidates who complete at least two months of OJT training are eligible for placement drives.</li>
            <li>It is mandatory to attend every interview applied for. Absence is excused only for verified medical emergencies.</li>
            <li>Once you receive an official offer letter from a company through Appteknow, it cannot be rejected.</li>
          </ul>

          <h2>9. Contact Us</h2>
          <div className="contact-card">
            <p><strong>Appteknow Careers</strong></p>
            <p>No. 15, Vysya Bank Colony. BTM 2nd Stage, Bangalore – 560076</p>
            <p>Email: connect@appteknow.com | Phone: +91 70229 28198</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
