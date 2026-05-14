import Navigation from '@/components/public/Navigation';
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
                      <div className={`p-6 ${p.imageUrl ? 'md:col-span-3' : 'md:col-span-4'}`}>
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
