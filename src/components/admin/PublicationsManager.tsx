'use client';

import { useState, useEffect } from 'react';

interface Publication {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  publisher: string | null;
  doi: string | null;
  pdfUrl: string | null;
  abstract: string | null;
  type: string;
  badge: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  featured: boolean;
}

const emptyForm = {
  title: '',
  authors: '',
  year: new Date().getFullYear().toString(),
  venue: '',
  publisher: '',
  doi: '',
  pdfUrl: '',
  abstract: '',
  type: 'JOURNAL',
  badge: '',
  volume: '',
  issue: '',
  pages: '',
  featured: false,
};

export default function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchPublications(); }, []);

  const fetchPublications = async () => {
    try {
      const res = await fetch('/api/publications');
      setPublications(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (pub: Publication) => {
    setEditing(pub);
    setForm({
      title: pub.title,
      authors: pub.authors,
      year: pub.year.toString(),
      venue: pub.venue,
      publisher: pub.publisher || '',
      doi: pub.doi || '',
      pdfUrl: pub.pdfUrl || '',
      abstract: pub.abstract || '',
      type: pub.type,
      badge: pub.badge || '',
      volume: pub.volume || '',
      issue: pub.issue || '',
      pages: pub.pages || '',
      featured: pub.featured,
    });
    setModalOpen(true);
  };

  const close = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = editing ? `/api/publications/${editing.id}` : '/api/publications';
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          badge: form.type === 'JOURNAL' && form.badge ? form.badge : null,
        }),
      });
      if (res.ok) { fetchPublications(); close(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this publication?')) return;
    try {
      const res = await fetch(`/api/publications/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPublications();
    } catch (err) { console.error(err); }
  };

  const badgeColor = (pub: Publication) => {
    if (pub.type === 'JOURNAL' && pub.badge) {
      if (pub.badge === 'Q1') return 'bg-green-50 text-green-700';
      if (pub.badge === 'Q2') return 'bg-blue-50 text-blue-700';
      if (pub.badge === 'Q3') return 'bg-yellow-50 text-yellow-700';
      return 'bg-orange-50 text-orange-700';
    }
    if (pub.type === 'CONFERENCE') return 'bg-indigo-50 text-indigo-700';
    if (pub.type === 'PREPRINT') return 'bg-purple-50 text-purple-700';
    return 'bg-pink-50 text-pink-700';
  };

  const badgeLabel = (pub: Publication) =>
    pub.type === 'JOURNAL' && pub.badge ? pub.badge : pub.type;

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  // Group by year
  const grouped = publications.reduce((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = [];
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
        <button type="button" onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          + Add Publication
        </button>
      </div>

      {/* List grouped by year */}
      <div className="space-y-6">
        {Object.entries(grouped)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, pubs]) => (
            <div key={year}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{year}</h3>
              <div className="space-y-2">
                {pubs.map((pub) => (
                  <div key={pub.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor(pub)}`}>
                            {badgeLabel(pub)}
                          </span>
                          {pub.featured && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">Featured</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">{pub.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{pub.authors}</p>
                        <p className="text-xs text-gray-400 mt-0.5"><em>{pub.venue}</em>, {pub.year}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button type="button" onClick={() => openEdit(pub)} className="text-sm text-primary font-medium hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDelete(pub.id)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        {publications.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-sm">No publications yet.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={close}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Publication' : 'New Publication'}
              </h3>
              <button type="button" title="Close" onClick={close} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Publication title" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authors *</label>
                <input required value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} className={inputClass} placeholder="Last, F., Last, F., & Last, F." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input required type="number" min="1900" max="2100" title="Publication year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select title="Publication type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, badge: '' })} className={inputClass + ' bg-white'}>
                    <option value="JOURNAL">Journal Article</option>
                    <option value="CONFERENCE">Conference Paper</option>
                    <option value="PREPRINT">Preprint</option>
                    <option value="REVIEW">Review Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue / Journal / Conference *</label>
                <input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClass} placeholder="e.g., Nature Machine Intelligence" />
              </div>

              {form.type === 'JOURNAL' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Journal Quartile</label>
                    <select title="Journal quartile" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputClass + ' bg-white'}>
                      <option value="">None</option>
                      <option value="Q1">Q1 (Top 25%)</option>
                      <option value="Q2">Q2 (25-50%)</option>
                      <option value="Q3">Q3 (50-75%)</option>
                      <option value="Q4">Q4 (Bottom 25%)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                      <input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className={inputClass} placeholder="e.g., 15" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
                      <input value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className={inputClass} placeholder="e.g., 3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                      <input value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} className={inputClass} placeholder="e.g., 123-145" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} className={inputClass} placeholder="e.g., Springer Nature" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
                  <input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} className={inputClass} placeholder="10.1038/s42256-023-00123-4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF URL</label>
                  <input type="url" value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} rows={3} className={inputClass + ' resize-none'} placeholder="Brief summary..." />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                <span className="text-sm text-gray-700">Featured Publication</span>
              </label>

              {/* Modal Footer */}
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
