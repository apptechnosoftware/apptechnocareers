import React from 'react';
import './LegalPages.css';

const Disclaimer: React.FC = () => {
  return (
    <div className="legal-page-container">
      <div className="container">
        <header className="legal-header">
          <h1>Disclaimer</h1>
          <p className="legal-subtitle">Appteknow Careers — General Information Disclaimer</p>
        </header>

        <div className="legal-content-card">
          <p>
            The information provided on the Appteknow Careers website (<a href="https://appteknow.com" target="_blank" rel="noreferrer">https://appteknow.com</a>) is for general informational and educational purposes only. While we strive to keep the content accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is strictly at your own risk.
          </p>

          <h2>1. Professional Advice</h2>
          <p>
            The content on this website does not constitute professional career or legal advice. It is provided for educational and informational purposes only. You should consult with a qualified career advisor or counsellor for advice specific to your individual career situation.
          </p>

          <h2>2. Third-Party Content & Links</h2>
          <p>
            Our website may include links to third-party websites or services for your convenience. Appteknow Careers does not endorse, control, or guarantee the accuracy, relevance, or completeness of any third-party information. Accessing such links is done at your own discretion and risk.
          </p>

          <h2>3. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Appteknow Careers shall not be held liable for any loss or damage, including but not limited to indirect or consequential loss or damage, or any loss or damage whatsoever arising from:
          </p>
          <ul>
            <li>The use or misuse of this website.</li>
            <li>Inability to access the website or services.</li>
            <li>Reliance on any information provided herein.</li>
          </ul>

          <h2>4. No Warranties</h2>
          <p>
            This website is provided “as is” without any representations or warranties, express or implied. Appteknow Careers makes no representations or warranties regarding the continuous availability, accuracy, or completeness of the content on this site.
          </p>

          <h2>5. Changes to Content</h2>
          <p>
            We reserve the right to modify, update, or remove any content on this website at any time without prior notice. Appteknow Careers does not guarantee that the website will be available at all times or that it will be free from errors or interruptions.
          </p>

          <h2>6. Indemnity</h2>
          <p>
            By using our website, you agree to indemnify and hold harmless Appteknow Careers, its partners, affiliates, and employees from any claims, liabilities, damages, losses, or expenses arising from your use of the website or breach of these terms.
          </p>

          <h2>7. Contact Us</h2>
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

export default Disclaimer;
