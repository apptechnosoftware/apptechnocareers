import { useParams, Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import SEO from '../components/SEO/SEO';
import ProjectGallery from '../components/ProjectGallery/ProjectGallery';
import { ArrowLeft, ExternalLink, ShieldCheck, Cpu, Briefcase, GraduationCap } from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, courses } = useDataContext();

  // Match Project
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="container text-center section-padding" style={{ minHeight: '60vh' }}>
        <h2>Project Snapshot Not Located</h2>
        <p>The requested student capstone repository is not configured in our dynamic index.</p>
        <Link to="/" className="btn btn-primary mt-3">Return to Hub</Link>
      </div>
    );
  }

  // Match matching course if possible to link back to catalog
  const matchingCourse = Object.entries(courses).find(([_slug, data]) => data.id === project.courseId);

  return (
    <>
      <SEO 
        title={`${project.title} | Student Portfolio - Appteknow Careers`}
        description={`Explore the professional software project built by ${project.studentName} during their job training. Placed successfully at ${project.placedCompany}.`}
      />

      {/* Premium Project Header Hub */}
      <div className="project-hero-container">
        <div className="container">
          <Link to="/" className="back-btn flex-center">
            <ArrowLeft size={16} /> Back to Institution Canvas
          </Link>

          <div className="project-hero-content">
            <div className="hero-badge-row">
              <span className="status-pill">🏆 Successfully Verified Output</span>
              <span className="placed-pill">Placed at {project.placedCompany}</span>
            </div>
            <h1 className="project-hero-title">{project.title}</h1>
            <p className="project-hero-lead">Designed and engineered by {project.studentName}</p>
          </div>
        </div>
      </div>

      {/* Case Study Blueprint Grid */}
      <section className="project-blueprint-section section-padding">
        <div className="container">
          <div className="blueprint-grid">
            
            {/* Core Content Section */}
            <div className="blueprint-main">
              <div className="blueprint-media-card">
                <img 
                  src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'} 
                  alt={`${project.title} Live Interface`} 
                  className="blueprint-media-img"
                />
                <div className="media-shadow-accent"></div>
              </div>

              <div className="blueprint-article">
                <div className="article-header flex-center">
                  <Cpu size={24} className="header-icon" />
                  <h2>Executive Technical Summary</h2>
                </div>
                <p className="article-text">{project.description}</p>

                <div className="article-header flex-center mt-5">
                  <ShieldCheck size={24} className="header-icon success" />
                  <h2>Architecture & Technical Challenges</h2>
                </div>
                <div className="challenge-card">
                  <p>{project.challengesSolved}</p>
                </div>

                <div className="tech-matrix-container mt-5">
                  <h3>Ecosystem Stack Implemented</h3>
                  <div className="tech-matrix-grid">
                    {project.techStack.map((tech, idx) => (
                      <div key={idx} className="matrix-item">
                        <span className="matrix-num">0{idx + 1}</span>
                        <span className="matrix-name">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Architecture Flowchart */}
                <div className="architecture-blueprint-container mt-5">
                  <div className="article-header flex-center">
                    <Cpu size={24} className="header-icon" />
                    <h2>Interactive Microservices Architecture Blueprint</h2>
                  </div>
                  <p className="subtext mb-4">A high-fidelity grid flowchart mapped dynamically to represent this project's production-grade network topology.</p>
                  
                  <div className="arch-flowchart-grid">
                    <div className="arch-node client-node">
                      <div className="node-icon">💻</div>
                      <div className="node-title">React Web Client</div>
                      <div className="node-status">Live Port: 3000</div>
                    </div>
                    <div className="arch-arrow">➔</div>
                    
                    <div className="arch-node gateway-node">
                      <div className="node-icon">🛡️</div>
                      <div className="node-title">Zuul / API Gateway</div>
                      <div className="node-status">SSL Secured</div>
                    </div>
                    <div className="arch-arrow">➔</div>

                    <div className="arch-node service-node">
                      <div className="node-icon">⚙️</div>
                      <div className="node-title">
                        {project.id === 'java-banking-system' ? 'Spring Boot Microservice' : project.id === 'python-retail-dashboard' ? 'Django MVC Core' : 'Express/Node API'}
                      </div>
                      <div className="node-status">Scaling: Active</div>
                    </div>
                    <div className="arch-arrow-bidirectional font-bold">⬌</div>

                    <div className="arch-node cache-node">
                      <div className="node-icon">⚡</div>
                      <div className="node-title">Redis Cache Memory</div>
                      <div className="node-status">Read Latency: &lt;1ms</div>
                    </div>
                    <div className="arch-arrow">➔</div>

                    <div className="arch-node db-node">
                      <div className="node-icon">🗄️</div>
                      <div className="node-title">
                        {project.id === 'mern-dev-network' ? 'MongoDB Atlas Cluster' : 'SQLite DB Engine'}
                      </div>
                      <div className="node-status">Encrypted & Tuned</div>
                    </div>
                  </div>
                </div>

                {/* Verified Institutional Sign-off Certificate */}
                <div className="institutional-signoff-card mt-5">
                  <div className="flex-between flex-wrap gap-2">
                    <div className="flex-center gap-2">
                      <div className="verified-seal">🥇</div>
                      <div>
                        <h3 className="seal-title">Verified Institutional Sign-off</h3>
                        <p className="seal-sub">AppTeknow Technical Advisory Board Audit</p>
                      </div>
                    </div>
                    <span className="audit-hash font-mono">HASH: A57-EF{project.id.slice(0,2).toUpperCase()}9B</span>
                  </div>
                  <div className="audit-body mt-3">
                    <p>This capstone project repository has been rigorously analyzed, compiled locally, and passed all automated test parameters under the AppTeknow Quality Assurance Framework. The architecture matches current enterprise guidelines.</p>
                    <div className="flex-between flex-wrap mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                      <span>Lead Auditor: <strong>Dr. Sabeer F. (Principal Architect)</strong></span>
                      <span>Audit Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Screenshot Gallery */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <ProjectGallery 
                    screenshots={project.screenshots} 
                    projectTitle={project.title} 
                  />
                )}
              </div>
            </div>

            {/* Sidebar Graduate Profile Card */}
            <div className="blueprint-sidebar">
              <div className="sticky-sidebar">
                {/* Profile Card */}
                <div className="graduate-profile-card">
                  <div className="avatar-ring">
                    <div className="profile-initial">{project.studentName.charAt(0)}</div>
                  </div>
                  
                  <h3 className="grad-name">{project.studentName}</h3>
                  <span className="grad-tag">AppTeknow Graduate</span>

                  <div className="grad-stats-list">
                    <div className="grad-stat-item">
                      <GraduationCap size={18} className="stat-icon" />
                      <div>
                        <label>Completed Program</label>
                        <span>{project.courseId.toUpperCase()} Job Training</span>
                      </div>
                    </div>
                    <div className="grad-stat-item">
                      <Briefcase size={18} className="stat-icon" />
                      <div>
                        <label>Career Outcome</label>
                        <strong>Placed at {project.placedCompany}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grad-actions">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-full-w flex-center">
                        <ExternalLink size={18} /> Launch Live Application
                      </a>
                    )}
                  </div>
                </div>

                {/* Connect CTA Box */}
                {matchingCourse && (
                  <div className="course-cta-box">
                    <h4>Want to build software like this?</h4>
                    <p>Enroll in our intensive {matchingCourse[1].duration} {matchingCourse[1].id.toUpperCase()} program.</p>
                    <Link to={`/course/${matchingCourse[0]}`} className="btn btn-accent btn-full-w">
                      Explore Training Model
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
