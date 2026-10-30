import { useState } from 'react';
import { Trophy, Briefcase, CheckCircle, ShieldCheck, Search, SlidersHorizontal } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { useDataContext } from '../context/DataContext';

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 2) || 'ST').toUpperCase();
};

const getAvatarBg = (name: string) => {
  const gradients = [
    'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    'linear-gradient(135deg, #c026d3 0%, #86198f 100%)',
    'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return gradients[sum % gradients.length];
};

const PlacementAvatar = ({ placement }: { placement: any }) => {
  const [hasError, setHasError] = useState(false);

  if (placement.studentImage && !hasError) {
    const getFullImageUrl = (url?: string) => {
      if (!url) return '';
      if (url.startsWith('data:') || url.startsWith('https://')) return url;
      let cleanUrl = url;
      if (cleanUrl.startsWith('http://localhost:5000')) {
        cleanUrl = cleanUrl.replace('http://localhost:5000', '');
      }
      const apiBase = window.location.port === '5173' ? 'http://localhost:5000' : '';
      return `${apiBase}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
    };

    return (
      <div style={{
        position: 'relative',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid var(--color-accent, #fbbf24)',
        boxShadow: 'var(--shadow-sm)',
        flexShrink: 0
      }}>
        <img 
          src={getFullImageUrl(placement.studentImage)} 
          alt={placement.name} 
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: getAvatarBg(placement.name),
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '1.2rem',
      letterSpacing: '0.5px',
      border: '3px solid var(--color-accent, #fbbf24)',
      boxShadow: 'var(--shadow-sm)',
      flexShrink: 0
    }}>
      {getInitials(placement.name)}
    </div>
  );
};

const Placements = () => {
  const { placements } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [activePosterModal, setActivePosterModal] = useState<string | null>(null);

  // Filter placements (preserves exact order set by Admin)
  const filteredPlacements = placements.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    const roleLower = p.role.toLowerCase();
    
    if (selectedRole === 'java') {
      matchesRole = roleLower.includes('java');
    } else if (selectedRole === 'python') {
      matchesRole = roleLower.includes('python');
    } else if (selectedRole === 'web') {
      matchesRole = roleLower.includes('mern') || roleLower.includes('react') || roleLower.includes('node') || roleLower.includes('web') || roleLower.includes('frontend') || roleLower.includes('full stack');
    } else if (selectedRole === 'qa') {
      matchesRole = roleLower.includes('qa') || roleLower.includes('test') || roleLower.includes('automation') || roleLower.includes('selenium') || roleLower.includes('testing');
    } else if (selectedRole === 'data') {
      matchesRole = roleLower.includes('data') || roleLower.includes('power') || roleLower.includes('bi') || roleLower.includes('analytics') || roleLower.includes('sql');
    } else if (selectedRole === 'cyber') {
      matchesRole = roleLower.includes('security') || roleLower.includes('cyber') || roleLower.includes('hacking');
    }
    
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <SEO 
        title="Recent IT Placements & Success Stories - Appteknow Careers" 
        description="Explore our record-breaking placement numbers. Hundreds of students trained by active architects have joined Capgemini, TCS, Infosys, Wipro, and Cognizant."
      />
      <main className="placements-page" style={{ backgroundColor: 'var(--color-background-alt)' }}>
      <div className="contact-hero text-center bg-primary" style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '2.6rem', fontWeight: 800 }}>Recent Placements</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginTop: '10px' }}>Celebrating our outstanding graduates who made their mark in leading IT firms.</p>
        </div>
      </div>

      <div className="container section-padding">
        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '50px' 
        }}>
          {[
            { icon: <Trophy />, val: '95%', label: 'Placement Rate' },
            { icon: <Briefcase />, val: '250+', label: 'Hiring Partners' },
            { icon: <CheckCircle />, val: 'Daily', label: 'Interviews Hosted' },
            { icon: <ShieldCheck />, val: '50% Fees', label: 'Pay After Placement' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ color: 'var(--color-primary)', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.val}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div style={{
          background: 'white',
          padding: '20px 25px',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: '1.05rem' }}>
            <SlidersHorizontal size={18} />
            <span>Filter Placements</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', flex: 1, justifyContent: 'flex-end', minWidth: '280px' }}>
            {/* Search bar */}
            <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            </div>

            {/* Role dropdown */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                outline: 'none',
                background: 'white',
                cursor: 'pointer',
                minWidth: '160px'
              }}
            >
              <option value="all">All Roles</option>
              <option value="java">Java Full Stack</option>
              <option value="python">Python Full Stack</option>
              <option value="web">MERN / Web Developer</option>
              <option value="qa">QA / Automation Tester</option>
              <option value="data">Data Analytics / BI</option>
              <option value="cyber">Cyber Security</option>
            </select>
          </div>
        </div>

        {/* Placement Cards */}
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', color: 'var(--color-primary-dark)' }}>Recent Offers Celebrated</h2>
        
        {filteredPlacements.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '50px 20px',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>No matching placement offers found.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Try broadening your search term or select another category filter.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '25px' 
          }}>
            {filteredPlacements.map((placement, index) => {
              const posterUrl = placement.studentImage ? placement.studentImage.replace('/faces/face_', '/') : null;
              return (
                <div 
                  key={index} 
                  onClick={() => posterUrl && setActivePosterModal(posterUrl)}
                  title={posterUrl ? "Click to view full official placement poster" : undefined}
                  style={{ 
                    background: 'white', 
                    padding: '30px', 
                    borderRadius: '16px', 
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: posterUrl ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    background: 'var(--color-accent)', 
                    color: 'var(--color-primary-dark)', 
                    padding: '5px 15px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    borderBottomLeftRadius: '12px'
                  }}>PLACED</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', minHeight: '60px' }}>
                    <PlacementAvatar placement={placement} />
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0, fontWeight: 700 }}>{placement.name}</h3>
                      <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>{placement.role}</p>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    borderTop: '1px solid var(--color-border)', 
                    paddingTop: '15px',
                    fontSize: '0.9rem' 
                  }}>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Hired By</strong>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{placement.company}</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Package</strong>
                      <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>{placement.package}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Resolution Poster Modal */}
      {activePosterModal && (
        <div 
          onClick={() => setActivePosterModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              position: 'relative',
              maxWidth: '600px',
              maxHeight: '90vh',
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <button
              onClick={() => setActivePosterModal(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              ✕
            </button>
            <img 
              src={activePosterModal} 
              alt="Official Placement Poster" 
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '85vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </main>
    </>
  );
};

export default Placements;
