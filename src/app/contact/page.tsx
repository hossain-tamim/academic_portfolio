'use client';

import { useState } from 'react';
import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="pt-10 pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <h1 className=" text-3xl md:text-4xl text-gray-900 mb-2">
              Contact
            </h1> */}
            <p className="text-gray-500 max-w-xl">
              Feel free to reach out for academic collaborations, research inquiries, or any questions.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

              {/* Left Column — Info */}
              <div className="lg:col-span-2 space-y-8">

                {/* University Address */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    University Address
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">Department of Computer Science & Engineering</p>
                    <p className="text-sm text-gray-600">Premier University, Chittagong</p>
                    <p className="text-sm text-gray-600">Academic Building-4, 44 Hazarilane,</p>
                    <p className="text-sm text-gray-600">Chittagong 4000, Bangladesh</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Contact Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors group">
                      <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-primary">tamim.hossain [at] puc.ac.bd</p>
                        <p className="text-xs text-gray-400">University Email</p>
                      </div>
                    </div>
                    
                    {/* <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors group">
                      <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-primary">+880 1867-625757</p>
                        <p className="text-xs text-gray-400">Phone</p>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Academic Profiles */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Academic Profiles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
                      </svg>
                      Google Scholar
                    </a>
                    <a href="https://researchgate.net" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.586 0c-1.326 0-2.409.494-3.244 1.342-.835.847-1.196 1.936-1.196 3.233 0 1.297.36 2.386 1.196 3.233.835.848 1.918 1.342 3.244 1.342.487 0 .939-.073 1.374-.206l.276.553h1.594l-.69-1.38c.58-.668.89-1.593.89-2.663v-.558c0-1.297-.36-2.386-1.196-3.233C20.999.494 19.916 0 19.586 0zm1.374 5.79c0 .594-.128 1.063-.384 1.415l-.69-1.38h-1.594l.276.553c-.213.065-.441.1-.692.1-.657 0-1.176-.247-1.556-.74-.38-.494-.57-1.135-.57-1.923s.19-1.43.57-1.923c.38-.494.899-.74 1.556-.74.657 0 1.176.247 1.556.74.38.494.57 1.135.57 1.923v.975zM8.464 16.73c-.384-.494-.57-1.135-.57-1.924 0-.788.19-1.429.57-1.923.38-.494.899-.74 1.556-.74.657 0 1.176.246 1.556.74.38.494.57 1.135.57 1.923 0 .79-.19 1.43-.57 1.924-.38.494-.899.74-1.556.74-.657 0-1.176-.246-1.556-.74zm5.052-5.09c-.835-.847-1.918-1.342-3.244-1.342-1.33 0-2.413.494-3.248 1.342C6.19 12.487 5.83 13.576 5.83 14.873c0 1.297.36 2.386 1.196 3.233.835.848 1.918 1.342 3.248 1.342 1.326 0 2.409-.494 3.244-1.342.835-.847 1.196-1.936 1.196-3.233 0-1.297-.36-2.386-1.196-3.233zM3.688 10.297H0V24h3.688V10.297z" />
                      </svg>
                      ResearchGate
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>

                {/* Office Hours Quick Info */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Office Hours
                  </h3>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      For current office hours schedule, please visit the{' '}
                      <a href="/teaching" className="text-primary font-medium hover:underline">Teaching</a> page.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Walk-ins welcome during posted hours. For other times, please email to schedule an appointment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column — Map + Form */}
              <div className="lg:col-span-3 space-y-8">

                {/* Google Map */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Location
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <iframe
                      title="Premier University, Chittagong Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5320.43844778742!2d91.83638626946352!3d22.339472267762268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad275971a7ceaf%3A0x1300e42a953c30ec!2sPremier%20University%2C%20Department%20of%20CSE%2C%20Department%20of%20Economics%2C%20Department%20of%20Law%20and%20Department%20of%20EEE.!5e0!3m2!1sen!2sbd!4v1771276468897!5m2!1sen!2sbd"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                {/* Get In Touch Form */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Get in Touch
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="Research Collaboration">Research Collaboration</option>
                        <option value="Graduate Opportunity">Graduate Opportunity Inquiry</option>
                        <option value="Course Inquiry">Course Inquiry</option>
                        <option value="Thesis Supervision">Thesis / Project Supervision</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    {status === 'sent' && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm text-green-700">Message sent successfully. I will get back to you soon.</p>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-sm text-red-700">Failed to send message. Please try again or email directly.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>

                {/* Response Time Note */}
                <div className="flex items-start gap-3 text-xs text-gray-400">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    I typically respond within 1–2 business days. For urgent academic matters,
                    please contact the department office directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
