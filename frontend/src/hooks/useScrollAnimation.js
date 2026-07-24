import { useEffect } from 'react';

const useScrollAnimation = (currentPage) => {
  useEffect(() => {
    // Assign staggered indices to grid children
    const assignStaggerDelays = () => {
      document.querySelectorAll(
        '.programs-grid, .layout-grid, .stats-grid, .benefits-grid, .bento-grid, .premium-products-grid'
      ).forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
          child.dataset.staggerIndex = i;
        });
      });
    };

    assignStaggerDelays();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const stagger = parseInt(el.dataset.staggerIndex || 0);
            const delay = stagger * 0.08;
            const anim = el.dataset.animation ||
              `revealUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`;

            el.style.animation = anim;
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );

    const timer = setTimeout(() => {
      const selector = [
        '[data-animation]',
        '.program-card',
        '.glass-card',
        '.testimonial-card',
        '.stat-item',
        '.bullet-item',
        '.job-card',
        '.benefit-card',
        '.solution-card',
        '.product-card',
        '.leader-card-item',
        '.bento-solution-card',
        '.premium-product-card',
        '.interactive-service-card',
        '.logo-item',
        '.timeline-node',
      ].join(', ');

      document.querySelectorAll(selector).forEach(el => {
        if (!el.closest('.site-footer') && !el.closest('.main-header')) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(28px)';
          el.style.transition = 'none';
          el.style.animation = 'none';
          observer.observe(el);
        }
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPage]);
};

export default useScrollAnimation;
