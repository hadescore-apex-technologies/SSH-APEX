import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getBackendUrl } from '../utils/api';
import SEO from '../components/SEO';

function BlogDetail({ slug: propSlug, navigateTo }) {
  const params = useParams();
  const slug = propSlug || params.slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const MOCK_POSTS = [
    {
      id: 1,
      slug: 'unlocking-hyper-growth-ai-automation',
      title: 'Unlocking Hyper-Growth: The Power of AI & Automation for Modern Enterprises',
      author: 'Aravind Swaminathan',
      created_at: '2026-06-15T10:00:00Z',
      published_at: '2026-06-15T10:00:00Z',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      content: `<p>Artificial Intelligence and workflow automation are no longer just buzzwords or concepts reserved for speculative tech columns. In 2026, they are the driving engine behind operational efficiency, scale, and customer satisfaction for leading enterprises globally.</p>
<h2>The Evolution of Workflow Automation</h2>
<p>Early iterations of automation relied on basic Robotic Process Automation (RPA)—rigid, rule-based systems that broke down the moment inputs deviated from expectations. Today, we are seeing the rise of <strong>Cognitive Agents</strong>. These agents combine LLMs with real-time API integrations, allowing them to comprehend unstructured data, make contextual decisions, and resolve complex multi-step workflows autonomously.</p>
<blockquote>"By integrating AI Agents directly into core data pipelines, organizations can eliminate up to 75% of manual ticket routing, document ingestion, and compliance validation tasks."</blockquote>
<h2>Key Benefits of Intelligent Automation</h2>
<ul>
  <li><strong>Scalability:</strong> Systems scale instantly to match business volume fluctuations without hiring bottlenecks.</li>
  <li><strong>Data-Driven Decisions:</strong> Predictive analytics engines process telemetry data in real time to forecast demand and identify optimization areas.</li>
  <li><strong>24/7 Availability:</strong> Intelligent agents handle operations around the clock, reducing support backlogs.</li>
</ul>
<h2>How to Start Your AI Journey</h2>
<p>Transitioning to an AI-first architecture requires a structured approach. Start by auditing your daily operations to identify repetitive, high-volume tasks. Implement custom agent frameworks, connect them with secure vector stores for internal knowledge retrieval, and build feedback loops to continually train the models over time.</p>`
    },
    {
      id: 2,
      slug: 'architecting-resilient-cloud-infrastructure',
      title: 'Architecting Resilient Cloud Infrastructure: A Deep-Dive into DevOps Best Practices',
      author: 'Karthik Raja',
      created_at: '2026-06-08T10:00:00Z',
      published_at: '2026-06-08T10:00:00Z',
      cover_image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
      content: `<p>Scaling a modern web application is not just about writing clean application code. It requires building a resilient, self-healing cloud infrastructure that can handle traffic surges, secure user transactions, and deploy updates seamlessly. Here, DevOps plays an essential role.</p>
<h2>Containerization & Kubernetes</h2>
<p>Modern DevOps teams rely heavily on containerization to maintain parity between development and production environments. Kubernetes has emerged as the industry standard for managing containerized workloads, enabling automated rollouts, scaling, and self-healing when services fail.</p>
<blockquote>"True system resilience is achieved when your infrastructure expects failure and heals itself before an alert is ever sent to an engineer."</blockquote>
<h2>Methodology: Infrastructure as Code (IaC)</h2>
<p>Using tools like Terraform and Pulumi, DevOps engineers can define cloud instances, load balancers, security policies, and DNS records directly in code. This practice of Infrastructure as Code ensures that setups are documented, version-controlled, and easily reproducible across environments.</p>
<h2>Key Metrics to Track</h2>
<ul>
  <li><strong>Deployment Frequency:</strong> How often code is successfully pushed to production.</li>
  <li><strong>Mean Time to Recovery (MTTR):</strong> How quickly services are restored after a downtime incident.</li>
  <li><strong>Change Failure Rate:</strong> The percentage of deployments that require rollbacks or hotfixes.</li>
</ul>
<p>Implementing a robust DevOps culture is an iterative process. Focus on continuous integration (CI) first, followed by automated testing, and finally, automated deployment pipelines with active monitoring dashboards.</p>`
    },
    {
      id: 3,
      slug: 'mastering-ui-ux-design-spatial-computing',
      title: 'Mastering UI/UX in 2026: Designing for Spatial Computing & Immersive Web',
      author: 'Deepika Sen',
      created_at: '2026-05-24T10:00:00Z',
      published_at: '2026-05-24T10:00:00Z',
      cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      content: `<p>Interfaces are evolving rapidly, moving beyond static screens to interactive, responsive, and immersive environments. As spatial computing devices and next-generation frameworks mature, designers must adapt their patterns to keep users engaged.</p>
<h2>Glassmorphism and Spatial Depth</h2>
<p>Modern UI design relies heavily on depth cues, blur backdrops, and translucent layers (glassmorphism) to establish clear layout hierarchies. By blurring the content behind active containers, designers maintain context while highlighting key actions or modal states.</p>
<blockquote>"Good design is not just about what a page looks like, but how it feels when you click, hover, and navigate through its flows."</blockquote>
<h2>Designing for Micro-Interactions</h2>
<p>Subtle hover animations, spring transitions, and interactive scale changes bring an interface to life. These micro-interactions act as tactile feedback, confirming user actions and making digital interactions feel satisfying and natural.</p>
<h2>Usability Guidelines in 2026</h2>
<ul>
  <li><strong>Accessibility:</strong> Ensure color contrast levels meet WCAG standards and all buttons have proper touch target sizes (at least 44px).</li>
  <li><strong>Content First:</strong> Keep layouts uncluttered by prioritizing semantic hierarchies and leaving adequate breathing room.</li>
  <li><strong>Responsive Scale:</strong> Use dynamic fonts and fluid spacing grids to ensure assets look flawless from small watch faces up to ultrawide monitors.</li>
</ul>
<p>To craft premium interfaces, designers and developer partners must work closely. Prototypes should be tested early with real users to refine animations and guarantee absolute clarity across device viewports.</p>`
    }
  ];

  useEffect(() => {
    if (!slug) return;
    axios.get(getBackendUrl(`/api/blog/${slug}/`))
      .then(res => setPost(res.data))
      .catch(err => {
        console.error("Failed to load post details, using local fallback", err);
        const localPost = MOCK_POSTS.find(p => p.slug === slug);
        if (localPost) {
          setPost(localPost);
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Hadescore Blog`;

    // 1. Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    const plainTextDesc = post.content
      ? post.content.replace(/<[^>]*>/g, '').substring(0, 160)
      : '';
    descMeta.content = plainTextDesc || post.title;

    // 2. Open Graph image
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
    }
    if (post.cover_image) {
      ogImageMeta.content = post.cover_image.startsWith('http') ? post.cover_image : getBackendUrl(post.cover_image);
    }
  }, [post]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1.25rem', background: '#060912' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,229,255,0.15)', borderTopColor: '#00e5ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading article content…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !post) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1.5rem', background: '#060912', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem' }}>⚠️</div>
      <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '800', margin: 0, fontFamily: 'Outfit' }}>Article Not Found</h2>
      <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '400px', margin: 0 }}>The article you are looking for might have been removed or the link is incorrect.</p>
      <button className="btn btn-primary" onClick={() => navigateTo('blog')} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px' }}>Back to Blogs</button>
    </div>
  );

  return (
    <div style={{ background: '#060912', color: 'rgba(255,255,255,0.85)' }}>
      <SEO 
        pageName="blog"
        customTitle={post ? `${post.title} | Hadescore Blog` : 'Blog | Hadescore Apex & Technologies'}
        customDescription={post?.excerpt || 'Read our latest blog posts about technology, software development, AI, and more.'}
        imageUrl={post?.featured_image ? getBackendUrl(post.featured_image) : undefined}
      />
      {/* Article Hero Banner */}
      <section style={{
        position: 'relative',
        height: '50vh',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'flex-end',
        background: '#070b13',
        overflow: 'hidden'
      }}>
        {/* Cover Image Background */}
        {post.cover_image ? (
          <img
            src={post.cover_image.startsWith('http') ? post.cover_image : getBackendUrl(post.cover_image)}
            alt={post.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) contrast(1.05)' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0d1424, #060912)' }} />
        )}
        {/* Shadow overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #060912 0%, rgba(6, 9, 18, 0.4) 60%, transparent 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent, rgba(6,9,18,0.5))', zIndex: 1 }} />

        {/* Title & Info Container */}
        <div style={{ width: '100%', maxWidth: '840px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => navigateTo('blog')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', padding: '0.45rem 0.9rem', borderRadius: '8px',
              fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem',
              transition: 'all 0.25s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#00e5ff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to Blogs
          </button>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: '900',
            color: 'white',
            lineHeight: '1.25',
            margin: '0 0 1rem',
            fontFamily: 'Outfit, sans-serif',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span>By <strong style={{ color: 'white' }}>{post.author}</strong></span>
          </div>

          {/* GitHub and Live Buttons */}
          {(post.github_url || post.live_url) && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {post.github_url && (
                <a
                  href={post.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                  </svg>
                  GitHub Repository
                </a>
              )}
              {post.live_url && (
                <a
                  href={post.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(0, 229, 255, 0.35)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 255, 0.55)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 229, 255, 0.35)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Live Project Demo
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div
          className="blog-rich-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '-0.003em',
            wordBreak: 'break-word',
          }}
        />
      </section>

      {/* Styled rich content subelements */}
      <style>{`
        .blog-rich-content p {
          margin-bottom: 1.6rem;
        }
        .blog-rich-content h2, .blog-rich-content h3, .blog-rich-content h4 {
          color: white;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          margin-top: 2.2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .blog-rich-content h2 { font-size: 1.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; }
        .blog-rich-content h3 { font-size: 1.45rem; }
        .blog-rich-content ul, .blog-rich-content ol {
          margin-bottom: 1.6rem;
          padding-left: 1.5rem;
        }
        .blog-rich-content li {
          margin-bottom: 0.5rem;
        }
        .blog-rich-content blockquote {
          border-left: 4px solid #00e5ff;
          padding: 0.5rem 1.25rem;
          margin: 1.8rem 0;
          background: rgba(0, 229, 255, 0.03);
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: rgba(255,255,255,0.9);
        }
        .blog-rich-content pre, .blog-rich-content code {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.9rem;
        }
        .blog-rich-content code {
          padding: 2px 6px;
        }
        .blog-rich-content pre {
          padding: 1rem;
          overflow-x: auto;
          margin-bottom: 1.6rem;
        }
        .blog-rich-content pre code {
          padding: 0;
          border: none;
          background: transparent;
        }
        .blog-rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5rem 0;
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>
    </div>
  );
}

export default BlogDetail;
