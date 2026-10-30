import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Trophy } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge-container">
            <span className="hero-badge">#1 Rated IT Institute in Bangalore</span>
          </div>
          <h1 className="hero-title">
            The Premier <span className="text-highlight">Job Training Institute</span> in Bangalore
          </h1>
          <p className="hero-subtitle">
            Kickstart your tech career with industry-accredited <strong className="text-bold">IT job training</strong>. Get trained directly by active professionals, work on live company environments, and <strong className="text-bold">pay up to 50% fees after placement</strong>.
          </p>
          
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Book Free Demo Class <ArrowRight size={20} />
            </Link>
            <a href="#courses" className="btn btn-outline btn-lg">
              Explore Courses
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon"><Users size={20} /></div>
              <div className="stat-text">
                <span className="stat-num">70,000+</span>
                <span className="stat-label">Students Trained</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon"><Trophy size={20} /></div>
              <div className="stat-text">
                <span className="stat-num">20+ Years</span>
                <span className="stat-label">Training Legacy</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon"><Star size={20} className="star-icon" /></div>
              <div className="stat-text">
                <span className="stat-num">4.9/5</span>
                <span className="stat-label">Student Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-wrapper">
            <img 
              src="/hero-banner.png" 
              alt="Job Training Institute Learning Canvas" 
              className="floating-image" 
            />
            <div className="decorative-circle circle-1"></div>
            <div className="decorative-circle circle-2"></div>
            
            <div className="floating-card placement-card">
              <div className="success-indicator"></div>
              <span>Student Placed Every Week!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
