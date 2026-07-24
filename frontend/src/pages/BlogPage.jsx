import { useState, useEffect } from 'react';
import { getBackendUrl, fetchWithNoCache } from '../utils/api';
import RotatingLogo from '../components/RotatingLogo';
import SEO from '../components/SEO';

function BlogPage({ navigateTo }) {
  const [posts, setPosts] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_blog_posts');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_blog_posts');
      return !cached;
    } catch {
      return true;
    }
  });

  // Fetch blog posts function
  const fetchBlogPosts = (showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }
    fetchWithNoCache(getBackendUrl('/api/blog/'))
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        // Always update with API data — sort oldest first, newest last
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at);
          const dateB = new Date(b.published_at || b.created_at);
          return dateA - dateB;
        });
        setPosts(sorted);
        if (sorted.length > 0) {
          localStorage.setItem('hadescore_cache_blog_posts', JSON.stringify(sorted));
        } else {
          localStorage.removeItem('hadescore_cache_blog_posts');
        }
      })
      .catch(err => {
        console.error("Failed to load blog posts", err);
      })
      .finally(() => setLoading(false));
  };

  // Fetch on mount
  useEffect(() => {
    const cached = localStorage.getItem('hadescore_cache_blog_posts');
    fetchBlogPosts(!cached);
  }, []);

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBlogPosts(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);


  return (
    <div>
      <SEO pageName="blog" />
      {/* Hero Section */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 18, 0.75), rgba(6, 9, 18, 0.95)), url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', margin: '0 auto', zIndex: 2, position: 'relative', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#00e5ff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }} data-animation="slideInUp 0.8s ease-out forwards">Insights & Announcements</span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            fontFamily: 'Outfit, sans-serif'
          }} data-animation="slideInUp 0.8s ease-out 0.1s forwards">
            The <span style={{ background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hadescore Blog</span>
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            lineHeight: '1.7',
            maxWidth: '650px',
            margin: '0 auto',
            fontWeight: '400'
          }} data-animation="slideInUp 0.8s ease-out 0.2s forwards">
            Explore industry insights, technical deep-dives, startup wisdom, and corporate updates from the Hadescore engineering and research teams.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="page-content-wrapper" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,229,255,0.15)', borderTopColor: '#00e5ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Fetching articles…</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📰</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Articles Yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>We are crafting some amazing content. Please check back later!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {posts.map((post, idx) => (
              <article
                key={post.id}
                onClick={() => navigateTo(`blog/${post.slug}`)}
                className="blog-card-hover"
                style={{
                  background: 'linear-gradient(135deg, rgba(13, 20, 38, 0.45), rgba(6, 9, 19, 0.75))',
                  border: '1px solid rgba(0, 229, 255, 0.15)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                {/* Glow Overlay */}
                <div className="blog-glow-layer" style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.1), transparent 60%)',
                  opacity: 0, transition: 'opacity 0.35s ease', pointerEvents: 'none'
                }}></div>

                {/* Cover Image */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: '#070b13' }}>
                  {post.cover_image ? (
                    <img
                      src={post.cover_image.startsWith('http') ? post.cover_image : getBackendUrl(post.cover_image)}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      className="blog-card-img"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #070b13, #152038)', color: 'rgba(0, 229, 255, 0.15)', fontSize: '3rem' }}>
                      📷
                    </div>
                  )}
                  <span style={{ position: 'absolute', bottom: '15px', left: '15px', padding: '3px 10px', background: 'rgba(6,9,19,0.75)', backdropFilter: 'blur(4px)', borderRadius: '6px', fontSize: '0.72rem', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', fontWeight: '600' }}>
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Content Panel */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                    <span>By <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{post.author}</strong></span>
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: 'white',
                    margin: 0,
                    lineHeight: '1.4',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'color 0.25s ease'
                  }} className="blog-card-title">
                    {post.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: '1.6',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content.replace(/<[^>]*>/g, '')}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00e5ff', fontSize: '0.85rem', fontWeight: '700' }}>
                      <span>Read Article</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>

                    {/* GitHub & Live link icons */}
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                      {post.github_url && (
                        <a 
                          href={post.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="View GitHub Repository"
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            transition: 'color 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem',
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#00e5ff'}
                          onMouseOut={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                          </svg>
                        </a>
                      )}
                      {post.live_url && (
                        <a 
                          href={post.live_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="Launch Live Project"
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            transition: 'color 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem',
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#ec4899'}
                          onMouseOut={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .blog-card-hover:hover {
          transform: translateY(-8px);
          border-color: #00e5ff !important;
          box-shadow: 0 15px 35px rgba(0, 229, 255, 0.15);
        }
        .blog-card-hover:hover .blog-glow-layer {
          opacity: 1;
        }
        .blog-card-hover:hover .blog-card-img {
          transform: scale(1.06);
        }
        .blog-card-hover:hover .blog-card-title {
          color: #00e5ff !important;
        }
      `}</style>
    </div>
  );
}

export default BlogPage;
