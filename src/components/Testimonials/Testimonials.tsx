import { Quote, Star } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Vyshnavi',
    role: 'Placed as Software Engineer',
    review: 'AppTeknow Careers completely transformed my trajectory. The training by real IT professionals gave me production-level coding experience. Extremely grateful!',
    rating: 5
  },
  {
    id: 2,
    name: 'Bhupathi Raja',
    role: 'Full Stack Developer',
    review: 'I signed up for the Full Stack Java course. The pay-after-placement structure is genuine! I secured an MNC job within weeks of completion.',
    rating: 5
  },
  {
    id: 3,
    name: 'Pratibha',
    role: 'QA Test Analyst',
    review: 'Best Software Testing coaching in Bangalore! Working on dynamic live client projects gave me massive confidence during my technical interviews.',
    rating: 5
  },
  {
    id: 4,
    name: 'Sabeer',
    role: 'Data Analytics Specialist',
    review: 'The SQL and PowerBI curriculum here are superb. Direct corporate trainers and daily interviews are something no other institute offers.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-heading">Success Stories</span>
          <h2 className="section-title">Our Students Get Hired</h2>
          <div className="title-line"></div>
          <p className="section-subtitle">
            Hear directly from our alumni who accelerated their IT careers and joined top MNCs across India.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((test) => (
            <div key={test.id} className="testimonial-card">
              <div className="quote-icon">
                <Quote size={30} />
              </div>
              
              <div className="stars">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                ))}
              </div>

              <p className="review-text">"{test.review}"</p>

              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="reviewer-name">{test.name}</h4>
                  <span className="reviewer-role">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
