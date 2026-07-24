import { Helmet } from 'react-helmet-async';

/**
 * Advanced SEO Component - Elite Tier
 * Takes your website to TOP 3% with advanced optimizations
 */

function AdvancedSEO({ 
  pageName,
  articles = [],
  reviews = [],
  products = [],
  courses = [],
  events = []
}) {

  // Article Schema for Blog Posts
  const articleSchema = articles.length > 0 ? articles.map(article => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "author": {
      "@type": "Organization",
      "name": "Hadescore Apex & Technologies"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hadescore Apex & Technologies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hadescoreapex.com/logo.png"
      }
    },
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate || article.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hadescoreapex.com/blog/${article.slug}`
    }
  })) : [];

  // Review Schema for Testimonials
  const reviewSchema = reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hadescore Apex & Technologies",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviews.length
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.authorName
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  } : null;

  // Course Schema for Educational Content
  const courseSchema = courses.length > 0 ? courses.map(course => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Hadescore EduSkills",
      "sameAs": "https://hadescoreapex.com/learninghub"
    },
    "courseCode": course.code,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": course.duration
    },
    "offers": {
      "@type": "Offer",
      "category": "Paid",
      "priceCurrency": "INR",
      "price": course.price
    }
  })) : [];

  // Product Schema for Services/Products
  const productSchema = products.length > 0 ? products.map(product => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "Hadescore Apex & Technologies"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "url": product.url
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    } : undefined
  })) : [];

  // Event Schema for Webinars/Workshops
  const eventSchema = events.length > 0 ? events.map(event => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.mode === 'online' 
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    "location": event.mode === 'online' ? {
      "@type": "VirtualLocation",
      "url": event.url
    } : {
      "@type": "Place",
      "name": "Hadescore Apex",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "addressCountry": "India"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "Hadescore Apex & Technologies",
      "url": "https://hadescoreapex.com"
    }
  })) : [];

  // HowTo Schema for Tutorials
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get Started with Hadescore Services",
    "description": "Step-by-step guide to engaging with Hadescore Apex & Technologies",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Contact Us",
        "text": "Fill out the contact form or call +91 9790080274",
        "url": "https://hadescoreapex.com/contact"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Consultation",
        "text": "Schedule a free consultation to discuss your needs",
        "url": "https://hadescoreapex.com/start-project"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Proposal",
        "text": "Receive a detailed proposal with timeline and cost",
        "url": "https://hadescoreapex.com/services"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Execution",
        "text": "Work with our team to bring your project to life"
      }
    ]
  };

  // WebSite Schema with SiteNavigationElement
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hadescore Apex & Technologies",
    "alternateName": "Hadescore",
    "url": "https://hadescoreapex.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://hadescoreapex.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hadescore Apex & Technologies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hadescoreapex.com/logo.png"
      }
    }
  };

  // SiteNavigationElement for better understanding
  const siteNavSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": [
      "Home",
      "About",
      "Services", 
      "Solutions",
      "Products",
      "Apex",
      "Learning Hub",
      "Careers",
      "Blog",
      "Contact"
    ]
  };

  return (
    <Helmet>
      {/* Advanced Meta Tags for Better Indexing */}
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Referrer Policy for Security */}
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Content Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      
      {/* Preconnect to External Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Structured Data Schemas */}
      
      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Site Navigation Schema */}
      <script type="application/ld+json">
        {JSON.stringify(siteNavSchema)}
      </script>
      
      {/* HowTo Schema */}
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
      
      {/* Article Schemas */}
      {articleSchema.map((schema, index) => (
        <script key={`article-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Review Schema */}
      {reviewSchema && (
        <script type="application/ld+json">
          {JSON.stringify(reviewSchema)}
        </script>
      )}
      
      {/* Course Schemas */}
      {courseSchema.map((schema, index) => (
        <script key={`course-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Product Schemas */}
      {productSchema.map((schema, index) => (
        <script key={`product-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Event Schemas */}
      {eventSchema.map((schema, index) => (
        <script key={`event-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Advanced Open Graph */}
      <meta property="og:site_name" content="Hadescore Apex & Technologies" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_IN" />
      
      {/* Advanced Twitter Card */}
      <meta name="twitter:creator" content="@HadescoreApex" />
      <meta name="twitter:site" content="@HadescoreApex" />
      <meta name="twitter:domain" content="hadescoreapex.com" />
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/logo.png" />
      
      {/* Microsoft Tile */}
      <meta name="msapplication-TileImage" content="/logo.png" />
      <meta name="msapplication-TileColor" content="#060912" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Theme Color for Different Screens */}
      <meta name="theme-color" content="#060912" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    </Helmet>
  );
}

export default AdvancedSEO;
