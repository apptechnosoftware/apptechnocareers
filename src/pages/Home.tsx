import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import CourseCatalog from '../components/CourseCatalog/CourseCatalog';
import PricingSection from '../components/PricingSection/PricingSection';
import Testimonials from '../components/Testimonials/Testimonials';
import ConsultationForm from '../components/ConsultationForm/ConsultationForm';
import StudentProjects from '../components/StudentProjects/StudentProjects';
import SEO from '../components/SEO/SEO';

const Home = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Appteknow Careers",
    "url": "https://appteknow.com",
    "logo": "https://appteknow.com/logo.png",
    "description": "Bangalore's leading IT Job training institute providing courses in Full Stack Java, Python, and Data Analytics with Pay After Placement modules.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "#15b, 1st Floor, Mico Layout BTM II Stage",
      "addressLocality": "Bangalore",
      "postalCode": "560076",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-70229-28198",
      "contactType": "admissions",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "reviewCount": "1250"
    }
  };

  return (
    <>
      <SEO 
        title="Best Job Training Institute in Bangalore | 100% Job Training - Appteknow Careers" 
        description="Appteknow is the #1 Job Training Institute in Bangalore. Accelerate your career with specialized IT job training, live company projects, and 100% placement assist. Pay 50% after job!"
        schema={orgSchema}
      />
      <main className="home-page">
      {/* Hero Banner with Stats */}
      <Hero />

      {/* Core Course Overviews (Catalog Grid) */}
      <CourseCatalog />

      {/* Value Propositions ("Why AppTeknow") */}
      <Features />

      {/* Real Student Portfolio Grid */}
      <StudentProjects />

      {/* Dynamic Upcoming Classes with Pricing */}
      <PricingSection />

      {/* Student Testimonials Grid */}
      <Testimonials />

      {/* Lead Consultation / Book Demo Form */}
      <ConsultationForm />
      </main>
    </>
  );
};

export default Home;
