import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  MapPinIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'Heritage Sites', href: '/care-the-culture' },
      { name: 'Explore Places', href: '/explore' },
      { name: 'Top Destinations', href: '/explore?tab=top' },
      { name: 'Nearby Sites', href: '/explore?tab=nearby' },
    ],
    support: [
      { name: 'Donate', href: '/donate' },
      { name: 'Contribute', href: '/care-the-culture' },
      { name: 'Our Partners', href: '/about#partners' },
      { name: 'Contact Us', href: '/about#contact' },
    ],
    resources: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Use', href: '/terms' },
    ],
  };

  // Real external links — no # placeholders
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/AbhayHegde05/Culture-heritage-preservation',
      icon: '⌨️',
      label: 'Open Source on GitHub',
    },
    {
      name: 'UNESCO',
      href: 'https://www.unesco.org/en/culture',
      icon: '🏛️',
      label: 'UNESCO Culture',
    },
    {
      name: 'ASI',
      href: 'https://asi.nic.in',
      icon: '🏺',
      label: 'Archaeological Survey of India',
    },
    {
      name: 'INTACH',
      href: 'https://www.intach.org',
      icon: '🌿',
      label: 'INTACH Heritage',
    },
  ];

  return (
    <footer style={{ backgroundColor: '#1a0000', color: '#f5ead5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#580000', border: '1px solid rgba(212,175,55,0.4)' }}
              >
                <HeartIcon className="w-7 h-7" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h3
                  className="text-xl font-bold font-display"
                  style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
                >
                  Indian Heritage
                </h3>
                <p className="text-xs font-serif" style={{ color: '#f5ead5' }}>
                  Preserving India's Past, Enriching Our Future
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed font-serif text-sm" style={{ color: '#c8b09a' }}>
              We are dedicated to preserving and showcasing India's rich cultural heritage sites
              from the Himalayas to the Indian Ocean — ancient temples, majestic forts, and living
              traditions that define our incredible nation.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <span className="text-sm font-serif" style={{ color: '#c8b09a' }}>
                  info@cultureheritage.in
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <span className="text-sm font-serif" style={{ color: '#c8b09a' }}>
                  New Delhi, India
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CodeBracketIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <a
                  href="https://github.com/AbhayHegde05/Culture-heritage-preservation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-serif transition-colors"
                  style={{ color: '#D4AF37' }}
                >
                  Open Source on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4
              className="text-base font-semibold mb-4 flex items-center font-display uppercase tracking-wider"
              style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
            >
              <GlobeAltIcon className="w-4 h-4 mr-2" />
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-serif transition-colors"
                    style={{ color: '#c8b09a' }}
                    onMouseEnter={e => e.target.style.color = '#D4AF37'}
                    onMouseLeave={e => e.target.style.color = '#c8b09a'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4
              className="text-base font-semibold mb-4 flex items-center font-display uppercase tracking-wider"
              style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
            >
              <HeartIcon className="w-4 h-4 mr-2" />
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-serif transition-colors"
                    style={{ color: '#c8b09a' }}
                    onMouseEnter={e => e.target.style.color = '#D4AF37'}
                    onMouseLeave={e => e.target.style.color = '#c8b09a'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4
              className="text-base font-semibold mb-4 flex items-center font-display uppercase tracking-wider"
              style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}
            >
              <AcademicCapIcon className="w-4 h-4 mr-2" />
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-serif transition-colors"
                    style={{ color: '#c8b09a' }}
                    onMouseEnter={e => e.target.style.color = '#D4AF37'}
                    onMouseLeave={e => e.target.style.color = '#c8b09a'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners / External Links Row */}
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h4
                className="text-sm font-display uppercase tracking-widest mb-3"
                style={{ color: '#D4AF37' }}
              >
                External Cultural Resources
              </h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-serif transition-all duration-200"
                    style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#c8b09a' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; e.currentTarget.style.color = '#c8b09a'; }}
                  >
                    <span>{social.icon}</span>
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-display uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>
                Stay Updated
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-serif focus:outline-none"
                  style={{
                    backgroundColor: 'rgba(212,175,55,0.06)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: '#f5ead5',
                  }}
                />
                <button className="btn-primary whitespace-nowrap text-sm">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-xs font-serif" style={{ color: '#8a7060' }}>
            © {currentYear} Culture Heritage Preservation. Open-source project — MIT Licence.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-xs font-display uppercase tracking-wider transition-colors"
              style={{ color: '#8a7060' }}
              onMouseEnter={e => e.target.style.color = '#D4AF37'}
              onMouseLeave={e => e.target.style.color = '#8a7060'}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs font-display uppercase tracking-wider transition-colors"
              style={{ color: '#8a7060' }}
              onMouseEnter={e => e.target.style.color = '#D4AF37'}
              onMouseLeave={e => e.target.style.color = '#8a7060'}
            >
              Terms of Use
            </Link>
            <a
              href="https://github.com/AbhayHegde05/Culture-heritage-preservation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display uppercase tracking-wider transition-colors"
              style={{ color: '#8a7060' }}
              onMouseEnter={e => e.target.style.color = '#D4AF37'}
              onMouseLeave={e => e.target.style.color = '#8a7060'}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Gold accent bottom strip */}
      <div
        className="h-1"
        style={{ background: 'linear-gradient(to right, #580000, #D4AF37, #b38728, #D4AF37, #580000)' }}
      />
    </footer>
  );
};

export default Footer;
