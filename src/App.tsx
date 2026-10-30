import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import Placements from './pages/Placements';
import Contact from './pages/Contact';
import AiMockJobs from './pages/AiMockJobs';
import EnglishAiTool from './pages/EnglishAiTool';
import OnGoingInterviews from './pages/OnGoingInterviews';
import ProjectDetail from './pages/ProjectDetail';
import LiveSandbox from './pages/LiveSandbox';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ThankYouPage from './pages/ThankYouPage';
import PaymentCheckout from './pages/PaymentCheckout';
import MockPaymentGateway from './pages/MockPaymentGateway';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import FloatingWidgets from './components/FloatingWidgets/FloatingWidgets';
import './App.css';

// Automatically scrolls window back to top when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      
      {/* Common Header Layout (Hidden for secure admin gateways) */}
      {!isAdminRoute && <Header />}

      {/* Core Route Outlets */}
      <div className={isAdminRoute ? "admin-content" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/AI-Mock-Jobs" element={<AiMockJobs />} />
          <Route path="/learn-english-with-ai" element={<EnglishAiTool />} />
          <Route path="/on-going-interviews" element={<OnGoingInterviews />} />
          <Route path="/replica-project/:projectId" element={<ProjectDetail />} />
          <Route path="/live-sandbox/:projectId" element={<LiveSandbox />} />
          
          {/* Isolated Administration Channels */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/thank-you-page" element={<ThankYouPage />} />
          <Route path="/pay-fees" element={<PaymentCheckout />} />
          <Route path="/mock-payment-gateway" element={<MockPaymentGateway />} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/appteknow-privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          
          {/* Fallback dynamic routing for SEO course slugs */}
          <Route path="/:id" element={<CourseDetail />} />
          
          {/* Fallback redirection to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* Common Footer Layout (Hidden for secure admin gateways) */}
      {!isAdminRoute && <Footer />}
      
      {/* Floating Action Systems (WhatsApp + We Are Here) */}
      {!isAdminRoute && <FloatingWidgets />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
