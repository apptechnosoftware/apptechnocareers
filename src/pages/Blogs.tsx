import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { allBlogs } from '../data/blogs';
import SEO from '../components/SEO/SEO';
import './Blogs.css';

export default function Blogs() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(allBlogs.map(b => b.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter(blog => {
      const matchCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchSearch =
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        blog.category.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="blogs-page">
      <SEO
        title="Career Roadmaps, IT Guides & Tech Insights | AppTeknow Careers"
        description="Comprehensive career roadmaps and IT guides for freshers in Bangalore. Explore Full Stack Java, Python, Software Testing, Data Analytics, and interview preparation."
      />

      {/* Hero Section */}
      <section className="blogs-hero">
        <div className="container">
          <span className="blogs-hero__badge">
            <BookOpen size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> AppTeknow Insights
          </span>
          <h1 className="blogs-hero__title">
            Career Roadmaps, IT Guides & <span>Tech Insights</span>
          </h1>
          <p className="blogs-hero__subtitle">
            Expertly curated articles on Full Stack development, Python, Data Analytics, Software Testing, Digital Marketing, and IT interview prep for freshers in Bangalore.
          </p>

          <div className="blogs-search">
            <Search className="blogs-search__icon" size={18} />
            <input
              type="text"
              placeholder="Search guides (e.g. Python Roadmap, Data Analyst, Manual Testing)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <div className="container" style={{ marginTop: '20px' }}>
        {/* Category Filter Pills */}
        <div className="blogs-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`blogs-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '25px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
          Showing <strong>{filteredBlogs.length}</strong> articles {selectedCategory !== 'All' ? `in "${selectedCategory}"` : ''}
        </div>

        {/* Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '20px', color: '#334155', marginBottom: '8px' }}>No articles found</h3>
            <p style={{ color: '#64748b' }}>Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {filteredBlogs.map(blog => (
              <article key={blog.id} className="blog-card">
                <div className="blog-card__image-wrap">
                  <BookOpen className="blog-card__image-fallback-icon" size={48} />
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-card__image"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="blog-card__category">{blog.category}</span>
                </div>

                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span><Calendar size={13} /> {blog.date}</span>
                    <span><Clock size={13} /> {blog.readTime}</span>
                  </div>

                  <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: 'none' }}>
                    <h2 className="blog-card__title">{blog.title}</h2>
                  </Link>

                  <p className="blog-card__excerpt">{blog.excerpt}</p>

                  <div className="blog-card__footer">
                    <span className="blog-card__author">{blog.author}</span>
                    <Link to={`/blogs/${blog.slug}`} className="blog-card__read-more">
                      Read Guide <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to Action Banner */}
        <div className="blogs-cta-banner">
          <div className="blogs-cta-banner__content">
            <h3>Ready to Learn from <span>Real IT Companies</span>?</h3>
            <p>
              Experience live corporate client projects, AI-powered mock interviews, and guaranteed job placement support with AppTeknow Careers in BTM Layout, Bangalore.
            </p>
          </div>
          <Link to="/contact" className="blogs-cta-banner__btn">
            Apply for Free Demo Class
          </Link>
        </div>
      </div>
    </div>
  );
}
