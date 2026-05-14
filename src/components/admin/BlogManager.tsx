'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

type PostForm = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
};

const empty: PostForm = { title: '', slug: '', content: '', excerpt: '', published: false };

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | Post | null>(null);
  const [form, setForm] = useState<PostForm>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm(empty);
    setError('');
    setModal('create');
  };

  const openEdit = (post: Post) => {
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      published: post.published,
    });
    setError('');
    setModal(post);
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: modal === 'create' ? slugify(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const isNew = modal === 'create';
      const url = isNew ? '/api/blog' : `/api/blog/${(modal as Post).id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModal(null);
        fetchPosts();
      } else {
        const data = await res.json();
        setError(data.error || 'Save failed');
      }
    } catch (err) { console.error(err); setError('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    } catch (err) { console.error(err); }
  };

  const togglePublish = async (post: Post) => {
    try {
      await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, excerpt: post.excerpt || '', published: !post.published }),
      });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {posts.length} posts · {posts.filter(p => p.published).length} published
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          + New Post
        </button>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No posts yet. Create your first post!
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">/blog/{post.slug}</p>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => togglePublish(post)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    post.published
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setModal(null)}>
          <div className="bg-white rounded-xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{modal === 'create' ? 'New Post' : 'Edit Post'}</h3>
              <button type="button" title="Close" onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className={inputClass}
                  placeholder="Post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  className={inputClass + ' font-mono text-xs'}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <input
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className={inputClass}
                  placeholder="Short summary shown in listings..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className={inputClass + ' resize-none'}
                  rows={12}
                  placeholder="Write your post content here (Markdown supported)..."
                  required
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-green-50 border border-green-200">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-green-500"
                />
                <span className="text-sm font-medium text-green-800">Publish immediately</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : modal === 'create' ? 'Create Post' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
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
