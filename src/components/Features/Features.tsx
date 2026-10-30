import { Briefcase, FileCheck, Zap, MessageCircle, Calendar, Percent } from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    icon: <Briefcase size={32} />,
    title: 'Training from IT Companies',
    desc: 'Skip the outdated theory. Get trained by developers and architects currently working in major tech firms.'
  },
  {
    icon: <FileCheck size={32} />,
    title: '6 Months Certificate',
    desc: 'Acquire real industry experience working on active software projects, complete with a verified certificate.'
  },
  {
    icon: <Zap size={32} />,
    title: 'AI Placement Support',
    desc: 'Utilize state-of-the-art AI resume boosters, mock interviewer models, and automatic referral systems.'
  },
  {
    icon: <MessageCircle size={32} />,
    title: 'AI English Coach',
    desc: 'Transform your communication skills and pronunciation using our personalized AI English tutor.'
  },
  {
    icon: <Calendar size={32} />,
    title: 'Everyday Interviews',
    desc: 'Attend guaranteed everyday interview drives scheduled directly with our trusted hiring corporate network.'
  },
  {
    icon: <Percent size={32} />,
    title: 'Pay 50% After Job',
    desc: 'Study first and succeed. Pay up to half of your total course fee only after you successfully get hired.'
  }
];

const Features = () => {
  return (
    <section className="features section-padding bg-alt">
      <div className="container">
        <div className="text-center section-header">
          <span className="sub-heading">The AppTeknow Edge</span>
          <h2 className="section-title">You Must Be Thinking... Why Join Us?</h2>
          <div className="title-line"></div>
          <p className="section-subtitle">
            Unlike traditional classroom modules, our curriculum bridges the gap between fresh graduates and professional software engineers.
          </p>
        </div>

        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
