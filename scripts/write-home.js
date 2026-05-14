const fs = require('fs');
const path = require('path');

const content = `import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';

async function getLatestNews() {
  try {
    return await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch { return []; }
}

async function getPhotoCount() {
  try { return await prisma.photo.count(); }
  catch { return 0; }
}

const RESEARCH_AREAS = [
  { label: 'Machine Learning',  icon: '◈', desc: 'Neural networks, model optimization, and learning theory',      grad: 'from-indigo-500 to-violet-600' },
  { label: 'Computer Vision',   icon: '◉', desc: 'Image recognition, object detection, and visual understanding',  grad: 'from-teal-400 to-cyan-600' },
  { label: 'Deep Learning',     icon: '◫', desc: 'CNNs, transformers, and representation learning',                grad: 'from-violet-500 to-indigo-600' },
  { label: 'NLP',               icon: '◐', desc: 'Language models, text understanding, semantic analysis',          grad: 'from-emerald-400 to-teal-600' },
  { label: 'Egocentric Vision', icon: '▦', desc: 'First-person activity recognition and wearable AI',              grad: 'from-amber-400 to-orange-600' },
  { label: 'Human-Centered AI', icon: '◭', desc: 'AI systems designed for human interaction and trust',            grad: 'from-rose-400 to-pink-600' },
];

const SKILLS = [
  { label: 'Python',       color: 'border-blue-500/30 text-blue-300' },
  { label: 'PyTorch',      color: 'border-orange-500/30 text-orange-300' },
  { label: 'TensorFlow',   color: 'border-yellow-500/30 text-yellow-300' },
  { label: 'OpenCV',       color: 'border-green-500/30 text-green-300' },
  { label: 'Scikit-learn', color: 'border-purple-500/30 text-purple-300' },
  { label: 'Hugging Face', color: 'border-amber-500/30 text-amber-300' },
  { label: 'CUDA',         color: 'border-teal-500/30 text-teal-300' },
  { label: 'NumPy',        color: 'border-indigo-500/30 text-indigo-300' },
  { label: 'Pandas',       color: 'border-pink-500/30 text-pink-300' },
  { label: 'Git',          color: 'border-red-500/30 text-red-300' },
  { label: 'Next.js',      color: 'border-white/20 text-white/60' },
  { label: 'PostgreSQL',   color: 'border-cyan-500/30 text-cyan-300' },
];

const gradStyle = (from: string, to: string) => ({
  background: \`linear-gradient(90deg, \${from}, \${to})\`,
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
});

export default async function HomePage() {
  const [news, photoCount] = await Promise.all([getLatestNews(), getPhotoCount()]);

  return (
    <>
      <Navigation />
      <main className="bg-[#08080f]">

        {/* ══════════════════════════
            HERO
        ══════════════════════════ */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full bg-indigo-950/60 blur-[140px]" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-teal-950/50 blur-[100px]" />
            <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full bg-violet-950/40 blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-center">

              {/* Left: Text */}
              <div className="order-2 lg:order-1">
                {/* Status pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-8 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open to Graduate Research Opportunities
                </div>

                {/* Name */}
                <div className="mb-8">
                  <p className="text-white/25 text-xs font-medium tracking-[0.35em] uppercase mb-3">Lecturer · Computer Science</p>
                  <h1 className="font-black leading-[0.85] tracking-tighter mb-4">
                    <span className="block text-5xl sm:text-6xl md:text-7xl text-white/90">MD Tamim</span>
                    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl" style={gradStyle('#818cf8', '#34d399')}>Hossain</span>
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-gradient-to-r from-indigo-500 to-transparent" />
                    <span className="text-xs text-white/30 uppercase tracking-widest">Premier University, Chittagong</span>
                  </div>
                </div>

                {/* Frosted glass bio card */}
                <div className="max-w-lg rounded-2xl p-5 mb-7 border border-white/10"
                  style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-white/65 text-sm leading-relaxed mb-3">
                    Passionate researcher and educator focused on{' '}
                    <span className="text-indigo-300 font-medium">Machine Learning</span>,{' '}
                    <span className="text-teal-300 font-medium">Computer Vision</span>, and AI —
                    building intelligent systems that bridge theory and real-world impact.
                  </p>
                  <p className="text-amber-400/70 text-xs italic border-t border-white/8 pt-3">
                    Currently seeking graduate opportunities to expand research in CV and Human-Centered AI.
                  </p>
                </div>

                {/* Social links */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" title="Google Scholar"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" /></svg>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="mailto:tamim.hossain@puc.ac.bd" title="Email"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                  <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
                  <span className="text-[11px] text-white/25 hidden sm:block">tamim.hossain [at] puc.ac.bd</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a href="/cv.pdf" download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CV
                  </a>
                  <Link href="/research"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-sm font-medium transition-all">
                    View Research
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right: Profile Photo */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute -inset-6 rounded-[2.5rem] opacity-40 blur-3xl animate-float"
                    style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.5),rgba(52,211,153,0.25))' }} />
                  <div className="relative w-64 h-[380px] sm:w-72 sm:h-[430px] lg:w-[300px] lg:h-[450px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Image src="/profile2.png" alt="MD Tamim Hossain" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                    {/* Caption on photo — frosted glass */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="rounded-xl px-4 py-3 border border-white/15"
                        style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.35)' }}>
                        <p className="text-white text-sm font-bold">MD Tamim Hossain</p>
                        <p className="text-white/50 text-xs mt-0.5">Lecturer · Premier University</p>
                      </div>
                    </div>
                  </div>
                  {/* Floating badge top-right */}
                  <div className="absolute -top-3 -right-3 animate-float delay-200">
                    <div className="rounded-xl px-3 py-2 border border-white/15 shadow-lg"
                      style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-xs font-bold text-white">🎓 B.Sc. CSE</p>
                      <p className="text-[10px] text-white/50">KUET</p>
                    </div>
                  </div>
                  {/* Floating badge bottom-left */}
                  <div className="absolute -bottom-3 -left-3 animate-float delay-400">
                    <div className="rounded-xl px-3 py-2 border border-white/15 shadow-lg"
                      style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-xs font-bold text-emerald-300">📍 Chittagong</p>
                      <p className="text-[10px] text-white/50">Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/15 pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08080f] to-transparent pointer-events-none" />
        </section>

        {/* ══════════════════════════
            STATS STRIP
        ══════════════════════════ */}
        <section className="relative border-y border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {[
                { num: '4+',   label: 'Courses Taught',  color: 'text-indigo-400' },
                { num: '6',    label: 'Research Areas',   color: 'text-teal-400' },
                { num: '100%', label: 'Dedication',       color: 'text-amber-400' },
                { num: photoCount > 0 ? String(photoCount) : '∞', label: 'Photos Taken', color: 'text-rose-400' },
              ].map(({ num, label, color }, i) => (
                <div key={label} className={\`text-center py-4 \${i > 0 ? 'border-l border-white/[0.06]' : ''}\`}>
                  <div className={\`text-3xl font-black tabular-nums \${color}\`}>{num}</div>
                  <div className="text-[10px] text-white/25 uppercase tracking-[0.15em] mt-1.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            RESEARCH INTERESTS
        ══════════════════════════ */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-950/25 blur-[120px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-indigo-500/70" />
                <span className="text-indigo-400 text-[10px] uppercase tracking-[0.25em] font-semibold">What I work on</span>
              </div>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
                  <span className="text-white">Research </span>
                  <span style={gradStyle('#818cf8', '#34d399')}>Interests</span>
                </h2>
                <Link href="/research" className="flex items-center gap-2 text-sm text-white/30 hover:text-white/70 transition-colors">
                  All Projects
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RESEARCH_AREAS.map((area) => (
                <Link key={area.label} href="/research"
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] p-6 transition-all duration-300 hover:border-white/[0.13] hover:-translate-y-1">
                  <div className={\`absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r \${area.grad} opacity-50 group-hover:opacity-100 group-hover:left-0 group-hover:right-0 transition-all duration-500\`} />
                  <div className="text-2xl font-mono text-white/25 group-hover:text-white/60 transition-colors mb-5">{area.icon}</div>
                  <h3 className="font-bold text-white/70 group-hover:text-white transition-colors text-sm mb-2">{area.label}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">{area.desc}</p>
                  <div className={\`mt-5 h-0.5 rounded-full bg-gradient-to-r \${area.grad} w-6 group-hover:w-14 transition-all duration-500\`} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            TECH STACK
        ══════════════════════════ */}
        <section className="py-12 border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-5 h-px bg-white/15" />
              <span className="text-[10px] text-white/25 uppercase tracking-[0.25em]">Tools &amp; Technologies</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span key={s.label}
                  className={\`px-3 py-1.5 text-xs font-medium rounded-lg border bg-white/[0.02] hover:bg-white/[0.07] cursor-default transition-all hover:-translate-y-0.5 \${s.color}\`}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            NEWS
        ══════════════════════════ */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-teal-950/25 blur-[100px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-teal-500/70" />
                <span className="text-teal-400 text-[10px] uppercase tracking-[0.25em] font-semibold">Latest</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
                <span className="text-white">News &amp; </span>
                <span style={gradStyle('#34d399', '#22d3ee')}>Updates</span>
              </h2>
            </div>
            {news.length > 0 ? (
              <div className="space-y-3 max-w-3xl">
                {news.map((item, i) => (
                  <div key={item.id}
                    className="group flex gap-5 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.11] transition-all">
                    <div className="shrink-0 flex flex-col items-center gap-2 pt-1.5">
                      <span className={\`w-2.5 h-2.5 rounded-full \${i === 0 ? 'bg-teal-400 animate-pulse' : 'bg-white/15'}\`} />
                      {i < news.length - 1 && <div className="w-px flex-1 bg-white/[0.05] min-h-[24px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
                        <h3 className="font-semibold text-white/75 group-hover:text-white transition-colors text-sm">{item.title}</h3>
                        {item.featured && (
                          <span className="shrink-0 px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-medium">Featured</span>
                        )}
                      </div>
                      <p className="text-xs text-white/35 leading-relaxed line-clamp-2">{item.content}</p>
                      <p className="text-[10px] text-white/20 mt-2 uppercase tracking-wider">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-5 p-6 rounded-2xl border border-white/[0.07] max-w-xl"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-3xl">📢</span>
                <p className="text-white/25 text-sm">No updates yet — check back soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════
            ABOUT + QUICK LINKS
        ══════════════════════════ */}
        <section className="py-28 border-t border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-[400px] h-[400px] rounded-full bg-violet-950/25 blur-[80px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-violet-500/70" />
                  <span className="text-violet-400 text-[10px] uppercase tracking-[0.25em] font-semibold">Background</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-7">
                  <span className="text-white">About </span>
                  <span style={gradStyle('#a78bfa', '#f472b6')}>Me</span>
                </h2>
                <p className="text-white/45 leading-relaxed text-sm mb-7">
                  I am a Lecturer at the Department of Computer Science and Engineering, Premier University, Chittagong.
                  My research focuses on Machine Learning, Natural Language Processing, and Computer Vision —
                  developing intelligent systems that understand human language and visual information.
                </p>
                <div className="space-y-0 mb-8">
                  {[
                    { k: 'Education', v: 'B.Sc. in CSE, KUET',              c: 'text-indigo-400' },
                    { k: 'Interests', v: 'ML · CV · Image/Video Processing', c: 'text-teal-400' },
                    { k: 'Location',  v: 'Chittagong, Bangladesh',            c: 'text-rose-400' },
                    { k: 'Languages', v: 'Bengali · English',                 c: 'text-amber-400' },
                  ].map(({ k, v, c }) => (
                    <div key={k} className="flex gap-5 py-3 border-b border-white/[0.05]">
                      <span className="text-white/20 text-[10px] uppercase tracking-wider w-20 shrink-0 pt-0.5">{k}</span>
                      <span className={\`text-xs font-medium \${c}\`}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all">
                    Get in Touch
                  </Link>
                  <Link href="/teaching"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.08] rounded-xl text-sm font-medium transition-all">
                    Courses
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: '/research',     icon: '◈', label: 'Research',     sub: 'Projects & Papers',     grad: 'from-indigo-500 to-violet-600' },
                  { href: '/publications', icon: '◫', label: 'Publications', sub: 'Journal & Conference',   grad: 'from-teal-400 to-cyan-600' },
                  { href: '/teaching',     icon: '◉', label: 'Teaching',     sub: 'Courses & Materials',    grad: 'from-emerald-400 to-teal-600' },
                  { href: '/photography',  icon: '▦', label: 'Photography',  sub: photoCount > 0 ? String(photoCount) + ' photos' : 'View Gallery', grad: 'from-rose-400 to-pink-600' },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.14] hover:-translate-y-1">
                    <div className={\`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r \${item.grad} opacity-40 group-hover:opacity-90 transition-opacity\`} />
                    <span className="text-2xl mb-4 block font-mono text-white/25 group-hover:text-white/60 transition-colors">{item.icon}</span>
                    <p className="font-bold text-white/65 group-hover:text-white text-sm transition-colors">{item.label}</p>
                    <p className="text-[11px] text-white/25 mt-1">{item.sub}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src/app/page.tsx'), content);
console.log('Home page written!');
