/**
 * Advanced Analytics & Tracking Setup
 * Tracks user behavior for better SEO insights
 */

// Track page views
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: url,
      page_title: title
    });
  }
};

// Track custom events
export const trackEvent = (category, action, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Track scroll depth (for engagement metrics)
export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;
  
  let scrollDepths = [25, 50, 75, 100];
  let tracked = new Set();
  
  const handleScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollDepths.forEach(depth => {
      if (scrollPercentage >= depth && !tracked.has(depth)) {
        trackEvent('Engagement', 'Scroll Depth', `${depth}%`, depth);
        tracked.add(depth);
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
};

// Track time on page
export const initTimeTracking = () => {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  
  const trackTime = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    if (timeSpent >= 30) {
      trackEvent('Engagement', 'Time on Page', `${timeSpent}s`, timeSpent);
    }
  };
  
  window.addEventListener('beforeunload', trackTime);
  
  return () => window.removeEventListener('beforeunload', trackTime);
};

// Track clicks on important elements
export const trackClick = (elementName) => {
  trackEvent('Click', 'Button', elementName);
};

// Track form submissions
export const trackFormSubmit = (formName) => {
  trackEvent('Form', 'Submit', formName);
};

// Track outbound links
export const trackOutboundLink = (url) => {
  trackEvent('Outbound', 'Click', url);
};

// Track search queries (if search implemented)
export const trackSearch = (query) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query
    });
  }
};

// Track video plays (if videos present)
export const trackVideoPlay = (videoName) => {
  trackEvent('Video', 'Play', videoName);
};

// Core Web Vitals tracking
export const initCoreWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  // LCP (Largest Contentful Paint)
  const observeLCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackEvent('Performance', 'LCP', 'Largest Contentful Paint', Math.round(lastEntry.renderTime || lastEntry.loadTime));
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }
  };
  
  // FID (First Input Delay)
  const observeFID = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        trackEvent('Performance', 'FID', 'First Input Delay', Math.round(entry.processingStart - entry.startTime));
      });
    });
    
    try {
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID not supported
    }
  };
  
  // CLS (Cumulative Layout Shift)
  const observeCLS = () => {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Report CLS on page unload
      window.addEventListener('beforeunload', () => {
        trackEvent('Performance', 'CLS', 'Cumulative Layout Shift', Math.round(clsValue * 1000));
      });
    } catch (e) {
      // CLS not supported
    }
  };
  
  observeLCP();
  observeFID();
  observeCLS();
};

// Initialize all tracking
export const initAnalytics = () => {
  initScrollTracking();
  initTimeTracking();
  initCoreWebVitals();
};
