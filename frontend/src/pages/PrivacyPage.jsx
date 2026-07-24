import SEO from '../components/SEO';

const PrivacyPage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <SEO pageName="privacy" />
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Last updated: January 2024
        </p>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: '2rem' }}>1. Information We Collect</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          We collect information you provide directly to us, including name, email address, phone number, 
          and any other information you choose to provide when using our services or contacting us.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          We use the information we collect to:
        </p>
        <ul style={{ lineHeight: '2', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
          <li>Provide, maintain, and improve our services</li>
          <li>Respond to your inquiries and requests</li>
          <li>Send you technical notices and support messages</li>
          <li>Communicate with you about products, services, and events</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>3. Information Sharing</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          We do not share your personal information with third parties except as described in this policy. 
          We may share information with service providers who perform services on our behalf.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>4. Data Security</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          We take reasonable measures to protect your personal information from unauthorized access, 
          use, or disclosure. However, no internet transmission is ever completely secure.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>5. Your Rights</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          You have the right to access, update, or delete your personal information. 
          Contact us at <a href="mailto:hadescore.apex.technologies@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'none' }}>hadescore.apex.technologies@gmail.com</a> to exercise these rights.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>6. Contact Us</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          If you have questions about this Privacy Policy, please contact us at <a href="mailto:hadescore.apex.technologies@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4f9cff', textDecoration: 'none' }}>hadescore.apex.technologies@gmail.com</a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
