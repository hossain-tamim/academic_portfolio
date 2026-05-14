'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  publications: number;
  projects: number;
  courses: number;
  news: number;
  photos: number;
  messages: number;
  unreadMessages: number;
  posts: number;
}

const sections = [
  { href: '/admin/research',     label: 'Research Projects', key: 'projects'     as const, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { href: '/admin/publications', label: 'Publications',      key: 'publications' as const, color: 'bg-green-50 text-green-700 border-green-200' },
  { href: '/admin/teaching',     label: 'Courses',           key: 'courses'      as const, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { href: '/admin/news',         label: 'Published News',    key: 'news'         as const, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { href: '/admin/blog',         label: 'Blog Posts',        key: 'posts'        as const, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { href: '/admin/photos',       label: 'Photos',            key: 'photos'       as const, color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { href: '/admin/messages',     label: 'Messages',          key: 'messages'     as const, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`block p-5 rounded-xl border ${section.color} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="text-3xl font-bold">
                {stats ? stats[section.key] : '—'}
              </div>
              {section.key === 'messages' && stats && stats.unreadMessages > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {stats.unreadMessages} new
                </span>
              )}
            </div>
            <div className="text-sm font-medium mt-1">{section.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {sections.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              {s.label === 'Published News' ? 'Manage News' : `Manage ${s.label}`}
            </Link>
          ))}
          <Link href="/admin/settings" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
