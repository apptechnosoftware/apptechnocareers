import React from 'react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { ExternalLink, Terminal, Award, ArrowRight, Camera } from 'lucide-react';
import './StudentProjects.css';
import '../ProjectGallery/ProjectGallery.css';

interface StudentProjectsProps {
  courseFilter?: string; // Optional ID to show only course-relevant projects
  limit?: number;
}

const StudentProjects: React.FC<StudentProjectsProps> = ({ courseFilter, limit }) => {
  const { projects } = useDataContext();

  // Filter down to requested parameters
  let displayedProjects = courseFilter 
    ? projects.filter(p => p.courseId === courseFilter)
    : [...projects];

  // Prioritize edusuite-erp-system to always come first if present
  const edusuiteIndex = displayedProjects.findIndex(p => p.id === 'edusuite-erp-system');
  if (edusuiteIndex > -1) {
    const [edusuite] = displayedProjects.splice(edusuiteIndex, 1);
    displayedProjects.unshift(edusuite);
  }

  if (limit) {
    displayedProjects = displayedProjects.slice(0, limit);
  }

  if (displayedProjects.length === 0) {
    return null; // Hide section silently if no showcase projects exist yet for this specific stack
  }

  return (
    <section className="student-projects-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-heading flex-center">
            <Award size={16} className="accent-icon" /> Practical Innovation
          </span>
          <h2 className="section-title">Real Projects Built by Our Students</h2>
          <p className="section-subtitle">
            We don't just teach coding; our students engineer production-ready applications solving real enterprise constraints.
          </p>
        </div>

        <div className="projects-grid">
          {displayedProjects.map(project => (
            <div className="student-project-card" key={project.id}>
              {/* Project Visual Container */}
              <div className="project-thumbnail-wrapper">
                <img 
                  src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500'} 
                  alt={`${project.title} Demo Showcase`} 
                  className="project-thumb-img"
                />
                <div className="placement-floating-badge">
                  Placed At: <strong>{project.placedCompany}</strong>
                </div>
              </div>

              {/* Content Body */}
              <div className="project-card-body">
                <div className="student-developer-info">
                  <div className="developer-avatar-placeholder">
                    {project.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="student-name">{project.studentName}</h4>
                    <p className="student-role">Graduate Developer</p>
                  </div>
                </div>

                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>

                {/* Tech Ecosystem Tag Strip */}
                <div className="project-tech-strip">
                  {project.techStack.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="tech-mini-tag">
                      <Terminal size={10} /> {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="tech-mini-tag more">+{project.techStack.length - 4}</span>
                  )}
                </div>

                {/* Screenshot Count Badge */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <span className="screenshot-count-badge">
                      <Camera size={12} /> {project.screenshots.length} Screenshots
                    </span>
                  </div>
                )}

                {/* Action Links Grid */}
                <div className="project-actions-grid">
                  <Link 
                    to={`/replica-project/${project.id}`} 
                    className="btn btn-primary btn-sm btn-full flex-center"
                  >
                    View Replica Profile <ArrowRight size={14} />
                  </Link>

                  <div className="external-project-links">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline-light btn-icon-sm"
                        title="Launch Live Application Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentProjects;
