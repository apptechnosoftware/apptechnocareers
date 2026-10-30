import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle, XCircle, Info } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import './MockPaymentGateway.css';

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000' : '';

const MockPaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state data passed during checkout redirection
  const paymentData = location.state as {
    orderId: string;
    amount: number;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    courseSlug: string;
  } | null;

  if (!paymentData) {
    // If accessed directly without session data, redirect home
    return (
      <div className="gateway-error-container">
        <ShieldAlert size={48} className="error-icon" />
        <h2>Invalid Session</h2>
        <p>No active transaction details found. Redirecting to home...</p>
        <button onClick={() => navigate('/')} className="back-btn">Go to Home</button>
      </div>
    );
  }

  const { orderId, amount, studentName, studentEmail, studentPhone, courseSlug } = paymentData;

  return (
    <>
      <SEO 
        title="CCAvenue Sandbox Transaction Simulator - AppTeknow Careers" 
        description="CCAvenue secure checkout transaction simulator for local development and testing." 
      />
      <main className="gateway-page">
        <div className="gateway-container">
          <div className="gateway-card">
            
            {/* Branding Header */}
            <div className="gateway-branding">
              <span className="gateway-logo">CCAvenue</span>
              <span className="sandbox-badge">SANDBOX SIMULATOR</span>
            </div>

            {/* Merchant Details Block */}
            <div className="gateway-merchant-info">
              <div>
                <span className="label">Merchant:</span>
                <strong className="value">AppTeknow Careers Private Limited</strong>
              </div>
              <div>
                <span className="label">Order ID:</span>
                <strong className="value text-accent">{orderId}</strong>
              </div>
              <div>
                <span className="label">Amount:</span>
                <strong className="value text-price">₹{amount.toFixed(2)} INR</strong>
              </div>
            </div>

            {/* Info Alerts */}
            <div className="gateway-info-box">
              <Info size={16} className="info-icon" />
              <p>
                This is a localized pre-production environment. You can simulate different transaction outcomes to test the database sync pipeline and notification triggers.
              </p>
            </div>

            {/* Customer Summary */}
            <div className="gateway-summary">
              <h3>Customer Verification Details</h3>
              <ul>
                <li><span>Name:</span> <strong>{studentName}</strong></li>
                <li><span>Email:</span> <strong>{studentEmail}</strong></li>
                <li><span>Phone:</span> <strong>{studentPhone}</strong></li>
                <li><span>Course Slug:</span> <strong className="text-slug">{courseSlug}</strong></li>
              </ul>
            </div>

            {/* Action Simulator Forms */}
            <div className="gateway-actions">
              
              {/* Form 1: Simulate Success */}
              <form action={`${API_BASE}/api/payment/response`} method="POST" className="action-form">
                <input type="hidden" name="mock" value="true" />
                <input type="hidden" name="orderId" value={orderId} />
                <input type="hidden" name="status" value="Success" />
                <button type="submit" className="simulator-btn success-btn">
                  <CheckCircle size={18} /> Approve Transaction (Success)
                </button>
              </form>

              {/* Form 2: Simulate Failure */}
              <form action={`${API_BASE}/api/payment/response`} method="POST" className="action-form">
                <input type="hidden" name="mock" value="true" />
                <input type="hidden" name="orderId" value={orderId} />
                <input type="hidden" name="status" value="Failure" />
                <button type="submit" className="simulator-btn failure-btn">
                  <XCircle size={18} /> Reject Transaction (Failure)
                </button>
              </form>

            </div>

            <div className="gateway-footer">
              <span>Secure Sandbox Session Active • 128-bit SSL</span>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default MockPaymentGateway;
