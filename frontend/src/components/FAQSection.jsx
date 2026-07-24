import { useState } from 'react';

function FAQSection({ faqs, title = "Frequently Asked Questions", subtitle = "Everything you need to know about our services" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ marginBottom: '6.5rem', maxWidth: '900px', margin: '0 auto 6.5rem', padding: '0 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          color: 'var(--primary)', 
          letterSpacing: '0.08em', 
          textTransform: 'uppercase' 
        }}>
          FAQ
        </span>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          marginTop: '0.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'Outfit, sans-serif'
        }}>
          {title}
        </h2>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.05rem' 
        }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              borderColor: openIndex === index ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'inherit'
              }}
            >
              <span style={{ flex: 1 }}>{faq.question}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: openIndex === index ? 'var(--accent)' : 'var(--text-secondary)'
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <div
              style={{
                maxHeight: openIndex === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}
            >
              <div style={{
                padding: '0 1.5rem 1.25rem 1.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                borderTop: openIndex === index ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                paddingTop: openIndex === index ? '1.25rem' : '0'
              }}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schema markup for FAQ - already handled by GEO_AEO_Enhanced */}
    </section>
  );
}

export default FAQSection;
