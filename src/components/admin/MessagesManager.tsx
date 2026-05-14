'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch(`/api/contact/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !msg.read }),
      });
      if (res.ok) fetchMessages();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (expanded === id) setExpanded(null);
        fetchMessages();
      }
    } catch (err) { console.error(err); }
  };

  const handleOpen = async (msg: Message) => {
    setExpanded(expanded === msg.id ? null : msg.id);
    if (!msg.read) {
      await fetch(`/api/contact/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const displayed = messages.filter(m =>
    filter === 'all' ? true : filter === 'unread' ? !m.read : m.read
  );
  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message list */}
      {displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white border rounded-xl overflow-hidden transition-shadow hover:shadow-sm ${
                msg.read ? 'border-gray-200' : 'border-blue-200 shadow-sm shadow-blue-50'
              }`}
            >
              {/* Row header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => handleOpen(msg)}
              >
                {/* Unread dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-transparent' : 'bg-blue-500'}`} />

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm ${msg.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                  </div>
                  <p className={`text-sm truncate ${msg.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                    {msg.subject}
                  </p>
                </div>

                {/* Date + chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded body */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50">
                  <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Reply via Email
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleRead(msg)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Mark as {msg.read ? 'Unread' : 'Read'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      className="ml-auto px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
