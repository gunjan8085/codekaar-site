// CodeKaar — single-page agency site app
// React + Babel; mounts into #app.

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hueShift": 0,
  "motion": 1,
  "emblemSpeed": 1,
  "grain": 0.55,
  "headline": "We build software that turns ideas into businesses.",
  "headlineAccent": "businesses.",
  "introPace": "cinematic",
  "showParticles": true
} /*EDITMODE-END*/;


function Emblem({ t }) {
  return (
    <div className="emblem-wrap" aria-hidden="true">
      <img src="assets/logo2.png" alt="CodeKaar Logo" className="floating-logo" />
    </div>
  );
}


// ---------------- Hero ----------------
function Hero({ t, skipTyping, introActive }) {
  const [phase, setPhase] = useState(skipTyping ? 2 : 0); // 0 typing, 1 logo+sub, 2 cta
  const [typed, setTyped] = useState(skipTyping ? t.headline || TWEAK_DEFAULTS.headline : '');
  const fullText = t.headline || TWEAK_DEFAULTS.headline;
  const accent = t.headlineAccent || '';

  // Pacing
  const paceMs = t.introPace === 'fast' ? 28 : t.introPace === 'slow' ? 70 : 45;
  const afterTypeDelay = t.introPace === 'fast' ? 250 : t.introPace === 'slow' ? 700 : 450;

  useEffect(() => {
    // Don't run typing while overlay is active. After overlay finishes, we
    // jump straight to phase 2 (fully shown) — no re-typing the same text.
    if (introActive) return;
    if (skipTyping) {
      setTyped(fullText);
      setPhase(2);
      return;
    }
    let i = 0;
    setTyped('');
    const id = setInterval(() => {
      i += 1;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(id);
        setTimeout(() => setPhase(1), afterTypeDelay);
        setTimeout(() => setPhase(2), afterTypeDelay + 600);
      }
    }, paceMs);
    return () => clearInterval(id);
  }, [fullText, paceMs, afterTypeDelay, introActive, skipTyping]);

  // particle dots
  const particles = useMemo(() => {
    if (!t.showParticles) return [];
    return Array.from({ length: 18 }).map((_, i) => ({
      left: Math.random() * 100,
      bottom: Math.random() * 30,
      delay: Math.random() * 4,
      dur: 6 + Math.random() * 6,
      hue: ['#22D3EE', '#A855F7', '#FB923C'][i % 3],
      size: 2 + Math.random() * 2
    }));
  }, [t.showParticles]);

  // Render typed with optional accent split
  const renderTyped = () => {
    const accentStart = fullText.lastIndexOf(accent);
    if (accentStart < 0 || !accent) {
      return <span>{typed}</span>;
    }
    if (typed.length <= accentStart) {
      return <span>{typed}</span>;
    }
    const head = typed.slice(0, accentStart);
    const tail = typed.slice(accentStart);
    return <><span>{head}</span><span className="accent">{tail}</span></>;
  };

  return (
    <section className="hero" id="top">
      <div className="scrim" />
      <div className="hero-medallion" aria-hidden="true" />
      {t.showParticles &&
      <div className="particles">
          {particles.map((p, i) =>
        <span key={i} style={{
          left: p.left + '%', bottom: p.bottom + '%',
          animationDelay: p.delay + 's',
          animationDuration: p.dur / (t.motion || 1) + 's',
          color: p.hue, width: p.size, height: p.size
        }} />
        )}
        </div>
      }

      <Emblem t={t} />

      <div className="stage">
        <div className="pretitle eyebrow"><span className="ck-glyph" />CodeKaar — Custom Software Studio</div>

        <h1 className="h1-line">
          <span className="typed">
            {renderTyped()}
            {phase < 1 && <span className="caret" />}
          </span>
        </h1>

        <p className="sub" style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)'
        }}>
          MVPs in weeks. Production systems built to scale. POS, booking engines, SaaS dashboards, internal tools — engineered, not assembled.
        </p>

        <div className="logo-wrap" style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity .9s .15s cubic-bezier(.2,.7,.2,1), transform .9s .15s cubic-bezier(.2,.7,.2,1)'
        }}>
          <span className="wm">C O D E</span>
          <span className="dot" />
          <span className="wm">K A A R</span>
          <span className="dot b" />
        </div>

        <div className="cta-row" style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)'
        }}>
          <a className="btn-glass" href="#contact">
            Start your build
            <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn-ghost" href="#work">
            See the work
          </a>
        </div>
      </div>

      <div className="scroll-ind">
        <span>Scroll</span>
        <span className="line" />
      </div>
    </section>);

}

// ---------------- Services ----------------
const SERVICES = [
{
  title: 'Custom POS Systems',
  body: 'Front-of-house, back-office, and hardware-aware. Real-time order flow, dual-sided displays, offline resilience.',
  tags: ['React', 'WebSockets', 'Stripe Terminal'],
  icon:
  <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" /></svg>

},
{
  title: 'Booking Engines',
  body: 'Inventory, availability, and rate logic that doesn\'t fall over on a Saturday night. Integrations included.',
  tags: ['Postgres', 'Redis', 'Cron pipelines'],
  icon:
  <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4M16 3v4" /></svg>

},
{
  title: 'MVPs in 2–6 weeks',
  body: 'Idea → shippable product. We compress the boring decisions so you can ship the differentiating ones.',
  tags: ['Next.js', 'Auth', 'Payments'],
  icon:
  <svg viewBox="0 0 24 24"><path d="M5 19c4-4 10-4 14 0" /><path d="M12 14V4" /><path d="M8 8l4-4 4 4" /></svg>

},
{
  title: 'SaaS Dashboards',
  body: 'Charts that load. Tables that scale. Permissions that hold. Admin consoles built for actual operators.',
  tags: ['Charts', 'RBAC', 'Realtime'],
  icon:
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="M10 21V10" /></svg>

},
{
  title: 'Internal Tools',
  body: 'Replace the spreadsheet, the Zapier soup, the 3 a.m. SQL. Tight workflows for your team\'s actual job.',
  tags: ['Workflows', 'Audit logs', 'SSO'],
  icon:
  <svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="3" /></svg>

},
{
  title: 'API & Integrations',
  body: 'Payments, payroll, PMS, ERP. We wire the messy middle and ship SDKs your team can actually maintain.',
  tags: ['SDKs', 'Webhooks', 'Orchestration'],
  icon:
  <svg viewBox="0 0 24 24"><path d="M10 14l-4 4-3-3 4-4" /><path d="M14 10l4-4 3 3-4 4" /><path d="M9 15l6-6" /></svg>

}];


function Services() {
  const wrapRef = useRef(null);
  const onTilt = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
  };
  const onLeave = (e) => {e.currentTarget.style.transform = '';};

  return (
    <section className="sec" id="services">
      <div className="section-watermark tl" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-hd reveal">
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}><span className="ck-glyph" />What we build</div>
            <h2>Production systems,<br />not prototypes that linger.</h2>
          </div>
          <p className="lead">Six things we ship, repeatedly. Each one a system, not a screen — built with the same backbone of TypeScript, Postgres, and battle-tested infra.</p>
        </div>
        <div className="grid-services" ref={wrapRef}>
          {SERVICES.map((s, i) =>
          <div className="scard reveal" key={s.title}
          style={{ transitionDelay: i * 60 + 'ms' }}
          onMouseMove={onTilt} onMouseLeave={onLeave}>
              <div className="ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tag">
                {s.tags.map((tg) => <span key={tg}>{tg}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ---------------- Process ----------------
const STEPS = [
{ n: '01', title: 'Discover', body: 'We map the actual problem, the actual users, and the systems that already exist. No discovery theatre.', timing: 'Week 1' },
{ n: '02', title: 'Architect', body: 'Data model, integrations, infra plan. The decisions that look boring but compound for years.', timing: 'Week 1–2' },
{ n: '03', title: 'Build', body: 'Daily demos, weekly milestones. You watch it come together — not a black-box reveal at the end.', timing: 'Week 2–5' },
{ n: '04', title: 'Launch', body: 'Production rollout, monitoring, handoff docs, and a support window. Then we keep shipping if you want.', timing: 'Week 5–6' }];

function Process() {
  return (
    <section className="sec" id="process">
      <div className="section-watermark br" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-hd reveal">
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}><span className="ck-glyph" />How we work</div>
            <h2>Four phases. No mystery,<br />no agency choreography.</h2>
          </div>
          <p className="lead">A linear, opinionated process. You always know what we're doing this week and what's shipping next.</p>
        </div>
        <div className="tline">
          {STEPS.map((s, i) =>
          <div className="tstep reveal" key={s.n} style={{ transitionDelay: i * 80 + 'ms' }}>
              <div className="num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              <span className="timing">{s.timing}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ---------------- Why (stats) ----------------
function Why() {
  return (
    <section className="sec" id="why">
      <div className="section-watermark tl" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-hd reveal">
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}><span className="ck-glyph" />Why CodeKaar</div>
            <h2>A small senior team,<br />shipping like a product org.</h2>
          </div>
          <p className="lead">We don't subcontract, we don't pad, and we don't disappear after launch. You get the people who built it.</p>
        </div>
        <div className="stats">
          <div className="stat reveal">
            <div className="meta">Velocity</div>
            <div className="big">2–6<span style={{ fontSize: '.45em', letterSpacing: 0 }}> wks</span></div>
            <p className="lbl">From kickoff to a working MVP in production — not a Figma file in a Notion doc.</p>
          </div>
          <div className="stat reveal" style={{ transitionDelay: '80ms' }}>
            <div className="meta">Ownership</div>
            <div className="big">100%</div>
            <p className="lbl">Custom code, your repo, your infra. No vendor lock-in, no white-labeled platforms.</p>
          </div>
          <div className="stat reveal" style={{ transitionDelay: '160ms' }}>
            <div className="meta">Architecture</div>
            <div className="big">Built<br /><span style={{ fontSize: '.55em', letterSpacing: '-0.02em' }}>to scale</span></div>
            <p className="lbl">Boring tech, opinionated patterns. Designed for the day you 10× and the day you pivot.</p>
          </div>
        </div>
      </div>
    </section>);

}

// ---------------- Featured work ----------------
const WORK = [
{
  name: 'Lodgezify',
  tags: 'Booking · POS · Hospitality',
  line: 'A unified booking platform + POS for hotels — front desk, dine-in, check-in/out, all in one system.',
  cls: 'thumb-lodge',
  art: 'lodge'
},
{
  name: 'Zifypay Marketplace',
  tags: 'Discovery · Bookings · SaaS',
  line: 'Discovery engine for spas, salons, and local services with a built-in appointment & team console.',
  cls: 'thumb-zifypay',
  art: 'zify'
},
{
  name: 'Zifypay POS',
  tags: 'C-Store · Fuel · Realtime',
  line: 'Dual-sided POS for convenience stores and gas stations, powered by WebSockets and simpler billing.',
  cls: 'thumb-zifypos',
  art: 'pos'
},
{
  name: 'Fusetrix',
  tags: 'Payments · SDK · Orchestration',
  line: 'A payment orchestration engine — automate PSPs into your stack with a drop-in SDK, no rebuild.',
  cls: 'thumb-fuse',
  art: 'fuse'
}];


function ThumbArt({ kind }) {
  // 4 lightweight, on-brand SVG/CSS scenes — no stock photos.
  if (kind === 'lodge') {
    return (
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="lg1" x1="0" x2="1"><stop offset="0" stopColor="#22D3EE" /><stop offset="1" stopColor="#A855F7" /></linearGradient>
        </defs>
        {/* room cards */}
        <g opacity="0.95">
          <rect x="40" y="60" width="140" height="80" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
          <rect x="50" y="72" width="60" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
          <rect x="50" y="86" width="100" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
          <rect x="50" y="96" width="80" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
          <rect x="50" y="118" width="40" height="14" rx="7" fill="url(#lg1)" />

          <rect x="200" y="40" width="160" height="100" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" />
          <rect x="212" y="54" width="80" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
          <rect x="212" y="68" width="120" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
          <rect x="212" y="78" width="100" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
          <rect x="212" y="100" width="60" height="22" rx="11" fill="url(#lg1)" opacity=".9" />

          <rect x="80" y="170" width="240" height="70" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
          <circle cx="110" cy="205" r="14" fill="url(#lg1)" />
          <rect x="138" y="192" width="120" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
          <rect x="138" y="208" width="80" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
          <rect x="280" y="196" width="32" height="14" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
        </g>
      </svg>);

  }
  if (kind === 'zify') {
    return (
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="zg1" x1="0" x2="1"><stop offset="0" stopColor="#A855F7" /><stop offset="1" stopColor="#FB923C" /></linearGradient>
        </defs>
        {/* search + cards mosaic */}
        <rect x="60" y="40" width="280" height="36" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" />
        <circle cx="80" cy="58" r="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        <line x1="84" y1="62" x2="92" y2="70" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        <rect x="100" y="54" width="120" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        {/* tiles */}
        <g>
          <rect x="60" y="100" width="80" height="100" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
          <rect x="68" y="108" width="64" height="50" rx="6" fill="url(#zg1)" opacity=".5" />
          <rect x="68" y="166" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
          <rect x="68" y="178" width="36" height="4" rx="2" fill="rgba(255,255,255,0.25)" />

          <rect x="160" y="100" width="80" height="100" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" />
          <rect x="168" y="108" width="64" height="50" rx="6" fill="url(#zg1)" />
          <rect x="168" y="166" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.6)" />
          <rect x="168" y="178" width="40" height="4" rx="2" fill="rgba(255,255,255,0.3)" />

          <rect x="260" y="100" width="80" height="100" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
          <rect x="268" y="108" width="64" height="50" rx="6" fill="url(#zg1)" opacity=".5" />
          <rect x="268" y="166" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
          <rect x="268" y="178" width="36" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
        </g>
        <rect x="60" y="220" width="280" height="28" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      </svg>);

  }
  if (kind === 'pos') {
    return (
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="pg1" x1="0" x2="1"><stop offset="0" stopColor="#22D3EE" /><stop offset="1" stopColor="#A855F7" /></linearGradient>
        </defs>
        {/* dual screen pos */}
        <rect x="30" y="60" width="170" height="160" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" />
        <rect x="42" y="74" width="146" height="20" rx="5" fill="rgba(255,255,255,0.08)" />
        <rect x="42" y="100" width="146" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
        <rect x="42" y="118" width="146" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
        <rect x="42" y="136" width="146" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
        <rect x="42" y="170" width="80" height="22" rx="11" fill="url(#pg1)" />
        <rect x="130" y="170" width="58" height="22" rx="11" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />

        <rect x="220" y="60" width="150" height="160" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" />
        <text x="295" y="120" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="22" fill="#22D3EE">$ 42.18</text>
        <rect x="232" y="138" width="126" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
        <rect x="232" y="152" width="100" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
        <rect x="232" y="178" width="126" height="22" rx="11" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
        {/* websocket pulse */}
        <line x1="200" y1="140" x2="220" y2="140" stroke="url(#pg1)" strokeWidth="2" strokeDasharray="3 3" />
      </svg>);

  }
  if (kind === 'fuse') {
    return (
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="fg1" x1="0" x2="1"><stop offset="0" stopColor="#A855F7" /><stop offset="1" stopColor="#FB923C" /></linearGradient>
        </defs>
        {/* central node */}
        <circle cx="200" cy="140" r="34" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        <text x="200" y="146" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="13" fill="#fff">{'</>'}</text>
        {/* psp nodes */}
        {[
        [70, 70], [330, 70], [60, 210], [340, 210], [200, 40], [200, 240]].
        map(([x, y], i) =>
        <g key={i}>
            <line x1="200" y1="140" x2={x} y2={y} stroke="url(#fg1)" strokeWidth="1.2" strokeDasharray="2 4" opacity=".7" />
            <circle cx={x} cy={y} r="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />
          </g>
        )}
        <text x="70" y="74" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#bbb">PSP</text>
        <text x="330" y="74" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#bbb">ACH</text>
        <text x="60" y="214" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#bbb">3DS</text>
        <text x="340" y="214" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#bbb">FX</text>
        <text x="200" y="44" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#bbb">SDK</text>
        <text x="200" y="244" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#bbb">API</text>
      </svg>);

  }
  return null;
}

function Work() {
  return (
    <section className="sec" id="work">
      <div className="section-watermark br" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-hd reveal">
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}><span className="ck-glyph" />Featured work</div>
            <h2>Systems running in production,<br />moving real money.</h2>
          </div>
          <p className="lead">A glimpse of what we ship. Each one a different shape — hospitality, marketplaces, fuel retail, payment infra.</p>
        </div>
        <div className="mosaic">
          {WORK.map((w, i) =>
          <div className="cs reveal" key={w.name} style={{ transitionDelay: i * 70 + 'ms' }}>
              <div className={'thumb ' + w.cls}>
                <ThumbArt kind={w.art} />
              </div>
              <div className="meta">
                <div>
                  <div className="tags">{w.tags}</div>
                  <h4>{w.name}</h4>
                  <p>{w.line}</p>
                </div>
                <div className="arrow" aria-hidden="true">↗</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ---------------- Testimonial ----------------
function Testimonial() {
  return (
    <section className="sec" id="testimonial">
      <div className="wrap">
        <div className="quote-block reveal">
          <div className="mark">&ldquo;</div>
          <blockquote>
            We came to CodeKaar with a sketch and a deadline. Six weeks later we had a <em style={{ color: "rgb(255, 255, 255)" }}>real product</em> — not a demo, not a Figma file — running in production with our first paying customers on it.
          </blockquote>
          <div className="who">
            <div className="name">Arjun Mehta</div>
            <div className="role">Co-founder & CTO · Lodgezify</div>
          </div>
        </div>

        <div className="logo-strip reveal">
          <span className="l"><span className="dot"></span>Lodgezify</span>
          <span className="l"><span className="sq"></span>Zifypay</span>
          <span className="l"><span className="tri"></span>Fusetrix</span>
          <span className="l"><span className="dot"></span>Northwind Co.</span>
          <span className="l"><span className="sq"></span>Halcyon Labs</span>
          <span className="l"><span className="tri"></span>Meridian</span>
        </div>
      </div>
    </section>);

}

// ---------------- CTA ----------------
function CTA() {
  return (
    <section className="sec" id="contact">
      <div className="cta-orbit" aria-hidden="true" />
      <div className="wrap">
        <div className="ctablock reveal">
          <div className="eyebrow" style={{ marginBottom: 22 }}><span className="ck-glyph" />Let's build</div>
          <h2>Book a strategy call.</h2>
          <p>30 minutes. We'll map your build, sketch the architecture, and tell you what's hard, what's easy, and what's actually worth building first.</p>
          <a className="btn-grad" href="#" style={{ color: "rgb(255, 255, 255)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "rgb(229, 229, 229)" }}>
              <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4M16 3v4" />
            </svg>
            Book a strategy call
            <span className="arrow">→</span>
          </a>
          <div className="mono" style={{ marginTop: 22, color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.12em' }}>
            OR EMAIL · hello@codekaar.com
          </div>
        </div>
      </div>
    </section>);

}

// ---------------- Footer ----------------
function Footer() {
  return (
    <footer>
      <div className="footer-watermark" aria-hidden="true">
        <img src="assets/codekaar-logo.png" alt="" />
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row">
          <div className="col brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, letterSpacing: '.18em', fontSize: 13, textTransform: 'uppercase' }}>
              <img src="assets/codekaar-logo.png" alt="" style={{ width: 28, height: 28, display: 'block', filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.45))' }} />
              CodeKaar
            </div>
            <p>Custom software studio. MVPs and production systems for high-ticket clients. Your growth, our code.</p>
          </div>
          <div className="col">
            <h5>Studio</h5>
            <a href="#services">What we build</a>
            <a href="#process">How we work</a>
            <a href="#work">Featured work</a>
            <a href="#why">Why CodeKaar</a>
          </div>
          <div className="col">
            <h5>Contact</h5>
            <a href="#">hello@codekaar.com</a>
            <a href="#">Book a call</a>
            <a href="#">Careers</a>
          </div>
          <div className="col">
            <h5>Social</h5>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
            <a href="#">X / Twitter</a>
          </div>
        </div>
        <div className="fine">
          <span>© 2026 CodeKaar Studio</span>
          <span>YOUR GROWTH · OUR CODE</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>);

}

// ---------------- Tweaks ----------------
function CodeKaarTweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Palette" />
      <TweakSlider label="Hue shift" value={t.hueShift} min={-180} max={180} step={5} unit="°"
      onChange={(v) => setTweak('hueShift', v)} />
      <TweakSlider label="Grain" value={t.grain} min={0} max={1} step={0.05}
      onChange={(v) => setTweak('grain', v)} />

      <TweakSection label="Motion" />
      <TweakSlider label="Motion intensity" value={t.motion} min={0.3} max={2} step={0.1} unit="×"
      onChange={(v) => setTweak('motion', v)} />
      <TweakSlider label="Emblem speed" value={t.emblemSpeed} min={0.3} max={3} step={0.1} unit="×"
      onChange={(v) => setTweak('emblemSpeed', v)} />
      <TweakRadio label="Intro pace" value={t.introPace}
      options={['fast', 'cinematic', 'slow']}
      onChange={(v) => setTweak('introPace', v)} />
      <TweakToggle label="Hero particles" value={t.showParticles}
      onChange={(v) => setTweak('showParticles', v)} />

      <TweakSection label="Copy" />
      <TweakText label="Headline" value={t.headline}
      onChange={(v) => setTweak('headline', v)} />
      <TweakText label="Accent word" value={t.headlineAccent}
      onChange={(v) => setTweak('headlineAccent', v)} />
    </TweaksPanel>);

}

// ---------------- Intro Overlay ----------------
// Full-screen black takeover that shows on first load. The headline fades in
// word-by-word, holds, then the whole overlay zooms out + fades, revealing
// the real hero underneath. After it finishes, the rest of the page resumes
// its normal flow (Hero skips its typing intro and shows fully).
function IntroOverlay({ headline, accent, onDone }) {
  const words = headline.split(' ');
  const accentWordIdx = accent ? words.findIndex((w, i) => words.slice(i).join(' ').startsWith(accent)) : -1;

  // Phases: 0=before words, 1=words coming in, 2=hold, 3=zoom-out, 4=done
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250); // start words
    const wordsDur = 250 + words.length * 140; // each word ~140ms
    const t2 = setTimeout(() => setPhase(2), wordsDur + 250); // hold
    const t3 = setTimeout(() => setPhase(3), wordsDur + 1900); // zoom out
    const t4 = setTimeout(() => {setPhase(4);onDone && onDone();}, wordsDur + 3000); // done

    // Click / Escape to skip — start the zoom-out immediately
    const skip = () => {setPhase(3);setTimeout(() => {setPhase(4);onDone && onDone();}, 1050);};
    const onKey = (e) => {if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') skip();};
    window.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', onKey);
    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  if (phase === 4) return null;

  return (
    <div
      className={'intro-overlay ' + (phase >= 3 ? 'is-zooming' : '')}
      aria-hidden={phase >= 3}>
      
      <div className="intro-inner">
        <h1 className="intro-headline">
          {words.map((w, i) => {
            const isAccent = accentWordIdx >= 0 && i >= accentWordIdx;
            return (
              <React.Fragment key={i}>
                <span
                  className={'intro-word ' + (isAccent ? 'accent' : '') + (phase >= 1 ? ' is-in' : '')}
                  style={{ transitionDelay: phase >= 1 ? i * 0.11 + 's' : '0s', color: "rgb(255, 255, 255)" }}>
                  
                  {w}
                </span>
                {i < words.length - 1 ? <span className="intro-space">{'\u00A0'}</span> : null}
              </React.Fragment>);

          })}
        </h1>
      </div>
    </div>);

}

// ---------------- App ----------------
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // Show intro on every page load (refresh). Persist nothing — keeps it cinematic.
  const [introActive, setIntroActive] = useState(true);

  // Apply CSS vars from tweaks
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--hue-shift', (t.hueShift || 0) + 'deg');
    r.style.setProperty('--grain', t.grain);
    r.style.setProperty('--motion', t.motion);
  }, [t.hueShift, t.grain, t.motion]);

  // Hook reveal observer once
  useEffect(() => {
    const id = setTimeout(() => window.__codekaarHook && window.__codekaarHook(), 60);
    return () => clearTimeout(id);
  }, []);

  // Lock body scroll while intro is on screen.
  useEffect(() => {
    if (introActive) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {document.body.style.overflow = prev;};
    }
  }, [introActive]);

  return (
    <>
      {introActive &&
      <IntroOverlay
        headline={t.headline || TWEAK_DEFAULTS.headline}
        accent={t.headlineAccent || ''}
        onDone={() => setIntroActive(false)} />

      }
      <Hero t={t} skipTyping={true} introActive={introActive} />
      <Services />
      <Process />
      <Why />
      <Work />
      <Testimonial />
      <CTA />
      <Footer />
      <CodeKaarTweaks t={t} setTweak={setTweak} />
    </>);

}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);