import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [suppressHover, setSuppressHover] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Monitor cart status in localStorage
  useEffect(() => {
    const checkCart = () => {
      const stored = localStorage.getItem('appteknow_cart_courses');
      let count = 0;
      try {
        if (stored) {
          const cart = JSON.parse(stored);
          if (Array.isArray(cart)) count = cart.length;
        }
      } catch {}
      setCartCount(count);
    };
    checkCart();
    
    window.addEventListener('storage', checkCart);
    window.addEventListener('cart-updated', checkCart);
    return () => {
      window.removeEventListener('storage', checkCart);
      window.removeEventListener('cart-updated', checkCart);
    };
  }, []);

  const handleCartClick = () => {
    navigate('/pay-fees');
    handleLinkClick();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    // Temporarily disable hover triggers to let dropdowns close properly
    setSuppressHover(true);
    setTimeout(() => setSuppressHover(false), 500);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Contact Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-info">
            <span className="info-item">
              <Phone size={14} />
              <a href="tel:+917022928198">+91 70229 28198</a>
            </span>
            <span className="info-item desktop-only">
              <Mail size={14} />
              <a href="mailto:connect@appteknow.com">connect@appteknow.com</a>
            </span>
            <span className="info-item desktop-only">
              <MapPin size={14} />
              <span>BTM Layout, Bangalore</span>
            </span>
          </div>
          <div className="top-cta">
            <span className="badge">NEW</span>
            <span className="text">Learn Directly from IT Companies. Pay After Placement!</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="container nav-container">
          <Link to="/" className="logo logo-link-container" onClick={handleLinkClick}>
            <img src={logoImg} alt="AppTeknow Careers" className="logo-image-asset" />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            {/* IT Courses Dropdown */}
            <li 
              className={`nav-item has-dropdown ${activeDropdown === 'it' ? 'dropdown-active' : ''}`}
              onMouseEnter={() => !suppressHover && window.innerWidth >= 992 && setActiveDropdown('it')}
              onMouseLeave={() => window.innerWidth >= 992 && setActiveDropdown(null)}
            >
              <button className="nav-link-btn" onClick={() => toggleDropdown('it')}>
                IT Courses <ChevronDown size={16} />
              </button>
              <div className="dropdown-menu">
                <Link to="/java-training-in-bangalore-from-it-companies-with-ai-tools" onClick={handleLinkClick}>Full Stack Java Development</Link>
                <Link to="/python-training-in-bangalore-from-it-companies-with-ai-tools" onClick={handleLinkClick}>Full Stack Python Development</Link>
                <Link to="/software-testing-selenium-with-al-from-it-companies" onClick={handleLinkClick}>Software Testing & Automation</Link>
                <Link to="/mern-training-in-bangalore-from-it-companies-with-ai-tools-2" onClick={handleLinkClick}>MERN Stack Development</Link>
                <Link to="/cyber-security-courses-in-bangalore" onClick={handleLinkClick}>Cyber Security</Link>
              </div>
            </li>

            {/* Non-IT Courses Dropdown */}
            <li 
              className={`nav-item has-dropdown ${activeDropdown === 'non-it' ? 'dropdown-active' : ''}`}
              onMouseEnter={() => !suppressHover && window.innerWidth >= 992 && setActiveDropdown('non-it')}
              onMouseLeave={() => window.innerWidth >= 992 && setActiveDropdown(null)}
            >
              <button className="nav-link-btn" onClick={() => toggleDropdown('non-it')}>
                Non IT Courses <ChevronDown size={16} />
              </button>
              <div className="dropdown-menu">
                <Link to="/data-analytics-course-in-bangalore-from-it-companies" onClick={handleLinkClick}>Data Analytics</Link>
                <Link to="/digital-marketing-courses" onClick={handleLinkClick}>Digital Marketer</Link>
                <Link to="/tally-training-in-bangalore" onClick={handleLinkClick}>Tally ERP 9 + GST</Link>
                <Link to="/softskills-aptitude-training" onClick={handleLinkClick}>Softskills & Aptitude</Link>
              </div>
            </li>

            {/* AI Tools Dropdown */}
            <li 
              className={`nav-item has-dropdown ${activeDropdown === 'ai' ? 'dropdown-active' : ''}`}
              onMouseEnter={() => !suppressHover && window.innerWidth >= 992 && setActiveDropdown('ai')}
              onMouseLeave={() => window.innerWidth >= 992 && setActiveDropdown(null)}
            >
              <button className="nav-link-btn" onClick={() => toggleDropdown('ai')}>
                AI Tools <ChevronDown size={16} />
              </button>
              <div className="dropdown-menu">
                <Link to="/AI-Mock-Jobs" onClick={handleLinkClick}>AI Mock & Jobs</Link>
                <Link to="/learn-english-with-ai" onClick={handleLinkClick}>AI English Coach</Link>
              </div>
            </li>

            {/* Placements Dropdown */}
            <li 
              className={`nav-item has-dropdown ${activeDropdown === 'placements' ? 'dropdown-active' : ''}`}
              onMouseEnter={() => !suppressHover && window.innerWidth >= 992 && setActiveDropdown('placements')}
              onMouseLeave={() => window.innerWidth >= 992 && setActiveDropdown(null)}
            >
              <button className="nav-link-btn" onClick={() => toggleDropdown('placements')}>
                Placements <ChevronDown size={16} />
              </button>
              <div className="dropdown-menu">
                <Link to="/placements" onClick={handleLinkClick}>Recent Placements</Link>
                <Link to="/on-going-interviews" onClick={handleLinkClick}>On-Going Interviews</Link>
              </div>
            </li>

            <li className="nav-item">
              <Link to="/blogs" className="nav-link" onClick={handleLinkClick}>Blogs</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={handleLinkClick}>Contact Us</Link>
            </li>

            <li className="nav-item nav-actions">
              <button className="cart-btn" aria-label="Cart" onClick={handleCartClick}>
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
              <Link to="/contact" className="btn-cta" onClick={handleLinkClick}>
                Book Demo
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
