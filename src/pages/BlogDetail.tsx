import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { allBlogs } from '../data/blogs';
import { useDataContext } from '../context/DataContext';
import SEO from '../components/SEO/SEO';
import './BlogDetail.css';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const blog = allBlogs.find(b => b.slug === slug);
  const { addInquiry } = useDataContext();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    courseInterest: 'Full Stack Java'
  });

  if (!blog) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '10px' }}>
          The requested guide could not be located. Explore our catalog of technical guides below.
        </p>
        <Link
          to="/blogs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            background: '#1a56db',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to All Articles
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://appteknow.com/blogs/${blog.slug}`;
  const shareTitle = encodeURIComponent(blog.title);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addInquiry({
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email,
        course: leadForm.courseInterest,
        message: `Inquiry via Blog Article: "${blog.title}"`
      });

      // Dispatch to GTM & GA4 conversion tracking
      if (typeof window !== 'undefined' && Array.isArray((window as any).dataLayer)) {
        (window as any).dataLayer.push({
          event: 'generate_lead',
          lead_source: 'blog_detail',
          blog_slug: blog.slug,
          course: leadForm.courseInterest
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Structured Schema for Google Rich Results
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image,
    author: {
      '@type': 'Organization',
      name: blog.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'AppTeknow Careers',
      logo: {
        '@type': 'ImageObject',
        url: 'https://appteknow.com/logo.png'
      }
    },
    datePublished: '2026-10-25',
    dateModified: '2026-10-30',
    mainEntityOfPage: shareUrl
  };

  return (
    <div className="blog-detail-page">
      <SEO
        title={`${blog.title} | AppTeknow Careers`}
        description={blog.excerpt}
        schema={articleSchema}
        type="article"
      />

      {/* Breadcrumb Navigation */}
      <div className="container">
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blogs">Guides</Link>
          <span>/</span>
          <span>{blog.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <header className="blog-header">
        <div className="container">
          <span className="blog-header__category">{blog.category}</span>
          <h1 className="blog-header__title">{blog.title}</h1>

          <div className="blog-header__meta-row">
            <div className="blog-header__meta-left">
              <span><User size={15} /> {blog.author}</span>
              <span><Calendar size={15} /> {blog.date}</span>
              <span><Clock size={15} /> {blog.readTime}</span>
            </div>

            <div className="blog-header__share">
              <span style={{ fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Share2 size={14} /> Share:
              </span>
              <a
                href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-header__share-btn whatsapp"
                title="Share on WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <button
                onClick={handleCopyLink}
                className="blog-header__share-btn copy"
                title="Copy Link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="container">
        <div className="blog-layout">
          {/* Main Article Content */}
          <main className="blog-content-main">
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-featured-image"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            <div className="blog-article-body">
              {blog.sections && blog.sections.map((sec, idx) => {
                if (sec.type === 'heading') {
                  return <h2 key={idx}>{sec.text}</h2>;
                }
                return <p key={idx}>{sec.text}</p>;
              })}
            </div>

            {/* FAQs Section */}
            {blog.faqs && blog.faqs.length > 0 && (
              <section className="blog-faq-section">
                <h3 className="blog-faq-title">Frequently Asked Questions</h3>
                <div>
                  {blog.faqs.map((faq, i) => (
                    <div key={i} className="blog-faq-item">
                      <button
                        className="blog-faq-question"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span>{i + 1}. {faq.q}</span>
                        {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {openFaq === i && (
                        <div className="blog-faq-answer">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Quick Consultation Form */}
            <div className="blog-sidebar-widget">
              <h4>Book Free Demo Class</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Learn directly from IT Companies in Bangalore with 100% Placement Support.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 10px', color: '#16a34a' }}>
                  <CheckCircle2 size={36} style={{ margin: '0 auto 10px' }} />
                  <h5 style={{ fontWeight: 'bold', fontSize: '16px' }}>Request Received!</h5>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                    Our senior academic counselor will call you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="blog-lead-form">
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number *"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  />
                  <select
                    value={leadForm.courseInterest}
                    onChange={(e) => setLeadForm({ ...leadForm, courseInterest: e.target.value })}
                  >
                    <option value="Full Stack Java">Full Stack Java with AI</option>
                    <option value="Full Stack Python">Full Stack Python Development</option>
                    <option value="Software Testing">Software Testing (Manual + Automation)</option>
                    <option value="Data Analytics">Data Analytics (SQL + Power BI)</option>
                    <option value="Digital Marketing">Digital Marketing & SEO</option>
                  </select>
                  <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Apply for Free Counseling'}
                  </button>
                </form>
              )}
            </div>

            {/* WhatsApp Widget */}
            <div className="blog-sidebar-widget" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <h4 style={{ color: '#166534', borderBottomColor: '#22c55e' }}>Need Quick Help?</h4>
              <p style={{ fontSize: '13px', color: '#15803d', marginBottom: '16px' }}>
                Chat with an admissions counselor directly on WhatsApp to check batch timings & fees.
              </p>
              <a
                href={`https://wa.me/917022928198?text=Hi%2C%20I%20was%20reading%20the%20guide%20on%20${encodeURIComponent(blog.title)}%20and%20would%20like%20more%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#22c55e',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>

            {/* Popular Training Programs */}
            <div className="blog-sidebar-widget">
              <h4>Popular IT Programs</h4>
              <div>
                {[
                  { title: 'Full Stack Java from IT Companies', slug: 'java-training-in-bangalore-from-it-companies-with-ai-tools' },
                  { title: 'Python Training with AI Tools', slug: 'python-training-in-bangalore-from-it-companies-with-ai-tools' },
                  { title: 'Software Testing Selenium with AI', slug: 'software-testing-selenium-with-al-from-it-companies' },
                  { title: 'Data Analytics Course in Bangalore', slug: 'data-analytics-course-in-bangalore-from-it-companies' }
                ].map((course, i) => (
                  <Link key={i} to={`/${course.slug}`} className="blog-sidebar-course">
                    <GraduationCap size={16} style={{ color: '#1a56db', flexShrink: 0 }} />
                    <span className="blog-sidebar-course-title">{course.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
