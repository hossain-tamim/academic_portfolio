import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-1 text-lg gradient-text">MD Tamim Hossain</h3>
            <p className="text-sm text-gray-400 mb-4">Lecturer · CSE · Premier University, Chittagong</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Passionate about Machine Learning, Computer Vision, and building AI systems that matter.
              Currently seeking graduate research opportunities.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'About' },
                { href: '/research', label: 'Research' },
                { href: '/publications', label: 'Publications' },
                { href: '/teaching', label: 'Teaching' },
                { href: '/photography', label: 'Photography' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Google Scholar</a></li>
              <li><a href="https://researchgate.net" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">ResearchGate</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="mailto:tamim.hossain@puc.ac.bd" className="text-sm text-gray-400 hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} MD Tamim Hossain. All rights reserved.</p>
          <p className="text-xs text-gray-600 font-mono">{'<'} built with passion {'>'}</p>
        </div>
      </div>
    </footer>
  );
}
