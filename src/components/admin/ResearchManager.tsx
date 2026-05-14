'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  featured: boolean;
  imageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  githubUrl: string | null;
  datasetUrl: string | null;
  paperUrl: string | null;
  tags: string | null;
}

const emptyForm = {
  title: '',
  description: '',
  status: 'ONGOING',
  featured: false,
  imageUrl: '',
  startDate: '',
  endDate: '',
  githubUrl: '',
  datasetUrl: '',
  paperUrl: '',
  tags: '',
};

export default function ResearchManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/research');
      setProjects(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      status: p.status,
      featured: p.featured,
      imageUrl: p.imageUrl || '',
      startDate: p.startDate ? p.startDate.split('T')[0] : '',
      endDate: p.endDate ? p.endDate.split('T')[0] : '',
      githubUrl: p.githubUrl || '',
      datasetUrl: p.datasetUrl || '',
      paperUrl: p.paperUrl || '',
      tags: p.tags || '',
    });
    setImagePreview(p.imageUrl);
    setModalOpen(true);
  };

  const close = () => { setModalOpen(false); setEditing(null); setImagePreview(null); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setForm({ ...form, imageUrl: b64 });
        setImagePreview(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = editing ? `/api/research/${editing.id}` : '/api/research';
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { fetchProjects(); close(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/research/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (err) { console.error(err); }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Research Projects</h2>
        <button type="button" onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          + Add Project
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex gap-5">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="w-28 h-28 object-cover rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.status === 'ONGOING' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    }`}>{p.status}</span>
                    {p.featured && <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">Featured</span>}
                  </div>
                </div>
                {p.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags.split(',').map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{t.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={() => openEdit(p)} className="text-sm text-primary font-medium hover:underline">Edit</button>
                  <button type="button" onClick={() => handleDelete(p.id)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-sm">No research projects yet.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={close}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Project' : 'New Project'}
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
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Project title" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + ' resize-none'} placeholder="Brief description" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select title="Project status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass + ' bg-white'}>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" title="Start date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" title="End date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dataset URL</label>
                  <input type="url" value={form.datasetUrl} onChange={(e) => setForm({ ...form, datasetUrl: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paper URL</label>
                  <input type="url" value={form.paperUrl} onChange={(e) => setForm({ ...form, paperUrl: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="Machine Learning, NLP, Computer Vision" />
              </div>

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
