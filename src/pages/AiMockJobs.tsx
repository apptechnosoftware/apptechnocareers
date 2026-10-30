import { useState } from 'react';
import { ShoppingCart, CheckCircle2, FileUp } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const AiMockJobs = () => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleAddToCart = () => {
    alert("Successfully added 'AI Mock & Jobs' to your inquiries. Redirecting to contact verification.");
    window.location.href = "/contact";
  };

  return (
    <>
      <SEO 
        title="AI Mock & Jobs - Career Boost Placement App - Appteknow Careers" 
        description="Access Bangalore's finest AI Mock testing suite. Get instant scoring and technical diagnostics before clearing corporate interview rounds."
      />
      <main className="ai-mock-jobs-page" style={{ backgroundColor: '#f9fafb', padding: '4rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        
        {/* Left side details */}
        <div>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            AI Mock & Jobs
          </h1>
          <p style={{ color: 'var(--color-accent-dark)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            ₹1,500.00
          </p>
          
          <div style={{ 
            background: 'white', 
            padding: '2.5rem', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
            color: 'var(--color-text-main)', 
            lineHeight: '1.8',
            border: '1px solid #edf2f7'
          }}>
            <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              A traditional college or classroom training will not get you an IT job. 
              Learn directly from IT companies of India & US we are associated to get you a job. 
              Prep yourself with proprietary feedback loops before meeting actual clients.
            </p>
            <h3 style={{ color: 'var(--color-primary)', marginTop: '2rem', marginBottom: '1.2rem', fontWeight: 700 }}>
              Feature Package Includes:
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '12px' }}>
              {[
                'Real-time AI powered Mock Interview sessions.',
                'Dynamic referral optimization across associated partner networks.',
                'Automated corporate feedback pipelines.',
                'Instant scores highlighting strengths & gap coverage.'
              ].map((txt, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right side order box */}
        <div style={{ 
          background: 'white', 
          padding: '2.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 20px 40px rgba(1, 74, 148, 0.06)', 
          height: 'fit-content',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Order AI Placement Tool
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
                Career Interested *
              </label>
              <select style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '1px solid #cbd5e1', 
                borderRadius: '6px',
                fontSize: '0.95rem',
                backgroundColor: 'white'
              }}>
                <option>Full Stack Java</option>
                <option>Full Stack Python</option>
                <option>MERN Stack Developer</option>
                <option>Software Testing</option>
                <option>Data Analytics</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
                Fee Paid Acknowledgement (Upload Receipt)
              </label>
              <div style={{ 
                border: '2px dashed #cbd5e1', 
                borderRadius: '8px', 
                padding: '20px', 
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: '#f8fafc'
              }}>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{ 
                    opacity: 0, 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    cursor: 'pointer', width: '100%' 
                  }} 
                />
                <FileUp size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {fileName ? <strong>{fileName}</strong> : 'Click or Drag files to upload receipt'}
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              style={{ 
                width: '100%', 
                background: 'var(--color-accent)', 
                color: 'var(--color-primary-dark)', 
                padding: '1.1rem', 
                fontSize: '1.05rem', 
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 20px rgba(255,180,0,0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <ShoppingCart size={18} /> Order Placements Tool
            </button>
          </div>
        </div>

      </div>
    </main>
    </>
  );
};

export default AiMockJobs;
