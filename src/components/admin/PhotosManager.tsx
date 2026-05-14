'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  title: string | null;
  tag: string;
  featured: boolean;
  width: number | null;
  height: number | null;
  createdAt: string;
}

const TAGS = [
  { value: 'mountains', label: 'Mountains' },
  { value: 'nature',    label: 'Nature' },
  { value: 'people',    label: 'People' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'street',    label: 'Street' },
  { value: 'other',     label: 'Other' },
];

export default function PhotosManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ tag: 'nature', title: '', featured: false });
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editModal, setEditModal] = useState<Photo | null>(null);
  const [editForm, setEditForm] = useState({ tag: 'other', title: '', featured: false });
  const [filterTag, setFilterTag] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tag', uploadForm.tag);
      formData.append('featured', String(uploadForm.featured));
      if (uploadForm.title) formData.append('title', uploadForm.title);
      const res = await fetch('/api/photos/upload', { method: 'POST', body: formData });
      if (res.ok) {
        setSelectedFile(null);
        setPreview(null);
        setUploadForm({ tag: 'nature', title: '', featured: false });
        if (fileRef.current) fileRef.current.value = '';
        fetchPhotos();
      } else {
        const err = await res.json();
        alert(err.error || 'Upload failed');
      }
    } catch (err) { console.error(err); alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPhotos();
    } catch (err) { console.error(err); }
  };

  const openEdit = (photo: Photo) => {
    setEditModal(photo);
    setEditForm({ tag: photo.tag, title: photo.title || '', featured: photo.featured });
  };

  const handleEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!editModal) return;
    try {
      const res = await fetch(`/api/photos/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) { setEditModal(null); fetchPhotos(); }
    } catch (err) { console.error(err); }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';
  const displayed = filterTag === 'all' ? photos : photos.filter(p => p.tag === filterTag);
  const featuredCount = photos.filter(p => p.featured).length;

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Photography</h2>
          <p className="text-sm text-gray-500 mt-0.5">{photos.length} photos · {featuredCount} featured in hero</p>
        </div>
      </div>

      {/* Upload Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Upload New Photo</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/2 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <div className="relative mx-auto" style={{ maxWidth: '300px' }}>
                <img src={preview} alt="Preview" className="rounded-lg w-full h-48 object-cover" />
                <p className="text-xs text-gray-500 mt-2">{selectedFile?.name}</p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Click to select a photo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 10MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select title="Category" value={uploadForm.tag} onChange={(e) => setUploadForm({ ...uploadForm, tag: e.target.value })} className={inputClass + ' bg-white'}>
                {TAGS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
              <input value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} className={inputClass} placeholder="Brief description..." />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-amber-50 border border-amber-200">
            <input type="checkbox" checked={uploadForm.featured} onChange={(e) => setUploadForm({ ...uploadForm, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-amber-500" />
            <span className="text-sm font-medium text-amber-800">✦ Feature in hero carousel</span>
            <span className="text-xs text-amber-600 ml-auto">({featuredCount} currently featured)</span>
          </label>

          <button type="submit" disabled={!selectedFile || uploading}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {uploading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Uploading...</>
            ) : 'Upload Photo'}
          </button>
        </form>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...TAGS.map(t => t.value)].map(tag => (
          <button key={tag} type="button" onClick={() => setFilterTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterTag === tag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tag === 'all' ? 'All' : TAGS.find(t => t.value === tag)?.label}
            <span className="ml-1.5 opacity-60">{tag === 'all' ? photos.length : photos.filter(p => p.tag === tag).length}</span>
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {displayed.length === 0 ? (
        <p className="text-center py-12 text-gray-400 text-sm">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {displayed.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={photo.url} alt={photo.title || 'Photo'} fill className="object-cover" unoptimized />
              {/* Badges */}
              <div className="absolute top-2 left-2 z-10 flex gap-1">
                <span className="px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm">
                  {TAGS.find(t => t.value === photo.tag)?.label || photo.tag}
                </span>
              </div>
              {photo.featured && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="w-5 h-5 rounded-full bg-amber-400/90 flex items-center justify-center text-[9px]">✦</span>
                </div>
              )}
              {/* Hover actions */}
              <div className="absolute inset-0 z-20 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => openEdit(photo)} className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-medium hover:bg-gray-100">Edit</button>
                <button type="button" onClick={() => handleDelete(photo.id)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Edit Photo</h3>
              <button type="button" title="Close" onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img src={editModal.url} alt="Photo" className="w-full h-full object-cover" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select title="Category" value={editForm.tag} onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })} className={inputClass + ' bg-white'}>
                  {TAGS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={inputClass} placeholder="Optional caption..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-amber-50 border border-amber-200">
                <input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-amber-500" />
                <span className="text-sm font-medium text-amber-800">✦ Feature in hero carousel</span>
              </label>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Update</button>
                <button type="button" onClick={() => setEditModal(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
