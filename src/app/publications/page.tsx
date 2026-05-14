import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { formatAPACitation, getPublicationBadgeColor, getPublicationBadgeText } from '@/utils/citationFormatter';

async function getPublications() {
  return await prisma.publication.findMany({
    orderBy: [{ year: 'desc' }, { createdAt: 'desc' }]
  });
}



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
                      const citation = formatAPACitation(pub); const bc = getPublicationBadgeColor(pub.type, pub.badge); const bl = getPublicationBadgeText(pub.type, pub.badge);
                      return (
                        <div key={pub.id} className="card-hover group bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                          <div className="flex gap-4">
                            <span className="text-gray-300 font-mono text-sm shrink-0 mt-0.5">[{idx + 1}]</span>
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bc}`}>{bl}</span>
                                {pub.featured && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">⭐ Featured</span>}
                              </div>
                              <div className="text-gray-900 leading-relaxed text-sm mb-2" dangerouslySetInnerHTML={{ __html: citation.replace(/\*(.*?)\*/g, "<em>$1</em>") }} />
                              {pub.abstract && (
                                <details className="mt-2">
                                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 font-medium">Abstract</summary>
                                  <p className="mt-2 text-xs text-gray-600 leading-relaxed pl-3 border-l-2 border-primary/20">{pub.abstract}</p>
                                </details>
                              )}
                              <div className="flex flex-wrap gap-4 mt-3">
                                {pub.doi && <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold hover:underline">DOI ↗</a>}
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
