import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getBackendUrl } from '../utils/api';

const MEDIA = `http://${window.location.hostname}:8000`;

function TestimonialCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(getBackendUrl('/api/testimonials/'))
      .then(res => {
        setReviews(res.data);
      })
      .catch(err => console.error("Failed to load testimonials", err))
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = useCallback(() => {
    if (reviews.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-play
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [reviews.length, nextSlide]);

  if (loading || reviews.length === 0) return null;

  const current = reviews[currentIndex];

  return (
    <section className="testimonials-section" style={{ padding: '5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Section title */}
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'inline-block' }}>Success Stories</span>
        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'white', marginBottom: '3rem', fontFamily: 'Outfit, sans-serif' }}>What Our Partners Say</h2>

        {/* Carousel Card Container */}
        <div style={{ position: 'relative', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Navigation Arrows - Desktop */}
          {reviews.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                style={{
                  position: 'absolute', left: '-50px', zIndex: 10, background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                  width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s'
                }}
                className="carousel-arrow-btn"
                onMouseOver={e => { e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.color='#10b981'; e.currentTarget.style.background='rgba(16,185,129,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button 
                onClick={nextSlide}
                style={{
                  position: 'absolute', right: '-50px', zIndex: 10, background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                  width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s'
                }}
                className="carousel-arrow-btn"
                onMouseOver={e => { e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.color='#10b981'; e.currentTarget.style.background='rgba(16,185,129,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}

          {/* Testimonial Card */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(13, 20, 38, 0.5), rgba(6, 9, 19, 0.8))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '24px',
              padding: '2.5rem',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              position: 'relative',
              animation: 'carouselFadeIn 0.5s ease both'
            }}
            key={currentIndex}
          >
            {/* Quote icon background decoration */}
            <div style={{ position: 'absolute', top: '25px', left: '30px', fontSize: '5rem', color: 'rgba(16,185,129,0.05)', fontFamily: 'serif', lineHeight: 1, pointerEvents: 'none' }}>“</div>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', fontSize: '1rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ opacity: i < current.rating ? 1 : 0.2 }}>★</span>
              ))}
            </div>

            {/* Review text */}
            <blockquote style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: '1.7',
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 2rem',
              fontStyle: 'italic',
              fontWeight: '400'
            }}>
              "{current.review_text}"
            </blockquote>

            {/* Customer info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(16,185,129,0.4)', background: 'rgba(255,255,255,0.02)' }}>
                {current.avatar ? (
                  <img src={`${MEDIA}${current.avatar}`} alt={current.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '800', fontSize: '1.2rem' }}>
                    {current.name[0]}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', color: 'white', fontSize: '1.05rem', fontFamily: 'Outfit' }}>{current.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                  {current.role} {current.company && `at ${current.company}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        {reviews.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '2rem' }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: i === currentIndex ? '#10b981' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.25s'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes carouselFadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 968px) {
          .carousel-arrow-btn { display: none !important; }
        }
      `}</style>
    </section>
  );
}

export default TestimonialCarousel;
