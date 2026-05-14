const fs = require('fs');

// ── Teaching Page ──────────────────────────────────────────
fs.writeFileSync('src/app/teaching/page.tsx', `import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';

async function getCourses() {
  try {
    return await prisma.teaching.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
    });
  } catch { return []; }
}

export default async function TeachingPage() {
  const courses = await getCourses();
  const grouped = courses.reduce((acc: Record<string, typeof courses>, c) => {
    if (!acc[c.semester]) acc[c.semester] = [];
    acc[c.semester].push(c);
    return acc;
  }, {});
  const semesters = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-teal-800 py-14">
          <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-xs text-white leading-7 overflow-hidden select-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap px-6">
                for student in class: grade = evaluate(submission) lecture_notes.append(topic) def teach(subject): return knowledge
              </div>
            ))}
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Teaching</h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Courses I teach at Premier University, Chittagong. I believe in fostering critical thinking,
              hands-on problem solving, and a deep love for computer science.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {courses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">📚</p>
                <p className="text-gray-400">No courses listed yet.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {semesters.map((semester) => (
                  <div key={semester}>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">{semester}</h2>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        {grouped[semester].length} course{grouped[semester].length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped[semester].map((course) => (
                        <div key={course.id} className="card-hover group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          <div className="h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold tracking-wide">{course.code}</span>
                              {course.creditHours && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{course.creditHours} cr</span>
                              )}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 leading-tight">{course.name}</h3>
                            {course.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>}
                            {course.featured && (
                              <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs border border-amber-200">⭐ Featured</span>
                            )}
                            {course.syllabus && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <a href={course.syllabus} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                  Syllabus
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-gradient-to-br from-indigo-50 to-teal-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-3">For Students</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                If you need help with course materials, assignments, or want to discuss research topics,
                feel free to reach out during office hours or via email. I encourage curiosity and collaborative learning.
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Contact Me
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
`);
console.log('Teaching done');

// ── Footer ──────────────────────────────────────────────────
fs.writeFileSync('src/components/public/Footer.tsx', `import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-1 text-lg gradient-text">MD Tamim Hossain</h3>
            <p className="text-sm text-gray-400 mb-4">Lecturer · CSE · Premier University, Chittagong</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Passionate about Machine Learning, Computer Vision, and building AI systems that matter.
              Currently seeking graduate research opportunities.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'About' },
                { href: '/research', label: 'Research' },
                { href: '/publications', label: 'Publications' },
                { href: '/teaching', label: 'Teaching' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Google Scholar</a></li>
              <li><a href="https://researchgate.net" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">ResearchGate</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="mailto:tamim.hossain@puc.ac.bd" className="text-sm text-gray-400 hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} MD Tamim Hossain. All rights reserved.</p>
          <p className="text-xs text-gray-600 font-mono">{'<'} built with passion {'>'}</p>
        </div>
      </div>
    </footer>
  );
}
`);
console.log('Footer done');

// ── Research Page ───────────────────────────────────────────
fs.writeFileSync('src/app/research/page.tsx', `import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { startDate: 'desc' }]
  });
}

const interests = [
  { label: 'Machine Learning', icon: '🤖', desc: 'Developing algorithms that learn from data to make intelligent predictions and decisions.' },
  { label: 'Computer Vision', icon: '👁️', desc: 'Teaching machines to interpret and understand visual information from images and video.' },
  { label: 'Deep Learning', icon: '🧠', desc: 'Building neural network architectures for complex pattern recognition tasks.' },
  { label: 'NLP', icon: '💬', desc: 'Enabling computers to understand, interpret, and generate human language.' },
  { label: 'Egocentric Vision', icon: '🎥', desc: 'Understanding the world from a first-person perspective using wearable cameras.' },
  { label: 'Large Scale Video', icon: '📹', desc: 'Processing and understanding temporal patterns in large-scale video datasets.' },
];

export default async function ResearchPage() {
  const projects = await getProjects();
  const ongoing = projects.filter(p => p.status === 'ONGOING');
  const completed = projects.filter(p => p.status === 'COMPLETED');

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-teal-800 py-14">
          <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-xs text-white leading-7 overflow-hidden select-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap px-6">
                model = ResNet50() loss_fn = CrossEntropyLoss() optimizer = Adam(lr=1e-4) for epoch in range(100): outputs = model(inputs) loss = loss_fn(outputs, labels)
              </div>
            ))}
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Research</h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              My research focuses on developing intelligent systems at the intersection of Machine Learning,
              Computer Vision, and Human-Centered AI.
            </p>
          </div>
        </section>

        {/* Research Interests */}
        <section className="py-14 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Research Interests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interests.map((item) => (
                <div key={item.label} className="card-hover bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-1.5">{item.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ongoing */}
        {ongoing.length > 0 && (
          <section className="py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Ongoing Projects</h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot"></span>
              </div>
              <div className="space-y-6">
                {ongoing.map((p) => (
                  <div key={p.id} className="card-hover bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      {p.imageUrl && (
                        <div className="md:col-span-1 relative h-48 md:h-full">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={\`p-6 \${p.imageUrl ? 'md:col-span-3' : 'md:col-span-4'}\`}>
                        <div className="flex items-start gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900 flex-1">{p.title}</h3>
                          <span className="shrink-0 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">Ongoing</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{p.description}</p>
                        {p.tags && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {p.tags.split(',').map((tag, i) => (
                              <span key={i} className="px-2.5 py-1 bg-primary/8 text-primary rounded-lg text-xs font-medium">{tag.trim()}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4">
                          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>GitHub</a>}
                          {p.paperUrl && <a href={p.paperUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">📄 Paper</a>}
                          {p.datasetUrl && <a href={p.datasetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-secondary font-medium hover:underline">🗄️ Dataset</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section className="py-14 bg-gray-50 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Completed Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {completed.map((p) => (
                  <div key={p.id} className="card-hover bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-base font-bold text-gray-900 flex-1">{p.title}</h3>
                      <span className="shrink-0 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">Done</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.description}</p>
                    {p.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.split(',').map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {projects.length === 0 && (
          <section className="py-20 text-center">
            <p className="text-5xl mb-4">🔬</p>
            <p className="text-gray-400">Research projects coming soon.</p>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
`);
console.log('Research done');

// ── Publications Page ───────────────────────────────────────
const pubUtils = fs.existsSync('src/utils/citationFormatter.ts') ? "import { formatAPACitation, getPublicationBadgeColor, getPublicationBadgeText } from '@/utils/citationFormatter';" : '';

fs.writeFileSync('src/app/publications/page.tsx', `import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
${pubUtils}

async function getPublications() {
  return await prisma.publication.findMany({
    orderBy: [{ year: 'desc' }, { createdAt: 'desc' }]
  });
}

${pubUtils ? '' : `function badgeColor(type: string, badge: string | null) {
  if (type === 'JOURNAL' && badge) {
    if (badge === 'Q1') return 'bg-green-100 text-green-800 border-green-200';
    if (badge === 'Q2') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (badge === 'Q3') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  }
  if (type === 'CONFERENCE') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  if (type === 'PREPRINT') return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-pink-100 text-pink-800 border-pink-200';
}
function badgeLabel(type: string, badge: string | null) {
  return type === 'JOURNAL' && badge ? badge : type;
}`}

export default async function PublicationsPage() {
  const publications = await getPublications();

  const grouped = publications.reduce((acc: Record<number, typeof publications>, pub) => {
    if (!acc[pub.year]) acc[pub.year] = [];
    acc[pub.year].push(pub);
    return acc;
  }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-indigo-900 py-14">
          <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-xs text-white leading-7 overflow-hidden select-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap px-6">
                @article @inproceedings abstract: conclusion: results: dataset: accuracy: 98.5% loss: 0.034 epoch: 100/100
              </div>
            ))}
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Publications</h1>
            <p className="text-teal-200 text-sm max-w-xl mb-6">Complete list of my publications organized by year, in APA citation format.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-medium hover:bg-white/20 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" /></svg>
                Google Scholar
              </a>
              <a href="https://researchgate.net" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-medium hover:bg-white/20 transition-all">
                ResearchGate
              </a>
            </div>
          </div>
        </section>

        {/* List */}
        {years.length > 0 ? (
          <section className="py-14">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {years.map((year) => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">{year}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
                  </div>
                  <div className="space-y-5">
                    {grouped[year].map((pub, idx) => {
                      ${pubUtils ? 'const citation = formatAPACitation(pub); const bc = getPublicationBadgeColor(pub.type, pub.badge); const bl = getPublicationBadgeText(pub.type, pub.badge);' : 'const bc = badgeColor(pub.type, pub.badge); const bl = badgeLabel(pub.type, pub.badge);'}
                      return (
                        <div key={pub.id} className="card-hover group bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                          <div className="flex gap-4">
                            <span className="text-gray-300 font-mono text-sm shrink-0 mt-0.5">[{idx + 1}]</span>
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className={\`px-2.5 py-0.5 rounded-full text-xs font-semibold border \${bc}\`}>{bl}</span>
                                {pub.featured && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">⭐ Featured</span>}
                              </div>
                              ${pubUtils ? '<div className="text-gray-900 leading-relaxed text-sm mb-2" dangerouslySetInnerHTML={{ __html: citation.replace(/\\*(.*?)\\*/g, "<em>$1</em>") }} />' : '<h3 className="font-semibold text-gray-900 mb-1 text-sm">{pub.title}</h3><p className="text-sm text-gray-600 mb-1">{pub.authors}</p><p className="text-sm text-gray-500 italic">{pub.venue}, {pub.year}</p>'}
                              {pub.abstract && (
                                <details className="mt-2">
                                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 font-medium">Abstract</summary>
                                  <p className="mt-2 text-xs text-gray-600 leading-relaxed pl-3 border-l-2 border-primary/20">{pub.abstract}</p>
                                </details>
                              )}
                              <div className="flex flex-wrap gap-4 mt-3">
                                {pub.doi && <a href={\`https://doi.org/\${pub.doi}\`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">DOI ↗</a>}
                                {pub.pdfUrl && <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 font-semibold hover:underline">PDF ↗</a>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="py-20 text-center">
            <p className="text-5xl mb-4">📄</p>
            <p className="text-gray-400">Publications coming soon.</p>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
`);
console.log('Publications done');

console.log('All pages written!');
