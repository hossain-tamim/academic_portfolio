const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const photographyPage = `'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  title: string | null;
  tag: string;
  featured: boolean;
  width: number | null;
  height: number | null;
}

const TAGS = [
  { value: 'all',       label: 'All' },
  { value: 'mountains', label: 'Mountains' },
  { value: 'nature',    label: 'Nature' },
  { value: 'people',    label: 'People' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'street',    label: 'Street' },
  { value: 'other',     label: 'Other' },
];

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filtered, setFiltered] = useState<Photo[]>([]);
  const [activeTag, setActiveTag] = useState('all');
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then((data: unknown) => {
        const arr = Array.isArray(data) ? (data as Photo[]) : [];
        setPhotos(arr);
        setFiltered(arr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Hide filter bar on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHeaderVisible(current < lastScroll || current < 60);
      setLastScroll(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScroll]);

  const handleTag = useCallback((tag: string) => {
    setActiveTag(tag);
    setFiltered(tag === 'all' ? photos : photos.filter(p => p.tag === tag));
  }, [photos]);

  const preventSave = (e: React.MouseEvent | React.DragEvent) => e.preventDefault();

  return (
    <div className="min-h-screen bg-black">

      {/* ── Floating filter bar ── */}
      <header
        className={\`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 \${headerVisible ? 'translate-y-0' : '-translate-y-full'}\`}
      >
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)', backdropFilter: 'blur(0px)' }}>

          {/* Back link */}
          <Link href="/"
            className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          {/* Filter pills */}
          <div className="flex items-center gap-0.5">
            {TAGS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTag(t.value)}
                className={\`px-3 py-1 rounded-full text-xs font-medium transition-all \${
                  activeTag === t.value
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white/80'
                }\`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Photo count */}
          <span className="text-white/25 text-xs tabular-nums">{filtered.length}</span>
        </div>
      </header>

      {/* ── Masonry Grid ── */}
      <main className="p-0.5 pt-0">
        {loading ? (
          /* Skeleton */
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-0.5 bg-white/5 animate-pulse"
                style={{ height: \`\${180 + (i % 5) * 60}px\` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <p className="text-white/20 text-sm tracking-widest uppercase">No photos yet</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-0.5">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid mb-0.5 relative group overflow-hidden bg-white/5"
              >
                {/* Save blocker */}
                <div
                  className="absolute inset-0 z-10 select-none"
                  onContextMenu={preventSave}
                  onDragStart={preventSave}
                />

                <Image
                  src={photo.url}
                  alt={photo.title || ''}
                  width={photo.width || 800}
                  height={photo.height || 600}
                  className="w-full h-auto block object-cover transition-opacity duration-500 group-hover:opacity-90 select-none pointer-events-none"
                  draggable={false}
                  unoptimized
                />

                {/* Caption on hover — bottom fade */}
                {photo.title && (
                  <div className="absolute inset-x-0 bottom-0 z-20 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
                    <p className="text-white/80 text-xs leading-snug">{photo.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(root, 'src/app/photography/page.tsx'), photographyPage);
console.log('Done');
