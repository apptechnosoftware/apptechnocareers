import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Image } from 'lucide-react';
import './ProjectGallery.css';

interface ProjectGalleryProps {
  screenshots: string[];
  projectTitle: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ screenshots, projectTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goPrev, goNext]);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <>
      <div className="project-gallery-section">
        <h3>
          <Image size={22} />
          Project Screenshots
          <span className="gallery-count">{screenshots.length} shots</span>
        </h3>

        {/* Main Viewer */}
        <div className="gallery-main-viewer" onClick={() => setLightboxOpen(true)}>
          <img 
            src={screenshots[activeIndex]} 
            alt={`${projectTitle} - Screenshot ${activeIndex + 1}`} 
          />
          
          {screenshots.length > 1 && (
            <>
              <button className="gallery-nav-btn prev" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
                <ChevronLeft size={20} />
              </button>
              <button className="gallery-nav-btn next" onClick={(e) => { e.stopPropagation(); goNext(); }}>
                <ChevronRight size={20} />
              </button>
              
              <div className="gallery-dots">
                {screenshots.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`gallery-dot ${idx === activeIndex ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                    aria-label={`Go to screenshot ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {screenshots.length > 1 && (
          <div className="gallery-thumbstrip">
            {screenshots.map((url, idx) => (
              <div 
                key={idx}
                className={`gallery-thumb ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => goTo(idx)}
              >
                <img src={url} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="gallery-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close-btn" onClick={() => setLightboxOpen(false)}>
            <X size={24} />
          </button>

          {screenshots.length > 1 && (
            <>
              <button 
                className="lightbox-nav-btn prev" 
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                className="lightbox-nav-btn next" 
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
            <img 
              src={screenshots[activeIndex]} 
              alt={`${projectTitle} - Full Screenshot ${activeIndex + 1}`} 
            />
          </div>
          
          <div className="lightbox-counter">
            {activeIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectGallery;
