import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowRight, BookOpen, XCircle } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import SEO from '../components/SEO/SEO';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses } = useDataContext();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const targetCourseKey = queryParams.get('course');
  const status = queryParams.get('status');
  const orderId = queryParams.get('orderId');

  // Secure validation: Only allow access with valid token or payment callback outcomes
  const isValidAccess = token === 'valid' || status === 'success' || status === 'failed';

  useEffect(() => {
    if (!isValidAccess) {
      // Redirect unauthorized direct visits to home page
      navigate('/', { replace: true });
      return;
    }

    // Auto-trigger brochure PDF download if a specific course is passed
    if (targetCourseKey && courses) {
      // Find course matching the key
      const matchedCourse = Object.values(courses).find(
        (c) => c.emailKey === targetCourseKey || c.id === targetCourseKey
      );
      if (matchedCourse && matchedCourse.brochureUrl) {
        // Open download in a new tab or trigger trigger click
        const link = document.createElement('a');
        link.href = matchedCourse.brochureUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }, [isValidAccess, targetCourseKey, courses, navigate]);

  if (!isValidAccess) {
    return null; // Don't render anything if unauthorized
  }

  // Pre-compiled list of courses to list for download
  const courseList = courses ? Object.values(courses) : [];

  return (
    <>
      <SEO 
        title="Thank You for Contacting Us - Syllabus Access" 
        description="Access your dynamic syllabus brochures and outline materials instantly." 
      />
      <main className="thank-you-page">
        <div className="container thank-you-container">
          
          {/* Header Card */}
          {status === 'success' ? (
            <div className="thank-you-card">
              <div className="success-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <CheckCircle2 size={48} color="#10b981" />
              </div>
              <h1 style={{ color: '#10b981' }}>Payment Successful!</h1>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0', marginTop: '10px' }}>
                Order ID: <span style={{ fontFamily: 'monospace', color: '#818cf8' }}>{orderId}</span>
              </p>
              <p>
                Thank you for securing your seat at AppTeknow Careers. Your enrollment transaction was completed successfully. Our admissions and onboarding team will call you shortly to share your batch coordinates and student credentials.
              </p>
            </div>
          ) : status === 'failed' ? (
            <div className="thank-you-card">
              <div className="success-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <XCircle size={48} color="#ef4444" />
              </div>
              <h1 style={{ color: '#ef4444' }}>Transaction Failed!</h1>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0', marginTop: '10px' }}>
                Order Reference: <span style={{ fontFamily: 'monospace', color: '#fca5a5' }}>{orderId}</span>
              </p>
              <p>
                We were unable to process your enrollment transaction fee. This can happen due to incorrect details, insufficient funds, or banking network failures. Please try again or get in touch with our helpdesk at +91-70229-28198.
              </p>
            </div>
          ) : (
            <div className="thank-you-card">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={48} color="#6366f1" />
              </div>
              <h1>Thank You for Contacting AppTeknow!</h1>
              <p>
                Your request was successfully validated. Our senior academic counselor will call you shortly to discuss your professional career roadmap.
              </p>
            </div>
          )}

          {/* Syllabus Catalog Section */}
          <div className="syllabus-section">
            <div className="section-header">
              <BookOpen size={24} color="#818cf8" />
              <h2>Download Course Syllabus Brochures</h2>
            </div>
            
            <div className="syllabus-grid">
              {courseList.length > 0 ? (
                courseList.map((course) => (
                  <div key={course.id} className={`syllabus-card ${targetCourseKey === course.emailKey ? 'highlighted-card' : ''}`}>
                    {targetCourseKey === course.emailKey && (
                      <span className="download-badge">Requested Course</span>
                    )}
                    <h3>{course.emailDisplayName || course.title}</h3>
                    <p className="duration-tag">Duration: {course.duration}</p>
                    
                    {course.brochureUrl ? (
                      <a 
                        href={course.brochureUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="download-btn"
                      >
                        Download Syllabus <Download size={16} />
                      </a>
                    ) : (
                      <span className="no-download">Syllabus in preparation</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="loading-placeholder">
                  Loading available syllabus materials...
                </div>
              )}
            </div>
          </div>

          {/* Quick links footer */}
          <div className="action-links">
            <a href="/" className="back-home-link">
              Go back to Homepage <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </main>
    </>
  );
};

export default ThankYouPage;
