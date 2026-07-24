import SEO from '../components/SEO';

const NotFoundPage = ({ navigateTo }) => {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <SEO 
        pageName="home"
        customTitle="404 - Page Not Found | Hadescore Apex & Technologies"
        customDescription="The page you're looking for doesn't exist. Return to our homepage or explore our services."
      />
      <div style={{ fontSize: '8rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '1rem' }}>
        404
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button 
        className="cta-button" 
        onClick={() => navigateTo('home')}
        style={{ padding: '1rem 2rem' }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
