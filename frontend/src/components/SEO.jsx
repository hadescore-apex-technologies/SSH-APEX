import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { getBackendUrl } from '../utils/api';

const BACKEND = getBackendUrl();

// Default SEO values - fallback if API fails
const DEFAULT_SEO = {
  home: {
    title: 'Hadescore Apex & Technologies | Software, AI & Talent Ecosystem',
    description: 'Building next-generation technology ecosystem with software engineering, AI automation, cybersecurity, talent acceleration, and startup incubation under one platform.',
    keywords: 'Hadescore, Apex Technologies, Software Development, AI Solutions, Cybersecurity, Talent Acceleration, Startup Incubation, Web Development, Mobile Apps, Digital Marketing',
    canonical: 'https://hadescoreapex.com/',
  },
  about: {
    title: 'About Us | Hadescore Apex & Technologies',
    description: 'Learn about Hadescore Apex & Technologies - a unified ecosystem integrating software services, education, and innovation labs across multiple domains.',
    keywords: 'About Hadescore, Company Profile, Technology Ecosystem, Innovation Labs, EduSkills, Apex Division',
    canonical: 'https://hadescoreapex.com/about',
  },
  services: {
    title: 'Technology Services | Software, AI, Cybersecurity & More',
    description: 'Enterprise technology services including web & mobile development, AI solutions, cloud & DevOps, cybersecurity, ERP/CRM systems, and digital transformation.',
    keywords: 'Software Services, Web Development, Mobile Apps, AI Solutions, Cybersecurity, Cloud Services, DevOps, ERP, CRM, SaaS',
    canonical: 'https://hadescoreapex.com/services',
  },
  solutions: {
    title: 'Industry Solutions | Finance, Healthcare, Retail & More',
    description: 'Tailored technology solutions for Finance, Healthcare, Retail, Manufacturing, Education, Supply Chain, and enterprise sectors.',
    keywords: 'Industry Solutions, Fintech, Healthcare Tech, Retail Solutions, Manufacturing, EdTech, Supply Chain',
    canonical: 'https://hadescoreapex.com/solutions',
  },
  products: {
    title: 'Our Products | Enterprise Software & SaaS Solutions',
    description: 'Explore our range of enterprise products including CRM, project management, analytics platforms, and custom SaaS solutions.',
    keywords: 'Products, SaaS Solutions, CRM, Project Management, Analytics, Enterprise Software',
    canonical: 'https://hadescoreapex.com/products',
  },
  apex: {
    title: 'Hadescore Apex | Innovation Labs & Startup Incubation',
    description: 'Innovation labs, startup incubation, AI research, and emerging technologies including robotics, drones, IoT, biotech, and Industry 4.0.',
    keywords: 'Apex Division, Innovation Labs, Startup Incubation, AI Research, Robotics, Drones, IoT, Biotech, Industry 4.0',
    canonical: 'https://hadescoreapex.com/apex',
  },
  learninghub: {
    title: 'Hadescore EduSkills | Live Courses, Internships & Placements',
    description: 'Learn, Build, Earn. Industry-grade training, live courses, internships, mentorship, certifications, and placement assistance.',
    keywords: 'EduSkills, Online Courses, Internships, Training, Mentorship, Certifications, Placement, Career Development',
    canonical: 'https://hadescoreapex.com/learninghub',
  },
  careers: {
    title: 'Careers | Join Hadescore Apex & Technologies',
    description: 'Explore career opportunities at Hadescore. Work on cutting-edge projects with competitive salaries, health benefits, and growth opportunities.',
    keywords: 'Careers, Jobs, Opportunities, Software Jobs, AI Jobs, Hiring, Employment, Tech Careers',
    canonical: 'https://hadescoreapex.com/careers',
  },
  blog: {
    title: 'Blog | Technology Insights & Industry Updates',
    description: 'Stay updated with latest technology trends, industry insights, tutorials, and news from Hadescore Apex & Technologies.',
    keywords: 'Tech Blog, Technology News, Software Tutorials, AI Insights, Industry Trends, Programming',
    canonical: 'https://hadescoreapex.com/blog',
  },
  contact: {
    title: 'Contact Us | Get In Touch With Hadescore',
    description: 'Contact Hadescore Apex & Technologies for technology services, training programs, or partnership inquiries. We respond within 24 hours.',
    keywords: 'Contact, Get In Touch, Support, Enquiry, Partnership, Customer Service',
    canonical: 'https://hadescoreapex.com/contact',
  },
  'start-project': {
    title: 'Start Your Project | Project Brief Submission',
    description: 'Ready to start your project? Submit your project brief and our team will get back to you with a customized proposal.',
    keywords: 'Start Project, Project Brief, Proposal, Custom Software, Development Services',
    canonical: 'https://hadescoreapex.com/start-project',
  },
  privacy: {
    title: 'Privacy Policy | Hadescore Apex & Technologies',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: 'Privacy Policy, Data Protection, Privacy, GDPR, Data Security',
    canonical: 'https://hadescoreapex.com/privacy',
  },
  terms: {
    title: 'Terms & Conditions | Hadescore Apex & Technologies',
    description: 'Terms and conditions for using Hadescore Apex & Technologies services and platforms.',
    keywords: 'Terms and Conditions, Terms of Service, Legal, User Agreement',
    canonical: 'https://hadescoreapex.com/terms',
  },
  security: {
    title: 'Security | Hadescore Apex & Technologies',
    description: 'Our security practices, certifications, and commitment to protecting your data and systems.',
    keywords: 'Security, Data Security, Cybersecurity, Compliance, Certifications',
    canonical: 'https://hadescoreapex.com/security',
  },
};

function SEO({ pageName, customTitle, customDescription, customKeywords, imageUrl }) {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from API
    const fetchSEO = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/seo/${pageName}/`, {
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          const data = await response.json();
          setSeoData(data);
        }
      } catch (error) {
        // Silently fail - use defaults
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [pageName]);

  // Use custom values > API values > default values
  const fallback = DEFAULT_SEO[pageName] || DEFAULT_SEO.home;
  const title = customTitle || seoData?.meta_title || fallback.title;
  const description = customDescription || seoData?.meta_description || fallback.description;
  const keywords = customKeywords || seoData?.meta_keywords || fallback.keywords;
  const canonical = seoData?.canonical_url || fallback.canonical;
  const ogImage = imageUrl || seoData?.og_image || '/logo.png';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Hadescore Apex & Technologies" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Helmet>
  );
}

export default SEO;
