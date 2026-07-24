import { useState, useEffect } from 'react';
import { getBackendUrl, fetchWithNoCache } from '../utils/api';
import CardIcon from '../components/CardIcon';
import SEO from '../components/SEO';
import RotatingLogo from '../components/RotatingLogo';


const API_BASE = getBackendUrl('/api');

function PremiumProductCard({ product, index }) {
  const desc = product.description || product.desc || '';
  return (
    <div className="premium-product-card" style={{ animationDelay: `${index * 0.1}s`, '--product-color': product.color }}>
      <div className="product-card-glow"></div>
      {product.is_coming_soon && (
        <span className="coming-soon-badge">Coming Soon</span>
      )}
      <div className="product-icon-container">
        {product.icon && product.icon.length <= 4 ? (
          <span style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{product.icon}</span>
        ) : (
          <CardIcon type={product.icon} />
        )}
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <h4 className="product-tagline">{product.tagline}</h4>
        <p className="product-desc">{desc}</p>
      </div>
    </div>
  );
}

function ProductsPage({ navigateTo }) {
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_products');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_products');
      return !cached;
    } catch {
      return true;
    }
  });
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'upcoming'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchWithNoCache(`${API_BASE}/products/`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data || []);
          if (data && data.length > 0) {
            localStorage.setItem('hadescore_cache_products', JSON.stringify(data));
          } else {
            localStorage.removeItem('hadescore_cache_products');
          }
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const liveProducts = products.filter(p => !p.is_coming_soon);
  const upcomingProducts = products.filter(p => p.is_coming_soon);
  const displayProducts = activeTab === 'live' ? liveProducts : upcomingProducts;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <SEO pageName="products" />
      {/* Hero Intro */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 4.75rem)',
            fontWeight: '900',
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            fontFamily: 'Outfit, sans-serif',
          }}>
            Our <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Products</span>
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            maxWidth: '780px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            We are building a suite of SaaS products designed to solve real business problems — affordable, scalable, and made for the Indian market.
          </p>
        </div>
      </section>

      {/* Content wrapper for scrolling contents */}
      <div className="page-content-wrapper">

      {/* Tabs list */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', padding: '0 1rem' }}>
        {[
          { id: 'live', label: 'Live Products', icon: '⚡' },
          { id: 'upcoming', label: 'Coming Soon', icon: '🚀' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '14px',
                background: isActive ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(8, 12, 28, 0.45)',
                border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 8px 24px rgba(236, 72, 153, 0.3)' : 'none',
              }}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#ec4899';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.background = 'rgba(16, 22, 42, 0.55)';
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                  e.currentTarget.style.background = 'rgba(8, 12, 28, 0.45)';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid rgba(236,72,153,0.15)', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'productspin 0.8s linear infinite' }} />
          <style>{`@keyframes productspin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* Product Grid or Empty State */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 3rem', padding: '0 1rem' }}>
        {displayProducts.length > 0 ? (
          <div className="premium-products-grid">
            {displayProducts.map((product, i) => (
              <PremiumProductCard key={product.id || i} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'rgba(8, 12, 28, 0.45)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '24px',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>
              {activeTab === 'live' ? '⚡' : '🚀'}
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              fontFamily: 'Outfit, sans-serif',
              background: activeTab === 'live' ? 'linear-gradient(135deg, #00e5ff, #8b5cf6)' : 'linear-gradient(135deg, #f59e0b, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {activeTab === 'live' ? 'Products Coming Soon' : 'Exciting SaaS Pipelines'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.92rem' }}>
              {activeTab === 'live' 
                ? "We're currently developing some amazing SaaS solutions. Explore our 'Coming Soon' tab or contact us to learn more."
                : "Our engineering and product teams are busy crafting next-gen applications. Keep an eye out for upcoming announcements!"}
            </p>
            <button 
              className="premium-cta-btn" 
              onClick={() => navigateTo('contact')} 
              style={{ 
                padding: '0.75rem 2rem', 
                fontSize: '0.9rem', 
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(236,72,153,0.3)',
                transition: 'all 0.3s'
              }}
            >
              Contact Us
            </button>
          </div>
        )}
      </section>

      {/* CTA - Only show if there are products */}
      {displayProducts.length > 0 && (
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="interactive-cta-banner" style={{ background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.8), rgba(20, 25, 34, 0.9))', borderColor: 'rgba(236, 72, 153, 0.2)', padding: '2rem' }}>
            <div className="cta-glow" style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)' }}></div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Interested in early access?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>We're onboarding select partners and early users.</p>
            <button className="premium-cta-btn" onClick={() => navigateTo('contact')} style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
              Request Early Access
            </button>
          </div>
        </section>
      )}
      </div>
    </div>
  );
}

export default ProductsPage;
// HMR trigger comment to reload Vite dev server cache.
