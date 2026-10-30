import { useState } from 'react';
import { ShoppingCart, MessageCircle, CheckCircle2, Star } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const EnglishAiTool = () => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Success! Registration request sent. Redirecting to mentor workspace.");
    window.location.href = "/contact";
  };

  return (
    <>
      <SEO 
        title="AI English & Soft Skill Training App - Appteknow Careers" 
        description="Master client interactions and corporate communication using advanced speech algorithms. Accelerate conversational kinetics for global IT companies."
      />
      <main className="english-ai-page" style={{ backgroundColor: '#f8fafc', padding: '4rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        
        {/* Left Product Info */}
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'rgba(255,193,7,0.15)', 
            padding: '5px 12px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            color: 'var(--color-accent-dark)',
            marginBottom: '1rem' 
          }}>
            <Star size={14} fill="currentColor" /> Top Rated Skill Tool
          </div>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
            English AI & Softskill
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.2rem' }}>₹8,000.00</span>
            <span style={{ color: 'var(--color-accent-dark)', fontSize: '2.2rem', fontWeight: 'bold' }}>₹5,000.00</span>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '2.5rem', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
            color: '#475569', 
            lineHeight: '1.8',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--color-text-main)' }}>
              Master corporate communications, client correspondence, and soft skill fluency designed by 
              AI analysis mechanisms specific to IT recruitment cycles. Don't just study - practice for 5000+ minutes!
            </p>
            <h3 style={{ color: 'var(--color-primary-dark)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={20} /> Automated Practice Suites:
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '12px' }}>
              {[
                'AI Feedback loop on voice modulation, pitch & clarity.',
                'Structured automated vocabulary enrichment datasets.',
                'Dynamic live corporate presentation feedback modeling.',
                'Interactive 1-on-1 roleplay logic matrices.',
                'Comprehensive Sentence Formation & Dictation Exams.'
              ].map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent-dark)" style={{ marginTop: '4px', flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right enrollment form */}
        <div style={{ 
          background: 'white', 
          padding: '2.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)', 
          height: 'fit-content',
          border: '1px solid #edf2f7'
        }}>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.8rem' }}>
            Enroll for AI Tool Access
          </h4>
          
          <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <input 
                type="text" 
                required 
                placeholder="Full Name" 
                value={studentName} 
                onChange={(e) => setStudentName(e.target.value)} 
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1.1rem', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outlineColor: 'var(--color-primary)'
                }} 
              />
            </div>
            
            <div>
              <input 
                type="email" 
                required 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1.1rem', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outlineColor: 'var(--color-primary)'
                }} 
              />
            </div>

            <div>
              <select required style={{ 
                width: '100%', 
                padding: '0.9rem 1.1rem', 
                border: '1px solid #cbd5e1', 
                borderRadius: '8px',
                fontSize: '0.95rem',
                backgroundColor: 'white',
                outlineColor: 'var(--color-primary)'
              }}>
                <option value="">Select Career Interest</option>
                <option value="dev">Developer Operations</option>
                <option value="qa">QA Specialist</option>
                <option value="ba">Business & Data Analytics</option>
              </select>
            </div>

            <button 
              type="submit"
              style={{ 
                width: '100%', 
                background: 'var(--color-accent)', 
                color: 'var(--color-primary-dark)', 
                padding: '1.1rem', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 24px rgba(255, 193, 7, 0.25)',
                transition: 'all 0.2s',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <ShoppingCart size={20} /> Get Instant AI Access
            </button>
          </form>
        </div>

      </div>
    </main>
    </>
  );
};

export default EnglishAiTool;
