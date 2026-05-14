import Navigation from '@/components/public/Navigation';
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
