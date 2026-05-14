'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'About' },
    { href: '/research', label: 'Research' },
    { href: '/teaching', label: 'Teaching' },
    { href: '/publications', label: 'Publications' },
    { href: '/photography', label: 'Photography' },
  ];

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">

          {/* Name & Designation */}
          <Link href="/" className="shrink-0 flex items-center gap-3 group">
            <Image
              src="/profile2.png"
              alt="MD Tamim Hossain"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 md:hidden"
            />
            <div>
              <div className="text-xl font-bold gradient-text leading-tight">MD Tamim Hossain</div>
              <div className="text-xs text-gray-400 tracking-wide">Lecturer · CSE · Premier University</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === item.href
                    ? 'text-primary bg-primary/8 border-b-2 border-primary'
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
            >
              Contact
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            title="Toggle menu"
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg mx-1 mb-0.5 ${
                  pathname === item.href
                    ? 'text-primary bg-primary/8'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block mx-1 mt-2 px-3 py-2.5 bg-primary text-white text-sm font-medium rounded-lg text-center"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
