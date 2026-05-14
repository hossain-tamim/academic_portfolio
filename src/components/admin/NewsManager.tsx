'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  url: string | null;
  date: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function currentDate() {
  const now = new Date();
  return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

const emptyForm = { title: '', url: '', date: currentDate(), published: true, featured: false };

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: currentDate() });
    setModalOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditing(item);
    setForm({ title: item.title, url: item.url || '', date: item.date, published: item.published, featured: item.featured });
    setModalOpen(true);
  };

  const close = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const url = editing ? `/api/news/${editing.id}` : '/api/news';
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { fetchNews(); close(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news item?')) return;
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) fetchNews();
    } catch (err) { console.error(err); }
  };

  // Date picker: split "May 2026" into parts
  const [selMonth, selYear] = (() => {
    const parts = form.date.split(' ');
    return [parts[0] || MONTHS[new Date().getMonth()], parts[1] || String(new Date().getFullYear())];
  })();
  const setDate = (month: string, year: string) => setForm({ ...form, date: `${month} ${year}` });

  const yearOptions = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - 2 + i));

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
          <p className="text-sm text-gray-500 mt-0.5">{news.length} items</p>
        </div>
        <button type="button" onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          + Add News
        </button>
      </div>

      <div className="space-y-2">
        {news.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No news yet.</p>}
        {news.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center gap-4">
            <span className="shrink-0 text-xs font-medium text-gray-400 w-24">{item.date}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-900 font-medium">{item.title}</span>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-primary hover:underline truncate">↗ link</a>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.featured && <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">Featured</span>}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {item.published ? 'Live' : 'Hidden'}
              </span>
              <button type="button" onClick={() => openEdit(item)} className="text-sm text-primary font-medium hover:underline">Edit</button>
              <button type="button" onClick={() => handleDelete(item.id)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={close}>
          <div className="bg-white rounded-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editing ? 'Edit News' : 'New News Item'}</h3>
              <button type="button" title="Close" onClick={close} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="Paper accepted at NeurIPS 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="flex gap-2">
                  <select
                    title="Month"
                    value={selMonth}
                    onChange={e => setDate(e.target.value, selYear)}
                    className={inputClass + ' bg-white'}
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    title="Year"
                    value={selYear}
                    onChange={e => setDate(selMonth, e.target.value)}
                    className={inputClass + ' bg-white'}
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary" />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary" />
                  <span className="text-sm text-gray-700">Featured on homepage</span>
                </label>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                  {editing ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={close} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
