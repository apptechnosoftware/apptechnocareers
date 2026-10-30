import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import './PaymentCheckout.css';

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000' : '';

const PaymentCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses } = useDataContext();

  // Retrieve course slug from query params
  const queryParams = new URLSearchParams(location.search);
  const courseParam = queryParams.get('course') || '';

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courseParam);
  const [cartCourses, setCartCourses] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  
  // UPI configuration & manual screenshot states
  const [paymentMethod] = useState<'online' | 'upi'>('upi');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [upiId, setUpiId] = useState('aptech.dec-5@okicici');
  const [upiQrCode, setUpiQrCode] = useState('/upi_qr_code.png');
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Honeypot spam protection states
  const [fax, setFax] = useState('');
  const [website, setWebsite] = useState('');

  // Status/Error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch configured UPI details on mount
  useEffect(() => {
    const fetchUpiDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/payment/upi-details`);
        if (res.ok) {
          const data = await res.json();
          if (data.upiId && data.upiId !== 'pay@appteknow') setUpiId(data.upiId);
          if (data.upiQrCode) {
            let cleanUrl = data.upiQrCode;
            if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
              try {
                cleanUrl = new URL(cleanUrl).pathname;
              } catch (e) {
                const idx = cleanUrl.indexOf('/uploads');
                if (idx !== -1) cleanUrl = cleanUrl.substring(idx);
              }
            }
            setUpiQrCode(cleanUrl);
          }
        }
      } catch (err) {
        console.error('Failed to fetch UPI details:', err);
      }
    };
    fetchUpiDetails();
  }, []);

  // Load cart courses on mount & handle URL parameters
  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem('appteknow_cart_courses');
      let cart: string[] = [];
      try {
        if (stored) cart = JSON.parse(stored);
      } catch {}
      
      // If URL parameter exists and is not in cart, add it
      if (courseParam) {
        if (!cart.includes(courseParam)) {
          cart.push(courseParam);
          localStorage.setItem('appteknow_cart_courses', JSON.stringify(cart));
          window.dispatchEvent(new Event('cart-updated'));
        }
      }
      
      setCartCourses(cart);
      const count = cart.length > 0 ? cart.length : 1;
      setAmount((count * 5000).toFixed(2));
    };
    
    loadCart();
    
    window.addEventListener('storage', loadCart);
    window.addEventListener('cart-updated', loadCart);
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cart-updated', loadCart);
    };
  }, [courseParam]);

  const handleRemoveCourse = (courseId: string) => {
    const updated = cartCourses.filter(c => c !== courseId);
    localStorage.setItem('appteknow_cart_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const courseSlugs = cartCourses.length > 0 ? cartCourses.join(',') : selectedCourse;

    // Client-side validation
    if (!studentName.trim() || !studentEmail.trim() || !studentPhone.trim() || !courseSlugs) {
      setErrorMessage('Please fill out all required fields and select at least one course.');
      setLoading(false);
      return;
    }

    const cleanPhone = studentPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid payment amount.');
      setLoading(false);
      return;
    }

    if (paymentMethod === 'upi') {
      if (!screenshotFile) {
        setErrorMessage('Please upload a payment screenshot to submit your registration.');
        setLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('studentName', studentName);
        formData.append('studentEmail', studentEmail);
        formData.append('studentPhone', studentPhone);
        formData.append('courseSlug', courseSlugs);
        formData.append('amount', amount);
        formData.append('screenshot', screenshotFile);
        if (fax) formData.append('fax', fax);
        if (website) formData.append('website', website);

        const response = await fetch(`${API_BASE}/api/payment/submit-screenshot`, {
          method: 'POST',
          body: formData
        });

        const responseText = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(responseText);
        } catch (parseErr) {
          const cleanText = responseText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);
          throw new Error(`Server Error: ${cleanText}`);
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit payment screenshot.');
        }

        // Clear cart
        localStorage.removeItem('appteknow_cart_courses');
        window.dispatchEvent(new Event('cart-updated'));

        // Redirect to thank you page
        navigate(`/thank-you-page?status=success&orderId=${data.orderId}&mode=upi`);
      } catch (err: any) {
        setErrorMessage(err.message || 'Server error. Please try again.');
        setLoading(false);
      }
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentName,
          studentEmail,
          studentPhone,
          courseSlug: courseSlugs,
          amount,
          fax, // Honeypot
          website // Honeypot
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment.');
      }

      // Clear cart on successful transaction redirection
      localStorage.removeItem('appteknow_cart_courses');
      window.dispatchEvent(new Event('cart-updated'));

      if (data.mock) {
        // Redirection to Mock Gateway Simulator
        navigate('/mock-payment-gateway', { state: data });
      } else {
        // Live redirect to CCAvenue secure gateway (Non-Seamless POST redirection)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.gatewayUrl;

        // CCAvenue expects encRequest and access_code
        const encRequestInput = document.createElement('input');
        encRequestInput.type = 'hidden';
        encRequestInput.name = 'encRequest';
        encRequestInput.value = data.encRequest;
        form.appendChild(encRequestInput);

        const accessCodeInput = document.createElement('input');
        accessCodeInput.type = 'hidden';
        accessCodeInput.name = 'access_code';
        accessCodeInput.value = data.accessCode;
        form.appendChild(accessCodeInput);

        document.body.appendChild(form);
        form.submit();
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'Server error. Please try again.');
      setLoading(false);
    }
  };

  const courseList = courses ? Object.values(courses) : [];

  return (
    <>
      <SEO 
        title="Secure Online Course Enrollment & Fees Payment - AppTeknow Careers" 
        description="Securely register and pay your course enrollment fees online using AppTeknow's verified UPI payment options." 
      />
      <main className="checkout-page">
        <div className="container checkout-container">
          <div className="checkout-card">
            
            {/* Header Block */}
            <div className="checkout-header">
              <div className="icon-wrapper">
                <CreditCard size={28} color="#6366f1" />
              </div>
              <h1>Enrollment Fee Payment</h1>
              <p>Secure online seat booking and course registration gate</p>
            </div>

            {errorMessage && (
              <div className="alert-message error">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form">
              
              {/* Personal Information */}
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="studentName">Full Name *</label>
                  <input 
                    type="text" 
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name" 
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Paid Amount (INR) *</label>
                  <input 
                    type="number" 
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount paid" 
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="studentEmail">Email Address *</label>
                  <input 
                    type="email" 
                    id="studentEmail"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="studentPhone">Mobile Number *</label>
                  <input 
                    type="tel" 
                    id="studentPhone"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="Enter 10-digit number" 
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Course Selection & Cart List */}
              <div className="form-group-row">
                <div className="form-group" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <label style={{ fontWeight: 700, display: 'block', marginBottom: '12px', color: 'var(--color-primary-dark)' }}>Cart Courses</label>
                  
                  {cartCourses.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {cartCourses.map((cId) => {
                        const courseObj = courses ? Object.values(courses).find(c => c.id === cId || cId.includes(c.id)) : null;
                        const title = courseObj ? (courseObj.emailDisplayName || courseObj.title) : cId;
                        return (
                          <div key={cId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>{title}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveCourse(cId)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>No courses in cart. Choose a course manually:</p>
                      <select 
                        id="courseSelect"
                        value={selectedCourse}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedCourse(val);
                          if (val) {
                            localStorage.setItem('appteknow_cart_courses', JSON.stringify([val]));
                            window.dispatchEvent(new Event('cart-updated'));
                          }
                        }}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          background: 'white',
                          outline: 'none'
                        }}
                      >
                        <option value="">-- Select Course --</option>
                        {courseList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.emailDisplayName || c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* UPI Payment Instructions and Receipt Upload */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>Direct UPI Payment Instructions</h3>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  
                  {/* QR Scanner Display */}
                  <div style={{ textAlign: 'center', margin: '0 auto', width: '100%', maxWidth: '340px' }}>
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '12px',
                      boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.1)',
                      margin: '0 auto 10px auto'
                    }}>
                      {upiQrCode ? (
                        <img 
                          src={upiQrCode} 
                          alt="Appteknow Careers UPI QR Code" 
                          style={{ 
                            width: '100%', 
                            height: 'auto', 
                            borderRadius: '16px', 
                            display: 'block',
                            objectFit: 'contain'
                          }} 
                        />
                      ) : (
                        <div style={{ padding: '40px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>No QR Code Uploaded</div>
                      )}
                    </div>
                  </div>

                  {/* UPI ID Text Details */}
                  <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
                    <div style={{ background: 'white', padding: '12px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>UPI ID</span>
                        <strong style={{ fontSize: '1.05rem', color: '#1e293b', userSelect: 'all' }}>{upiId}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        style={{
                          background: copied ? '#10b981' : 'var(--color-primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginLeft: '10px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        {copied ? '✔ Copied' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.5, textAlign: 'left' }}>
                      1. Pay the amount you entered above.<br/>
                      2. Take a screenshot of the successful payment confirmation.<br/>
                      3. Upload the screenshot below to submit your registration form.
                    </p>
                  </div>

                  {/* Mobile Launcher Redirect Button */}
                  <div style={{ width: '100%', marginTop: '10px' }}>
                    <a
                      href={`upi://pay?pa=${upiId}&pn=AppTeknow%20Careers&am=${amount}&cu=INR`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: '#10b981',
                        color: 'white',
                        padding: '14px 20px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 16h-3v-3h3v3zm0-4h-3V7h3v7z"/>
                      </svg>
                      <span>Pay using UPI App (GPay/PhonePe/Paytm)</span>
                    </a>
                    <span style={{ display: 'block', textAlign: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
                      * Click above to pay instantly if you are browsing from your smartphone with installed payment apps.
                    </span>
                  </div>

                  {/* UPI Limit Warning Notice */}
                  <div style={{
                    width: '100%',
                    marginTop: '15px',
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: '#92400e',
                    lineHeight: '1.45'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>⚠️ Payment Limit Notice (NPCI Rules):</strong>
                    If your payment is more than <strong>₹2,000</strong>, please do NOT scan the QR code screenshot from your gallery (as UPI apps restrict gallery-scan uploads to ₹2,000 for safety). <br/>
                    Instead, click the <strong>Copy</strong> button above and pay manually inside your GPay/PhonePe/Paytm app, or scan the QR code physically from another device.
                  </div>

                </div>

                  {/* Screenshot file uploader */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <label style={{ fontWeight: 700, display: 'block', marginBottom: '8px', color: '#334155' }}>Upload Payment Screenshot *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setScreenshotFile(file);
                        if (file) {
                          setScreenshotPreview(URL.createObjectURL(file));
                        } else {
                          setScreenshotPreview('');
                        }
                      }}
                      required={paymentMethod === 'upi'}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        background: 'white',
                        fontSize: '0.9rem'
                      }}
                    />
                    
                    {screenshotPreview && (
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>Screenshot Preview:</span>
                        <img
                          src={screenshotPreview}
                          alt="Screenshot Preview"
                          style={{
                            maxWidth: '180px',
                            maxHeight: '180px',
                            borderRadius: '8px',
                            border: '1.5px solid #cbd5e1',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

              {/* Honeypot Fields (CSS-Hidden from human users, bots fill them) */}
              <input 
                type="text" 
                name="fax" 
                value={fax} 
                onChange={(e) => setFax(e.target.value)} 
                className="hidden-honeypot" 
                placeholder="Do not fill" 
                tabIndex={-1}
                autoComplete="off"
              />
              <input 
                type="text" 
                name="website" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                className="hidden-honeypot" 
                placeholder="Do not fill" 
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Amount Info & Secure Badges */}
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Your Entered Paid Amount:</span>
                  <strong className="price-tag">₹{amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString('en-IN') : '0'} INR</strong>
                </div>
                <p className="summary-notice">
                  * Verify that you have paid exactly this amount to the UPI ID before uploading the screenshot.
                </p>
              </div>

              <div className="security-assurance">
                <div className="assurance-item">
                  <ShieldCheck size={20} className="secure-icon" />
                  <span>Verified Safe UPI Payment QR & ID</span>
                </div>
                <div className="assurance-item">
                  <CheckCircle2 size={20} className="secure-icon" />
                  <span>Manual Transaction Receipt Audit</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-payment-btn" 
                disabled={loading}
              >
                {loading 
                  ? (paymentMethod === 'upi' ? 'Uploading Receipt...' : 'Initiating Transaction...') 
                  : (paymentMethod === 'upi' ? 'Submit Registration & Receipt' : 'Proceed to Secure Pay')}
              </button>

            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default PaymentCheckout;
