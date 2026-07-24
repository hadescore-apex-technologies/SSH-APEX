import { useState, useEffect } from 'react';
import { getBackendUrl } from '../utils/api';
import SEO from '../components/SEO';
import RotatingLogo from '../components/RotatingLogo';


const API_BASE = getBackendUrl('/api');

/* ─── Inline SVG Icons (no emojis) ─────────────────────────────────────── */
const Icons = {
  // Labs
  AiLab: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  ),
  Biotech: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="m4.5 10.5 15 3M4.5 13.5l15-3M4.5 10.5c3.5-3 11.5-3 15 0M4.5 13.5c3.5 3 11.5 3 15 0M8 8.5v7M12 9v6M16 8.5v7" />
    </svg>
  ),
  Robotics: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4M8 15h.01M16 15h.01M12 18H8" />
    </svg>
  ),
  EV: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Drone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM19 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM19 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      <path d="m7 5 10 10M17 5 7 15" />
    </svg>
  ),
  Quantum: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-45 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  // Programs
  Spark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Accelerator: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  ),
  Scale: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  // Portfolio
  NeuroPulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  AgriSwarm: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 20V10M12 10a6 6 0 0 1 6-6H12M12 10a6 6 0 0 0-6-6H12" />
      <path d="M9 14h6" />
    </svg>
  ),
  VoltStack: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <path d="M7 6V4h2v2M15 6V4h2v2M12 10v4M10 12h4" />
    </svg>
  ),
  Helix: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="m4.5 10.5 15 3M4.5 13.5l15-3M4.5 10.5c3.5-3 11.5-3 15 0M4.5 13.5c3.5 3 11.5 3 15 0M8 8.5v7M12 9v6M16 8.5v7" />
    </svg>
  ),
  Guardian: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 11 11 13 15 9" />
    </svg>
  ),
  OrbitMesh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="5" r="2" />
      <circle cx="20" cy="5" r="2" />
      <circle cx="12" cy="20" r="2" />
      <path d="M5.5 6.5h13M12 12V6M12 12l-6 6M12 12l6 6" />
    </svg>
  ),
  // Research & Events generic
  Research: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Event: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Rocket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
};

/* Section → Icon mapping */
const LAB_ICONS    = [Icons.AiLab, Icons.Biotech, Icons.Robotics, Icons.EV, Icons.Drone, Icons.Quantum];
const PROG_ICONS   = [Icons.Spark, Icons.Accelerator, Icons.Scale];
const PORT_ICONS   = [Icons.NeuroPulse, Icons.AgriSwarm, Icons.VoltStack, Icons.Helix, Icons.Guardian, Icons.OrbitMesh];
const RES_ICONS    = [Icons.AiLab, Icons.Robotics, Icons.Drone, Icons.Quantum];
const EVT_ICONS    = [Icons.Event, Icons.Spark, Icons.Scale, Icons.Event];

/* ─── Fallback data ─────────────────────────────────────────────────────── */
const FALLBACK_ITEMS = [
  { section:'hero',      title:'Division 03 · Hadescore Apex', subtitle:'Where moonshots become products.', description:"Apex is Hadescore's innovation engine — six research labs, three startup programs, and a portfolio of 48+ deep-tech ventures shipping the future from India.", tags:'Build the next decade with us.', extra:'Apply Now', link:'contact', order:0, is_active:true },
  { section:'stats',     title:'48',     subtitle:'Active startups',    order:0, is_active:true },
  { section:'stats',     title:'₹220 Cr',subtitle:'Capital deployed',   order:1, is_active:true },
  { section:'stats',     title:'32',     subtitle:'Patents filed',      order:2, is_active:true },
  { section:'stats',     title:'60+',    subtitle:'Research papers',    order:3, is_active:true },
  { section:'labs',      title:'AI Research Lab',      subtitle:'Foundation models, agentic systems, fine-tuning at scale.', description:'LLMs · Agents · RAG · Eval', order:0, is_active:true },
  { section:'labs',      title:'Biotech Lab',           subtitle:'Wet + dry labs for genomics, drug discovery & synthetic bio.', description:'CRISPR · Bioinformatics · Synthetic Biology', order:1, is_active:true },
  { section:'labs',      title:'Robotics Lab',          subtitle:'Industrial automation, humanoid R&D, ROS2 stack.', description:'Manipulation · SLAM · Sim2Real', order:2, is_active:true },
  { section:'labs',      title:'EV & Energy Lab',       subtitle:'Battery chemistry, BMS, motor controllers, charging infra.', description:'BMS · Powertrain · Charging', order:3, is_active:true },
  { section:'labs',      title:'Drone & Aerospace',     subtitle:'BVLOS missions, swarm intelligence, defence-grade UAVs.', description:'Pixhawk · Swarming · GIS', order:4, is_active:true },
  { section:'labs',      title:'Quantum Lab',           subtitle:'Qiskit, Cirq, hybrid algorithms for optimization & ML.', description:'QAOA · Annealing · Hybrid', order:5, is_active:true },
  { section:'programs',  title:'Spark Studio',    subtitle:'Pre-Seed', description:'Idea-stage founders. 8-week incubation, mentors, MVP grant.', tags:'₹2L grant · Equity-free · MVP in 8 weeks', order:0, is_active:true },
  { section:'programs',  title:'Apex Accelerator',subtitle:'Seed',     description:'Working prototype to ₹1Cr+ revenue. 16-week deep-tech accelerator.', tags:'₹25L cheque · GTM playbook · Investor day', order:1, is_active:true },
  { section:'programs',  title:'Scale Pods',      subtitle:'Growth',   description:'Post-revenue startups scaling to Series A. Operator-led mentorship.', tags:'Operator network · Hiring partner · Capital access', order:2, is_active:true },
  { section:'portfolio', title:'NeuroPulse AI', subtitle:'Series A · Healthcare AI', description:'Real-time stroke detection from CT scans.', order:0, is_active:true },
  { section:'portfolio', title:'AgriSwarm',      subtitle:'Seed · Drone-Tech',       description:'Autonomous drone swarms for precision agriculture.', order:1, is_active:true },
  { section:'portfolio', title:'VoltStack',      subtitle:'Pre-Series A · EV Infra', description:'Modular DC fast-charging network for tier-2 India.', order:2, is_active:true },
  { section:'portfolio', title:'Helix Bio',      subtitle:'Seed · Biotech',          description:'AI-designed enzymes for industrial bio-manufacturing.', order:3, is_active:true },
  { section:'portfolio', title:'GuardianOS',     subtitle:'Series A · Cybersecurity', description:'AI SOC for mid-market — autonomous threat response.', order:4, is_active:true },
  { section:'portfolio', title:'OrbitMesh',      subtitle:'Pre-Seed · SpaceTech',    description:'Software-defined ground stations for nano-sats.', order:5, is_active:true },
  { section:'research',  title:'Bharat-7B',          subtitle:'AI',       description:'Open-source 7B param multilingual LLM tuned on 22 Indian languages.', order:0, is_active:true },
  { section:'research',  title:'ROSE-Manipulator',   subtitle:'Robotics', description:'End-to-end imitation-learning stack for 6-DOF arms.', order:1, is_active:true },
  { section:'research',  title:'Skyfall BVLOS',       subtitle:'Drone',   description:'Regulatory + tech stack for beyond-visual-line-of-sight drones.', order:2, is_active:true },
  { section:'research',  title:'QLayer',              subtitle:'Quantum',  description:'Hybrid classical-quantum optimizer for logistics routing.', order:3, is_active:true },
  { section:'events',    title:'ApexCon',      subtitle:'Annual deep-tech summit.',             description:'3,000+ attendees, 80+ speakers.', order:0, is_active:true },
  { section:'events',    title:'Moonshot Hack', subtitle:'72-hour invite-only hackathon.',       description:'₹1Cr prize pool.', order:1, is_active:true },
  { section:'events',    title:'Investor Day',  subtitle:"Curated demo day with India's top deep-tech VCs.", description:'', order:2, is_active:true },
  { section:'events',    title:'Lab Open House',subtitle:'Monthly tours of Apex labs.',          description:'Open to learners & enterprises.', order:3, is_active:true },
  { section:'cta',       title:'Build the next decade with us.', subtitle:'Founders, researchers, operators & capital partners — apply.', description:'Join Apex and ship deep-tech ventures from India to the world.', link:'contact', extra:'Apply to Apex', order:0, is_active:true },
];

const groupBySection = (items) =>
  items.reduce((acc, item) => {
    if (!item.is_active) return acc;
    const s = item.section || 'misc';
    if (!acc[s]) acc[s] = [];
    acc[s].push(item);
    return acc;
  }, {});

const sorted = (arr) => [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/* ─── Palettes per section ──────────────────────────────────────────────── */
const PALETTES = {
  labs:      { accent:'#6366f1', glow:'rgba(99,102,241,0.35)',  shimmer:'rgba(99,102,241,0.12)',  bg:'rgba(99,102,241,0.08)',  border:'rgba(99,102,241,0.22)',  topBar:'linear-gradient(90deg,#4f46e5,#818cf8)' },
  programs:  { accent:'#10b981', glow:'rgba(16,185,129,0.35)',  shimmer:'rgba(16,185,129,0.12)',  bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.22)',  topBar:'linear-gradient(90deg,#059669,#34d399)' },
  portfolio: { accent:'#ec4899', glow:'rgba(236,72,153,0.35)',  shimmer:'rgba(236,72,153,0.12)',  bg:'rgba(236,72,153,0.08)',  border:'rgba(236,72,153,0.22)',  topBar:'linear-gradient(90deg,#db2777,#f472b6)' },
  research:  { accent:'#8b5cf6', glow:'rgba(139,92,246,0.35)',  shimmer:'rgba(139,92,246,0.12)',  bg:'rgba(139,92,246,0.08)',  border:'rgba(139,92,246,0.22)',  topBar:'linear-gradient(90deg,#7c3aed,#c084fc)' },
  events:    { accent:'#f43f5e', glow:'rgba(244,63,94,0.35)',   shimmer:'rgba(244,63,94,0.12)',   bg:'rgba(244,63,94,0.08)',   border:'rgba(244,63,94,0.22)',   topBar:'linear-gradient(90deg,#e11d48,#fb7185)' },
};

/* ─── Animated Card ─────────────────────────────────────────────────────── */
function ApexCard({ children, palette, delay = 0, className = '' }) {
  return (
    <div
      className={`apex-anim-card ${className}`}
      style={{ animationDelay: `${delay}ms`, '--accent': palette.accent, '--glow': palette.glow, '--shimmer': palette.shimmer, '--card-bg': palette.bg, '--card-border': palette.border, '--topbar': palette.topBar }}
    >
      {children}
    </div>
  );
}

/* ─── Icon Box ──────────────────────────────────────────────────────────── */
function IconBox({ Icon, palette }) {
  return (
    <div className="apex-icon-box" style={{ '--accent': palette.accent, '--glow': palette.glow, color: palette.accent }}>
      <Icon />
    </div>
  );
}

function ApexPage({ navigateTo }) {
  const [items, setItems] = useState(() => {
    try { const c = localStorage.getItem('hadescore_cache_apex'); return c ? JSON.parse(c) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(() => {
    try { return !localStorage.getItem('hadescore_cache_apex'); } catch { return true; }
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/apex/`);
        if (res.ok) {
          const data = await res.json();
          const g = groupBySection(data);
          setItems(g);
          localStorage.setItem('hadescore_cache_apex', JSON.stringify(g));
        } else if (!items) setItems(groupBySection(FALLBACK_ITEMS));
      } catch { if (!items) setItems(groupBySection(FALLBACK_ITEMS)); }
      finally { setLoading(false); }
    })();
  }, []);

  const fallbackGrouped = groupBySection(FALLBACK_ITEMS);
  const backendGrouped = items || {};
  const grouped = { ...fallbackGrouped };
  Object.keys(backendGrouped).forEach(key => {
    if (backendGrouped[key] && backendGrouped[key].length > 0) {
      grouped[key] = backendGrouped[key];
    }
  });
  const hero     = grouped.hero      ? sorted(grouped.hero)[0]      : null;
  const stats    = sorted(grouped.stats      || []);
  const labs     = sorted(grouped.labs       || []);
  const programs = sorted(grouped.programs   || []);
  const portfolio= sorted(grouped.portfolio  || []);
  const research = sorted(grouped.research   || []);
  const events   = sorted(grouped.events     || []);
  const cta      = grouped.cta ? sorted(grouped.cta)[0] : null;

  const P = PALETTES;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <SEO pageName="apex" />
      <style>{`
        /* ── Entrance animation ── */
        @keyframes apexFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* ── Shimmer sweep ── */
        @keyframes apexShimmer {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        /* ── Glow pulse on icon ── */
        @keyframes apexIconPulse {
          0%,100% { box-shadow: 0 0 0 0 var(--glow); }
          50%      { box-shadow: 0 0 0 8px transparent; }
        }
        /* ── Hero gradient flow ── */
        @keyframes heroGradFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* ── Stat counter rise ── */
        @keyframes statRise {
          from { opacity: 0; transform: translateY(14px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        /* ── CTA shimmer orb ── */
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-10px) scale(1.04); }
        }

        /* ── Animated card base ── */
        .apex-anim-card {
          position: relative;
          background: linear-gradient(135deg, rgba(8,12,28,0.65), rgba(14,20,44,0.55));
          border: 1px solid var(--card-border);
          border-radius: 22px;
          padding: 1.65rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          opacity: 0;
          animation: apexFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.4s ease,
                      box-shadow 0.4s ease,
                      background 0.4s ease;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        /* top accent bar */
        .apex-anim-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--topbar);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 22px 22px 0 0;
        }
        /* shimmer sweep */
        .apex-anim-card::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--shimmer), transparent);
          transform: skewX(-15deg);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .apex-anim-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-border);
          box-shadow: 0 22px 50px var(--glow), inset 0 1px 0 rgba(255,255,255,0.06);
          background: linear-gradient(135deg, rgba(12,18,38,0.8), rgba(18,26,54,0.7));
        }
        .apex-anim-card:hover::before { opacity: 1; }
        .apex-anim-card:hover::after  {
          opacity: 1;
          animation: apexShimmer 0.7s ease forwards;
        }

        /* ── Icon box ── */
        .apex-icon-box {
          width: 46px; height: 46px; min-width: 46px;
          border-radius: 14px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          flex-shrink: 0;
        }
        .apex-anim-card:hover .apex-icon-box {
          background: var(--card-bg);
          transform: scale(1.15) rotate(8deg);
          animation: apexIconPulse 1.2s ease infinite;
          border-color: var(--accent);
        }

        /* ── Tag pill ── */
        .apex-tag-pill {
          display: inline-block;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--accent);
        }

        /* ── Stats ── */
        .apex-stat-card {
          background: rgba(8,12,28,0.6);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 1.5rem 1.75rem;
          display: flex; flex-direction: column; gap: 0.4rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          opacity: 0;
          animation: statRise 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          position: relative; overflow: hidden;
        }
        .apex-stat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, var(--stat-shimmer, rgba(99,102,241,0.08)), transparent 70%);
          pointer-events: none;
        }
        .apex-stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--stat-border, rgba(99,102,241,0.3));
          box-shadow: 0 16px 40px var(--stat-glow, rgba(99,102,241,0.2));
        }
        .apex-stat-val {
          font-size: 2.85rem;
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
          line-height: 1;
          background: var(--stat-grad);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ── Grids ── */
        .apex-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.75rem; align-items: stretch; }
        .apex-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.75rem; align-items: stretch; }

        /* ── Section headings ── */
        .apex-sh { font-size: 2.4rem; font-weight: 800; color: white; font-family: 'Outfit',sans-serif; letter-spacing: -0.02em; margin: 0 0 0.65rem; }
        .apex-sp { color: rgba(255,255,255,0.5); font-size: 1rem; line-height: 1.7; max-width: 600px; margin: 0 auto; }

        /* ── CTA orb ── */
        .apex-cta-orb {
          width: 68px; height: 68px;
          border-radius: 24px;
          background: linear-gradient(135deg, #4f46e5, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 16px 40px rgba(79,70,229,0.5);
          animation: orbFloat 3s ease-in-out infinite;
          color: white;
        }

        /* ── Research badge ── */
        .apex-res-badge {
          font-size: 0.72rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 0.2rem 0.65rem; border-radius: 8px;
          background: rgba(139,92,246,0.12); color: #a78bfa;
          border: 1px solid rgba(139,92,246,0.25);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .apex-grid-3 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 680px) {
          .apex-grid-3, .apex-grid-2 { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
          .apex-sh { font-size: 1.85rem !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="page-hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060912',
        backgroundImage: `linear-gradient(to bottom, rgba(6,9,18,0.75), rgba(6,9,18,0.94)), url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80)`
      }}>
        <RotatingLogo opacity={0.12} size="default" />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', maxWidth:'900px', margin:'0 auto', zIndex:2, position: 'relative' }}>
          <h1 style={{ fontSize:'clamp(2.8rem,6vw,4.75rem)', fontWeight:'900', lineHeight:'1.1', letterSpacing:'-0.03em', color:'white', margin:'0 0 1.5rem', fontFamily:'Outfit,sans-serif', textAlign:'center' }}>
            Where moonshots become{' '}
            <span style={{ background:'linear-gradient(135deg,#00e5ff 0%,#8b5cf6 60%,#ec4899 100%)', backgroundSize:'300% 300%', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', animation:'heroGradFlow 5s ease infinite' }}>
              products.
            </span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'clamp(0.95rem,2.2vw,1.12rem)', lineHeight:'1.75', maxWidth:'760px', margin:'0 0 2.5rem', textAlign:'center', fontWeight:'400' }}>
            Apex is Hadescore's innovation engine —{' '}
            <span style={{ color:'#e2e8f0', fontWeight:'500' }}>
              six research labs, three startup programs, and a portfolio of 48+ deep-tech ventures shipping the future from India.
            </span>
          </p>
          <div style={{ display:'flex', gap:'1.25rem', flexWrap:'wrap', justifyContent:'center' }}>
            <button
              onClick={() => navigateTo('contact')}
              style={{ background:'linear-gradient(95deg,#00e5ff 0%,#8b5cf6 100%)', color:'#060912', fontWeight:'800', padding:'0.9rem 2.5rem', borderRadius:'9999px', fontSize:'0.95rem', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', boxShadow:'0 0 24px rgba(0,229,255,0.4)', transition:'all 0.25s ease' }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 32px rgba(0,229,255,0.6)'; }}
              onMouseOut={e  => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 0 24px rgba(0,229,255,0.4)'; }}
            >
              Apply to Incubator
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button
              onClick={() => navigateTo('contact')}
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.14)', color:'white', fontWeight:'700', padding:'0.9rem 2.5rem', borderRadius:'9999px', fontSize:'0.95rem', cursor:'pointer', transition:'all 0.25s ease' }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='rgba(255,255,255,0.1)'; }}
              onMouseOut={e  => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
            >
              Partner with a Lab
            </button>
          </div>
        </div>
      </section>

      <div className="page-content-wrapper">

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <section style={{ padding:'2.5rem 1rem 0', maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem' }}>
            {stats.map((item, idx) => {
              const grads   = ['linear-gradient(135deg,#00e5ff,#6366f1)', 'linear-gradient(135deg,#a78bfa,#ec4899)', 'linear-gradient(135deg,#10b981,#06b6d4)', 'linear-gradient(135deg,#f59e0b,#ef4444)'];
              const glows   = ['rgba(99,102,241,0.25)', 'rgba(236,72,153,0.25)', 'rgba(16,185,129,0.25)', 'rgba(245,158,11,0.25)'];
              const borders = ['rgba(99,102,241,0.3)',  'rgba(236,72,153,0.3)',  'rgba(16,185,129,0.3)',  'rgba(245,158,11,0.3)'];
              return (
                <div key={item.title} className="apex-stat-card"
                  style={{ animationDelay:`${idx * 80}ms`, '--stat-grad':grads[idx%4], '--stat-shimmer':glows[idx%4], '--stat-glow':glows[idx%4], '--stat-border':borders[idx%4] }}
                >
                  <div className="apex-stat-val">{item.title}</div>
                  <div style={{ color:'rgba(255,255,255,0.42)', fontSize:'0.82rem', fontWeight:'700', letterSpacing:'0.04em', textTransform:'uppercase' }}>{item.subtitle}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Innovation Labs ─────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 1rem', maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ marginBottom:'3.5rem', textAlign:'center' }}>
            <h2 className="apex-sh">Innovation Labs</h2>
            <p className="apex-sp">Six labs. One frontier. We invent and ship foundational technologies across AI, biotech, robotics, energy, drone systems, and quantum.</p>
          </div>
          <div className="apex-grid-3">
            {labs.map((item, idx) => {
              const Icon = LAB_ICONS[idx % LAB_ICONS.length];
              return (
                <ApexCard key={item.title} palette={P.labs} delay={idx * 90}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', marginBottom:'1rem' }}>
                    <IconBox Icon={Icon} palette={P.labs} />
                    <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:'800', color:'white', fontFamily:'Outfit,sans-serif' }}>{item.title}</h3>
                  </div>
                  <p style={{ margin:'0 0 1rem', color:'rgba(255,255,255,0.52)', fontSize:'0.91rem', lineHeight:1.65 }}>{item.subtitle}</p>
                  <div style={{ marginTop:'auto', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'0.75rem' }}>
                    <span className="apex-tag-pill" style={{ '--card-bg':P.labs.bg, '--card-border':P.labs.border, '--accent':P.labs.accent }}>{item.description}</span>
                  </div>
                </ApexCard>
              );
            })}
          </div>
        </section>

        {/* ── Startup Programs ────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 1rem', background:'rgba(255,255,255,0.012)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ marginBottom:'3.5rem', textAlign:'center' }}>
              <h2 className="apex-sh">Startup Programs</h2>
              <p className="apex-sp">From idea to IPO-ready. Choose a program built for every stage of deep-tech company building.</p>
            </div>
            <div className="apex-grid-3">
              {programs.map((item, idx) => {
                const Icon = PROG_ICONS[idx % PROG_ICONS.length];
                const sub = item.subtitle?.toLowerCase() || '';
                const badgeCls = sub.includes('growth') ? 'phase-badge-growth' : sub.includes('seed') && !sub.includes('pre') ? 'phase-badge-seed' : 'phase-badge-pre-seed';
                return (
                  <ApexCard key={item.title} palette={P.programs} delay={idx * 100}>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.2rem' }}>
                      <IconBox Icon={Icon} palette={P.programs} />
                      <div>
                        <span style={{ display:'inline-block', padding:'0.18rem 0.6rem', borderRadius:'7px', fontSize:'0.65rem', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.06em', background:P.programs.bg, border:`1px solid ${P.programs.border}`, color:P.programs.accent }}>
                          {item.subtitle}
                        </span>
                        <h3 style={{ margin:'0.3rem 0 0', fontSize:'1.15rem', fontWeight:'800', color:'white', fontFamily:'Outfit,sans-serif' }}>{item.title}</h3>
                      </div>
                    </div>
                    <p style={{ color:'rgba(255,255,255,0.52)', lineHeight:1.7, marginBottom:'auto', fontSize:'0.92rem' }}>{item.description}</p>
                    {item.tags && (
                      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'0.85rem', marginTop:'1.25rem' }}>
                        <p style={{ margin:0, color:P.programs.accent, fontSize:'0.83rem', fontWeight:'700', opacity:0.85 }}>{item.tags}</p>
                      </div>
                    )}
                  </ApexCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Portfolio ───────────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 1rem', maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ marginBottom:'3.5rem', textAlign:'center' }}>
            <h2 className="apex-sh">Portfolio Companies</h2>
            <p className="apex-sp">48 deep-tech ventures and counting — startups building today's breakthroughs for India and the world.</p>
          </div>
          <div className="apex-grid-3">
            {portfolio.map((item, idx) => {
              const Icon = PORT_ICONS[idx % PORT_ICONS.length];
              return (
                <ApexCard key={item.title} palette={P.portfolio} delay={idx * 80}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', marginBottom:'1.1rem' }}>
                    <IconBox Icon={Icon} palette={P.portfolio} />
                    <div>
                      <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:'800', color:'white', fontFamily:'Outfit,sans-serif' }}>{item.title}</h3>
                      <p style={{ margin:'0.25rem 0 0', color:'#38bdf8', fontSize:'0.78rem', fontWeight:'700', letterSpacing:'0.04em', textTransform:'uppercase' }}>{item.subtitle}</p>
                    </div>
                  </div>
                  <p style={{ margin:0, color:'rgba(255,255,255,0.5)', lineHeight:1.7, fontSize:'0.9rem' }}>{item.description}</p>
                </ApexCard>
              );
            })}
          </div>
        </section>

        {/* ── Active Research ─────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 1rem', background:'rgba(255,255,255,0.012)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:'2rem', marginBottom:'3.5rem' }}>
              <div>
                <h2 className="apex-sh" style={{ textAlign:'left', margin:'0 0 0.5rem' }}>Active Research</h2>
                <p className="apex-sp" style={{ textAlign:'left', maxWidth:'480px', margin:0 }}>Open-source projects from India, built for the world.</p>
              </div>
              <button onClick={() => navigateTo('contact')} style={{ padding:'0.85rem 1.9rem', borderRadius:'999px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'white', border:'none', fontWeight:'800', cursor:'pointer', fontSize:'0.9rem', boxShadow:'0 6px 18px rgba(124,58,237,0.4)', transition:'all 0.25s ease', whiteSpace:'nowrap' }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(124,58,237,0.55)'; }}
                onMouseOut={e  => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 6px 18px rgba(124,58,237,0.4)';  }}>
                Partner with Apex
              </button>
            </div>
            <div className="apex-grid-2">
              {research.map((item, idx) => {
                const Icon = RES_ICONS[idx % RES_ICONS.length];
                return (
                  <ApexCard key={item.title} palette={P.research} delay={idx * 100}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', marginBottom:'1.1rem' }}>
                      <IconBox Icon={Icon} palette={P.research} />
                      <div>
                        <span className="apex-res-badge">{item.subtitle}</span>
                        <h3 style={{ margin:'0.3rem 0 0', fontSize:'1.1rem', fontWeight:'800', color:'white', fontFamily:'Outfit,sans-serif' }}>{item.title}</h3>
                      </div>
                    </div>
                    <p style={{ margin:0, color:'rgba(255,255,255,0.5)', fontSize:'0.9rem', lineHeight:1.7 }}>{item.description}</p>
                  </ApexCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Flagship Events ─────────────────────────────────────────────── */}
        <section style={{ padding:'5rem 1rem', maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ marginBottom:'3.5rem', textAlign:'center' }}>
            <h2 className="apex-sh">Flagship Events</h2>
            <p className="apex-sp">Apex convenes founders, researchers, investors, and builders through events that shape deep-tech ecosystems.</p>
          </div>
          <div className="apex-grid-2">
            {events.map((item, idx) => {
              const Icon = EVT_ICONS[idx % EVT_ICONS.length];
              return (
                <ApexCard key={item.title} palette={P.events} delay={idx * 90}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', marginBottom:'1.1rem' }}>
                    <IconBox Icon={Icon} palette={P.events} />
                    <div>
                      <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:'800', color:'white', fontFamily:'Outfit,sans-serif' }}>{item.title}</h3>
                      <p style={{ margin:'0.2rem 0 0', color:'#c4b5fd', fontSize:'0.8rem', fontWeight:'600' }}>{item.subtitle}</p>
                    </div>
                  </div>
                  {item.description && <p style={{ margin:0, color:'rgba(255,255,255,0.5)', lineHeight:1.65, fontSize:'0.9rem' }}>{item.description}</p>}
                </ApexCard>
              );
            })}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        {cta && (
          <section style={{ padding:'3rem 1rem 4rem' }}>
            <div style={{ maxWidth:'960px', margin:'0 auto', padding:'3.5rem 2.5rem', borderRadius:'32px', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', background:'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(14,165,233,0.14))', border:'1px solid rgba(99,102,241,0.25)', boxShadow:'0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'1.75rem' }}>
                <div className="apex-cta-orb">
                  <Icons.Rocket />
                </div>
                <div>
                  <h2 style={{ margin:'0 0 0.6rem', fontSize:'2.2rem', fontWeight:'900', color:'white', fontFamily:'Outfit,sans-serif' }}>{cta.title}</h2>
                  <p style={{ margin:0, color:'rgba(255,255,255,0.55)', fontSize:'1.05rem', lineHeight:1.75, maxWidth:'680px' }}>{cta.subtitle}</p>
                </div>
                <p style={{ margin:0, color:'rgba(255,255,255,0.7)', maxWidth:'680px', lineHeight:1.8, fontSize:'0.97rem' }}>{cta.description}</p>
                <button
                  onClick={() => navigateTo('contact')}
                  style={{ padding:'1rem 2.75rem', borderRadius:'999px', background:'linear-gradient(135deg,#4f46e5,#0ea5e9)', border:'none', color:'white', fontWeight:'800', cursor:'pointer', fontSize:'1rem', boxShadow:'0 8px 24px rgba(79,70,229,0.5)', transition:'all 0.25s ease' }}
                  onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(79,70,229,0.65)'; }}
                  onMouseOut={e  => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 8px 24px rgba(79,70,229,0.5)';  }}
                >
                  {cta.extra || 'Apply Now'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {loading && (
        <div style={{ padding:'1rem', textAlign:'center', color:'rgba(255,255,255,0.35)', fontSize:'0.9rem' }}>Loading Apex content…</div>
      )}
    </div>
  );
}

export default ApexPage;
