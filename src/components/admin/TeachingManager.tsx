'use client';

import { useState, useEffect } from 'react';

interface Teaching {
  id: string;
  code: string;
  name: string;
  semester: string;
  creditHours: number | null;
  description: string | null;
  syllabus: string | null;
  featured: boolean;
}

const emptyForm = {
  code: '',
  name: '',
  semester: '',
  creditHours: '',
  description: '',
  syllabus: '',
  featured: false,
};

export default function TeachingManager() {
  const [courses, setCourses] = useState<Teaching[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teaching | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/teaching');
      setCourses(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (course: Teaching) => {
    setEditing(course);
    setForm({
      code: course.code,
      name: course.name,
      semester: course.semester,
      creditHours: course.creditHours?.toString() || '',
      description: course.description || '',
      syllabus: course.syllabus || '',
      featured: course.featured,
    });
    setModalOpen(true);
  };

  const close = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = editing ? `/api/teaching/${editing.id}` : '/api/teaching';
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          creditHours: form.creditHours ? parseFloat(form.creditHours) : null,
        }),
      });
      if (res.ok) { fetchCourses(); close(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      const res = await fetch(`/api/teaching/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCourses();
    } catch (err) { console.error(err); }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  // Group by semester
  const grouped = courses.reduce((acc, c) => {
    if (!acc[c.semester]) acc[c.semester] = [];
    acc[c.semester].push(c);
    return acc;
  }, {} as Record<string, Teaching[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Teaching</h2>
        <button type="button" onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          + Add Course
        </button>
      </div>

      {/* List grouped by semester */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([semester, semCourses]) => (
          <div key={semester}>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{semester}</h3>
            <div className="space-y-2">
              {semCourses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{course.code}</span>
                        {course.creditHours && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{course.creditHours} cr</span>
                        )}
                        {course.featured && (
                          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">Featured</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{course.name}</h4>
                      {course.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{course.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => openEdit(course)} className="text-sm text-primary font-medium hover:underline">Edit</button>
                      <button type="button" onClick={() => handleDelete(course.id)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-sm">No courses yet.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={close}>
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">{editing ? 'Edit Course' : 'New Course'}</h3>
              <button type="button" title="Close" onClick={close} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputClass} placeholder="CSE101" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Hours</label>
                  <input type="number" min="0.5" max="10" step="0.5" value={form.creditHours} onChange={(e) => setForm({ ...form, creditHours: e.target.value })} className={inputClass} placeholder="3" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Introduction to Programming" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                <input required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className={inputClass} placeholder="e.g., Fall 2025" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + ' resize-none'} placeholder="Brief course description..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus URL</label>
                <input type="url" value={form.syllabus} onChange={(e) => setForm({ ...form, syllabus: e.target.value })} className={inputClass} placeholder="https://..." />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                <span className="text-sm text-gray-700">Featured Course</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={close} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
