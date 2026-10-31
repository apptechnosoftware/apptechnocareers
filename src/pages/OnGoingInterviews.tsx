import { useState, useMemo } from 'react';
import { Building2, Briefcase, MapPin, IndianRupee, CalendarDays, Clock, ArrowUpRight, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import { useDataContext } from '../context/DataContext';

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const OnGoingInterviews = () => {
  const { jobs } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter & Sort jobs
  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesRole = true;
      const titleLower = job.title.toLowerCase();
      const descLower = (job.description || '').toLowerCase();
      
      if (selectedRole === 'java') {
        matchesRole = titleLower.includes('java') || descLower.includes('java');
      } else if (selectedRole === 'python') {
        matchesRole = titleLower.includes('python') || descLower.includes('python') || descLower.includes('django');
      } else if (selectedRole === 'web') {
        matchesRole = titleLower.includes('mern') || titleLower.includes('react') || titleLower.includes('node') || titleLower.includes('web') || titleLower.includes('frontend') || titleLower.includes('full stack') || titleLower.includes('full-stack') || descLower.includes('react') || descLower.includes('node');
      } else if (selectedRole === 'qa') {
        matchesRole = titleLower.includes('qa') || titleLower.includes('test') || titleLower.includes('automation') || titleLower.includes('selenium') || titleLower.includes('testing') || descLower.includes('selenium') || descLower.includes('testing');
      } else if (selectedRole === 'data') {
        matchesRole = titleLower.includes('data') || titleLower.includes('power') || titleLower.includes('bi') || titleLower.includes('analytics') || titleLower.includes('sql') || descLower.includes('power bi');
      } else if (selectedRole === 'cyber') {
        matchesRole = titleLower.includes('security') || titleLower.includes('cyber') || titleLower.includes('hacking');
      }
      
      return matchesSearch && matchesRole;
    });

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'oldest') {
        return Number(a.id || 0) - Number(b.id || 0);
      }
      if (sortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      }
      if (sortBy === 'ctc') {
        const getCtcVal = (val: string) => {
          const m = (val || '').match(/(\d+(\.\d+)?)/);
          return m ? parseFloat(m[1]) : 0;
        };
        return getCtcVal(b.ctc) - getCtcVal(a.ctc);
      }
      // default: 'recent' (highest id = most recent)
      return Number(b.id || 0) - Number(a.id || 0);
    });
  }, [jobs, searchTerm, selectedRole, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <SEO 
        title="Active IT Corporate Placements Drives & Ongoing Interviews - Appteknow Careers" 
        description="Check today's active recruitment pipelines and campus drives in Bangalore. Enrolled candidates get instant referrals with packages from 3.5L to 6.5L."
      />
      <main className="interviews-page" style={{ backgroundColor: '#f8fafc', minHeight: '90vh' }}>
      
      {/* Premium Header Strip */}
      <div style={{ 
        background: 'linear-gradient(135deg, #001f3f 0%, #003366 100%)', 
        color: 'white', 
        padding: '5rem 0', 
        position: 'relative',
        overflow: 'hidden' 
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, right: 0, width: '100%', height: '100%', 
          background: 'radial-gradient(circle at 90% 10%, rgba(255,193,7,0.06) 0%, transparent 60%)' 
        }}></div>
        
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'rgba(255,193,7,0.15)', 
            border: '1px solid rgba(255,193,7,0.3)',
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            color: 'var(--color-accent)', 
            textTransform: 'uppercase', 
            marginBottom: '1.2rem' 
          }}>
            <CalendarDays size={14} /> Verified Active Drives
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Ongoing Job Drives
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
            Current corporate client vacancy pools accessible exclusively to enrolled AppTeknow Career modules via automated referrals.
          </p>

          {/* Stats badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent)' }}>{jobs.length}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Total Openings</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>{new Set(jobs.map(j => j.company)).size}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Companies</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', padding: '4rem 1rem' }}>
         
         {/* Filters and Controls */}
         <div style={{
           background: 'white',
           padding: '20px 25px',
           borderRadius: '16px',
           border: '1px solid #edf2f7',
           boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
           marginBottom: '30px',
           display: 'flex',
           flexWrap: 'wrap',
           gap: '20px',
           alignItems: 'center',
           justifyContent: 'space-between'
         }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: '1.05rem' }}>
             <SlidersHorizontal size={18} />
             <span>Search & Filter Drives</span>
           </div>

           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', flex: 1, justifyContent: 'flex-end', minWidth: '280px' }}>
             {/* Search bar */}
             <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
               <input
                 type="text"
                 placeholder="Search job role or company..."
                 value={searchTerm}
                 onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                 style={{
                   width: '100%',
                   padding: '10px 14px 10px 38px',
                   borderRadius: '8px',
                   border: '1px solid #e2e8f0',
                   fontSize: '0.9rem',
                   outline: 'none'
                 }}
               />
               <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
             </div>

             {/* Role dropdown */}
             <select
               value={selectedRole}
               onChange={(e) => handleFilterChange(setSelectedRole, e.target.value)}
               style={{
                 padding: '10px 14px',
                 borderRadius: '8px',
                 border: '1px solid #e2e8f0',
                 fontSize: '0.9rem',
                 outline: 'none',
                 background: 'white',
                 cursor: 'pointer',
                 minWidth: '160px'
               }}
             >
               <option value="all">All Tech Roles</option>
               <option value="java">Java Full Stack</option>
               <option value="python">Python Full Stack</option>
               <option value="web">MERN / Web Dev</option>
               <option value="qa">QA / Testing</option>
               <option value="data">Data Analytics</option>
               <option value="cyber">Cyber Security</option>
             </select>

             {/* Sort By filter */}
             <select
               value={sortBy}
               onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
               style={{
                 padding: '10px 14px',
                 borderRadius: '8px',
                 border: '1px solid #e2e8f0',
                 fontSize: '0.9rem',
                 outline: 'none',
                 background: 'white',
                 cursor: 'pointer',
                 minWidth: '160px'
               }}
             >
               <option value="recent">Sort: Most Recent</option>
               <option value="oldest">Sort: Oldest First</option>
               <option value="company">Sort: Company (A-Z)</option>
               <option value="ctc">Sort: CTC (High to Low)</option>
             </select>
           </div>
         </div>

         {/* Header info */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
              Live Openings ({filteredJobs.length})
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Show:
                {ITEMS_PER_PAGE_OPTIONS.map(size => (
                  <button 
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: itemsPerPage === size ? '1px solid var(--color-primary)' : '1px solid #e2e8f0',
                      background: itemsPerPage === size ? 'var(--color-primary)' : 'white',
                      color: itemsPerPage === size ? 'white' : '#64748b',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                 Auto-updated real time
              </div>
            </div>
         </div>

         {/* Jobs grid */}
         {filteredJobs.length === 0 ? (
           <div style={{
             background: 'white',
             borderRadius: '16px',
             padding: '50px 20px',
             textAlign: 'center',
             border: '1px solid #edf2f7',
             color: '#64748b',
             boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
           }}>
             <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>No matching job drives found.</p>
             <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Try searching another keyword or changing the filters.</p>
           </div>
         ) : (
           <div style={{ display: 'grid', gap: '1.5rem' }}>
              {paginatedJobs.map((job, i) => {
                const jobKey = job.id || `${startIndex + i}`;
                const isExpanded = expandedDescriptions[jobKey];

                return (
                  <div 
                    key={jobKey} 
                    style={{ 
                      background: '#ffffff', 
                      borderRadius: '16px', 
                      padding: '2rem', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '1.2rem',
                      border: '1px solid #edf2f7',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-3px)';
                       e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 51, 102, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'none';
                       e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                    }}
                  >
                     <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                              <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{job.title}</h3>
                           </div>
                           
                           <div style={{ display: 'flex', gap: '1.25rem', color: '#64748b', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Building2 size={14} /> {job.company}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} /> {job.exp}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {job.location}</span>
                           </div>

                           <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                              <Clock size={14} /> Status: <span style={{ 
                                textDecoration: 'none', 
                                marginLeft: '2px',
                                background: job.status.toLowerCase().includes('hiring') ? 'rgba(16,185,129,0.1)' : 
                                             job.status.toLowerCase().includes('walk') ? 'rgba(245,158,11,0.1)' :
                                             'rgba(96,165,250,0.1)',
                                color: job.status.toLowerCase().includes('hiring') ? '#047857' :
                                       job.status.toLowerCase().includes('walk') ? '#b45309' :
                                       '#1e40af',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}>{job.status}</span>
                           </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem', flexShrink: 0 }}>
                           <span style={{ 
                             background: 'rgba(16, 185, 129, 0.1)', 
                             color: '#047857', 
                             padding: '6px 14px', 
                             borderRadius: '30px', 
                             fontWeight: 'bold', 
                             fontSize: '0.85rem',
                             display: 'inline-flex',
                             alignItems: 'center',
                             gap: '4px'
                           }}>
                              <IndianRupee size={13} /> {job.ctc}
                           </span>
                           
                           <Link 
                             to={`/contact?applyJob=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                             style={{ 
                               display: 'inline-flex', 
                               alignItems: 'center', 
                               gap: '4px', 
                               color: 'white',
                               background: 'var(--color-primary)',
                               padding: '8px 16px',
                               borderRadius: '6px',
                               fontSize: '0.85rem', 
                               fontWeight: 700, 
                               textDecoration: 'none',
                               boxShadow: '0 4px 10px rgba(0, 51, 102, 0.1)',
                               transition: 'background 0.2s'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-dark)'}
                             onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
                           >
                              Apply via Mentor <ArrowUpRight size={15} />
                           </Link>
                        </div>
                     </div>

                     {/* Job Role Description - collapsible */}
                     {job.description && (
                        <div>
                          <button 
                            onClick={() => toggleDescription(jobKey)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-primary)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '4px 0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px'
                            }}
                          >
                            {isExpanded ? '▾ Hide' : '▸ View'} Job Description & Requirements
                          </button>
                          {isExpanded && (
                            <div style={{ 
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              padding: '16px 20px',
                              borderRadius: '12px',
                              fontSize: '0.85rem', 
                              color: '#475569', 
                              lineHeight: '1.7',
                              marginTop: '8px'
                            }}>
                              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.description}</p>
                            </div>
                          )}
                        </div>
                     )}
                  </div>
                );
              })}
           </div>
         )}

         {/* Pagination */}
         {totalPages > 1 && (
           <div style={{
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             gap: '8px',
             marginTop: '3rem',
             flexWrap: 'wrap'
           }}>
             <button
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '4px',
                 padding: '8px 14px',
                 borderRadius: '8px',
                 border: '1px solid #e2e8f0',
                 background: currentPage === 1 ? '#f1f5f9' : 'white',
                 color: currentPage === 1 ? '#94a3b8' : 'var(--color-primary)',
                 cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                 fontSize: '0.85rem',
                 fontWeight: 600,
                 transition: 'all 0.15s'
               }}
             >
               <ChevronLeft size={16} /> Prev
             </button>

             {getPageNumbers().map((page, idx) => (
               page === '...' ? (
                 <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
               ) : (
                 <button
                   key={page}
                   onClick={() => setCurrentPage(page as number)}
                   style={{
                     padding: '8px 14px',
                     borderRadius: '8px',
                     border: currentPage === page ? '1px solid var(--color-primary)' : '1px solid #e2e8f0',
                     background: currentPage === page ? 'var(--color-primary)' : 'white',
                     color: currentPage === page ? 'white' : '#475569',
                     cursor: 'pointer',
                     fontSize: '0.85rem',
                     fontWeight: 600,
                     transition: 'all 0.15s',
                     minWidth: '40px'
                   }}
                 >
                   {page}
                 </button>
               )
             ))}

             <button
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages}
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '4px',
                 padding: '8px 14px',
                 borderRadius: '8px',
                 border: '1px solid #e2e8f0',
                 background: currentPage === totalPages ? '#f1f5f9' : 'white',
                 color: currentPage === totalPages ? '#94a3b8' : 'var(--color-primary)',
                 cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                 fontSize: '0.85rem',
                 fontWeight: 600,
                 transition: 'all 0.15s'
               }}
             >
               Next <ChevronRight size={16} />
             </button>
           </div>
         )}

         {/* Page info text */}
         {totalPages > 1 && (
           <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>
             Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredJobs.length)} of {filteredJobs.length} openings
           </div>
         )}

         {/* CTA Bottom Box */}
         <div style={{ 
           marginTop: '4rem', 
           background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', 
           padding: '3.5rem 3rem', 
           borderRadius: '24px', 
           color: 'white',
           textAlign: 'center',
           boxShadow: '0 20px 40px rgba(0, 51, 102, 0.15)'
         }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-accent)' }}>
              Unlock Priority Referral Pipeline
            </h2>
            <p style={{ marginBottom: '2.5rem', color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
              Enrolled candidates secure immediate entries bypassing external job board queues.
            </p>
            <Link to="/contact" style={{ 
              display: 'inline-block',
              background: 'var(--color-accent)',
              color: 'var(--color-primary-dark)',
              padding: '1.1rem 2.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 10px 20px rgba(255,193,7,0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
               CONNECT WITH PLACEMENT HEAD
            </Link>
         </div>

      </div>
    </main>
    </>
  );
};

export default OnGoingInterviews;
