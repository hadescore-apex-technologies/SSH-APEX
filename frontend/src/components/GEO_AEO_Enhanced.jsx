import { Helmet } from 'react-helmet-async';

/**
 * GEO + AEO Enhanced Component
 * Adds Geographic SEO and Answer Engine Optimization
 * to complement the existing SEO component
 */

function GEO_AEO_Enhanced({ 
  businessName = "Hadescore Apex & Technologies",
  city = "Bengaluru",
  state = "Karnataka", 
  country = "India",
  postalCode = "560001",
  streetAddress = "Bengaluru, Karnataka",
  latitude = "12.9716",
  longitude = "77.5946",
  phone = "+91-9790080274",
  email = "hadescore.apex.technologies@gmail.com",
  openingHours = "Mo-Fr 09:00-18:00, Sa 10:00-16:00",
  priceRange = "$$",
  servicesOffered = [],
  faqs = []
}) {

  // LocalBusiness Schema for GEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://hadescoreapex.com/#organization",
    "name": businessName,
    "image": "https://hadescoreapex.com/logo.png",
    "url": "https://hadescoreapex.com",
    "telephone": phone,
    "email": email,
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": postalCode,
      "addressCountry": country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/hadescore-apex-technologies",
      "https://www.instagram.com/hadescore_apex_offi"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  // Service Schema for AEO
  const servicesSchema = servicesOffered.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": servicesOffered.map((service, index) => ({
      "@type": "Service",
      "position": index + 1,
      "name": service.name,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": businessName
      }
    }))
  } : null;

  // FAQ Schema for AEO (Answer Engine Optimization)
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // BreadcrumbList Schema for better navigation understanding
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hadescoreapex.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://hadescoreapex.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Learning Hub",
        "item": "https://hadescoreapex.com/learninghub"
      }
    ]
  };

  return (
    <Helmet>
      {/* GEO - Geographic Meta Tags */}
      <meta name="geo.region" content={`${country}-${state}`} />
      <meta name="geo.placename" content={city} />
      <meta name="geo.position" content={`${latitude};${longitude}`} />
      <meta name="ICBM" content={`${latitude}, ${longitude}`} />

      {/* AEO - Conversational/Natural Language Meta */}
      <meta name="description" content={`${businessName} in ${city} - Expert software development, AI solutions, cybersecurity, and tech training services. Contact us at ${phone}.`} />
      
      {/* AEO - Question-based meta for voice search */}
      <meta name="question" content="Where to find software development services in Bangalore?" />
      <meta name="answer" content={`${businessName} provides comprehensive software development, AI, and tech services in ${city}, ${state}`} />

      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Services Schema */}
      {servicesSchema && (
        <script type="application/ld+json">
          {JSON.stringify(servicesSchema)}
        </script>
      )}

      {/* FAQ Schema for AEO */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Dublin Core for semantic web */}
      <meta name="DC.title" content={businessName} />
      <meta name="DC.creator" content={businessName} />
      <meta name="DC.subject" content="Software Development, AI Solutions, Tech Training" />
      <meta name="DC.description" content={`Technology services provider in ${city}`} />
      <meta name="DC.publisher" content={businessName} />
      <meta name="DC.contributor" content={businessName} />
      <meta name="DC.type" content="Service" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content={`${city}, ${state}, ${country}`} />

      {/* Apple Maps */}
      <meta name="apple-mobile-web-app-title" content={businessName} />
      
      {/* Windows/Bing */}
      <meta name="msapplication-TileColor" content="#060912" />
      <meta name="application-name" content={businessName} />

      {/* Alternate languages for international SEO */}
      <link rel="alternate" hrefLang="en" href="https://hadescoreapex.com/" />
      <link rel="alternate" hrefLang="en-IN" href="https://hadescoreapex.com/" />
      <link rel="alternate" hrefLang="x-default" href="https://hadescoreapex.com/" />
    </Helmet>
  );
}

export default GEO_AEO_Enhanced;
