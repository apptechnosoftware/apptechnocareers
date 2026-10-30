import { Link } from 'react-router-dom';
import { Code, CheckSquare, Globe, BarChart, ChevronRight } from 'lucide-react';
import './CourseCatalog.css';

const courses = [
  {
    id: 'java',
    title: 'Full Stack JAVA Developer',
    icon: <Code size={28} />,
    skills: ['Full Stack Java', 'SQL', 'Spring Boot', 'Rest API', 'Git Hub', 'HTML/CSS/JS', 'React JS', 'CI / CD'],
    color: 'navy',
    link: '/java-training-in-bangalore-from-it-companies-with-ai-tools'
  },
  {
    id: 'testing',
    title: 'Software Testing',
    icon: <CheckSquare size={28} />,
    skills: ['Manual Testing', 'Core JAVA', 'Selenium Automation', 'SQL', 'API Testing', 'Git Hub', 'Web Scraping'],
    color: 'orange',
    link: '/software-testing-selenium-with-al-from-it-companies'
  },
  {
    id: 'python',
    title: 'Full Stack Python',
    icon: <Globe size={28} />,
    skills: ['Core Python', 'Advanced Python', 'Django Framework', 'SQL', 'HTML/CSS/JS', 'Git Hub', 'Rest API', 'CI / CD'],
    color: 'blue',
    link: '/python-training-in-bangalore-from-it-companies-with-ai-tools'
  },
  {
    id: 'data',
    title: 'Data Analytics',
    icon: <BarChart size={28} />,
    skills: ['Power BI', 'Tableau', 'SQL & Python', 'Advanced Excel', 'Basic Statistics', 'Advanced Reporting'],
    color: 'green',
    link: '/data-analytics-course-in-bangalore-from-it-companies'
  }
];

const CourseCatalog = () => {
  return (
    <section className="course-catalog section-padding" id="courses">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-heading">Our Offerings</span>
          <h2 className="section-title">Core IT Job Training Programs</h2>
          <div className="title-line"></div>
          <p className="section-subtitle">
            High-intensity software training curriculums vetted by top IT firms, engineered to turn you into a production-ready tech professional.
          </p>
        </div>

        <div className="catalog-grid">
          {courses.map((course) => (
            <div key={course.id} className={`catalog-card border-${course.color}`}>
              <div className="catalog-header">
                <div className={`icon-circle icon-${course.color}`}>
                  {course.icon}
                </div>
                <h3 className="catalog-title">{course.title}</h3>
              </div>
              
              <div className="skills-list-wrapper">
                <h4 className="skills-title">Modules Included:</h4>
                <ul className="skills-tags">
                  {course.skills.map((skill, i) => (
                    <li key={i} className="skill-tag">{skill}</li>
                  ))}
                </ul>
              </div>

              <div className="catalog-footer">
                <Link to={course.link} className="catalog-btn">
                  Explore Syllabus <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCatalog;
