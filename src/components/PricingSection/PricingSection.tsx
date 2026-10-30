import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Sparkles, Check } from 'lucide-react';
import './PricingSection.css';

const coursesPricing = [
  {
    id: 1,
    courseId: 'java',
    name: 'Full Stack JAVA with AI Tools',
    originalPrice: 30000,
    discountedPrice: 20000,
    duration: '6 Months',
    popular: true
  },
  {
    id: 2,
    courseId: 'python',
    name: 'Full Stack Python with AI Tools',
    originalPrice: 30000,
    discountedPrice: 20000,
    duration: '6 Months',
    popular: false
  },
  {
    id: 3,
    courseId: 'testing',
    name: 'Software Testing Selenium with AI',
    originalPrice: 30000,
    discountedPrice: 20000,
    duration: '4 Months',
    popular: false
  },
  {
    id: 4,
    courseId: 'mern',
    name: 'MERN Stack Development',
    originalPrice: 35000,
    discountedPrice: 25000,
    duration: '6 Months',
    popular: true
  },
  {
    id: 5,
    courseId: 'analytics',
    name: 'Data Analytics Course (IT Vetted)',
    originalPrice: 35000,
    discountedPrice: 25000,
    duration: '4 Months',
    popular: false
  },
  {
    id: 6,
    courseId: 'cyber',
    name: 'Cyber Security Defense',
    originalPrice: 35000,
    discountedPrice: 25000,
    duration: '4 Months',
    popular: false
  }
];

const PricingSection = () => {
  const navigate = useNavigate();
  const [cartCourses, setCartCourses] = useState<string[]>([]);

  // Monitor cart status dynamically
  useEffect(() => {
    const updateCart = () => {
      const stored = localStorage.getItem('appteknow_cart_courses');
      let cart: string[] = [];
      try {
        if (stored) cart = JSON.parse(stored);
      } catch {}
      setCartCourses(cart);
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    window.addEventListener('cart-updated', updateCart);
    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cart-updated', updateCart);
    };
  }, []);

  const handleAddToCart = (courseId: string) => {
    const stored = localStorage.getItem('appteknow_cart_courses');
    let cart: string[] = [];
    try {
      if (stored) cart = JSON.parse(stored);
    } catch {}
    
    if (!cart.includes(courseId)) {
      cart.push(courseId);
      localStorage.setItem('appteknow_cart_courses', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      // If already in cart, redirect to checkout
      navigate('/pay-fees');
    }
  };

  return (
    <section className="pricing section-padding bg-alt">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-heading">Special Pricing</span>
          <h2 className="section-title">Direct IT Training Programs</h2>
          <div className="title-line"></div>
          <p className="section-subtitle">
            Affordable fee structure backed by premium industry experience certifications and pay-after-placement options.
          </p>
        </div>

        <div className="pricing-grid">
          {coursesPricing.map((course) => (
            <div key={course.id} className={`pricing-card ${course.popular ? 'featured' : ''}`}>
              {course.popular && (
                <div className="popular-badge">
                  <Sparkles size={14} /> Best Seller
                </div>
              )}
              
              <h3 className="price-course-name">{course.name}</h3>
              <div className="price-duration">Duration: {course.duration}</div>
              
              <div className="price-wrapper">
                <span className="original-price">₹{course.originalPrice.toLocaleString()}</span>
                <div className="current-price">
                  <span className="currency">₹</span>
                  <span className="amount">{course.discountedPrice.toLocaleString()}</span>
                </div>
              </div>

              <ul className="pricing-features">
                <li>✓ Experience Certification</li>
                <li>✓ Live Industry Projects</li>
                <li>✓ AI-Boosted Profile</li>
                <li>✓ Placement Guarantee</li>
              </ul>

              <button 
                className={`price-btn btn-full ${cartCourses.includes(course.courseId) ? 'active-cart-btn' : ''}`}
                onClick={() => handleAddToCart(course.courseId)}
              >
                {cartCourses.includes(course.courseId) ? (
                  <>
                    <Check size={18} /> In Cart (Go to Pay)
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
