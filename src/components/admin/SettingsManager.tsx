'use client';

import { useState, useEffect } from 'react';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function SettingsManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [nameEmail, setNameEmail] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => {
    fetch('/api/admin/profile')
      .then(r => r.json())
      .then((data: Profile) => {
        setProfile(data);
        setNameEmail({ name: data.name || '', email: data.email });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleProfileSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameEmail.name, email: nameEmail.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, ...data } : prev);
        showSuccess('Profile updated successfully.');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) { console.error(err); setError('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (passwords.newPass.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswords({ current: '', newPass: '', confirm: '' });
        showSuccess('Password changed successfully.');
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) { console.error(err); setError('Failed to change password'); }
    finally { setSaving(false); }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-500">Failed to load profile.</div>;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account</p>
      </div>

      {success && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Profile info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Profile Information</h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              value={nameEmail.name}
              onChange={e => setNameEmail({ ...nameEmail, name: e.target.value })}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={nameEmail.email}
              onChange={e => setNameEmail({ ...nameEmail, email: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400">
              Account created {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Change Password</h3>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
              className={inputClass}
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
              className={inputClass}
              required
              autoComplete="new-password"
              minLength={8}
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
              className={inputClass}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Changing…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
