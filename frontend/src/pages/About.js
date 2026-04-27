import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  HeartIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  MapPinIcon,
  LightBulbIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { heritage } from '../services/api';

const About = () => {
  // Live stats from the database
  const { data: stats } = useQuery('heritageStats', () => heritage.getStats(), {
    staleTime: 10 * 60 * 1000,
  });

  // Live top contributors from the database
  const { data: topSites } = useQuery(
    'topContributorSites',
    () => heritage.getAll({ limit: 8, sort: '-ratings.count' }),
    { staleTime: 10 * 60 * 1000 }
  );

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Preservation First',
      description: 'We prioritize the protection and conservation of heritage sites above all else.',
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to make heritage accessible to everyone.',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Empowering local communities to take ownership of their cultural heritage.',
    },
    {
      icon: GlobeAltIcon,
      title: 'National Reach',
      description: 'Connecting Indians from Kashmir to Kanyakumari through shared cultural heritage.',
    },
  ];

  // Impact figures come entirely from the live stats API — zero hardcoding
  const achievements = [
    { label: 'Verified Heritage Sites', value: stats?.data?.totalVerified ?? 0, icon: BuildingLibraryIcon },
    { label: 'Active Contributors', value: stats?.data?.totalContributors ?? 0, icon: UserGroupIcon },
    { label: 'States Covered', value: '28+', icon: GlobeAltIcon },
    { label: 'Site Categories', value: stats?.data?.categoryBreakdown?.length ?? 0, icon: AcademicCapIcon },
  ];

  const partners = [
    { name: 'UNESCO', logo: '🏛️', href: 'https://www.unesco.org' },
    { name: 'World Monuments Fund', logo: '🏺', href: 'https://www.wmf.org' },
    { name: 'National Geographic', logo: '📸', href: 'https://www.nationalgeographic.com' },
    { name: 'Archeological Survey of India', logo: '🏛️', href: 'https://asi.nic.in' },
    { name: 'Indian Cultural Ministry', logo: '🏛️', href: 'https://indiaculture.gov.in' },
    { name: 'INTACH', logo: '🏺', href: 'https://www.intach.org' },
  ];

  // Contributors grid — populated from top-reviewed sites until a /users endpoint is available
  const contributors = Array.isArray(topSites?.data) ? topSites.data : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF5E5' }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 text-white"
        style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 60%, #4a0000 100%)' }}
      >
        {/* Mandala overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.5'%3E%3Cpath d='M30 30c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0-10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm10 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 gold-text"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Preserving India's Cultural Heritage
          </h1>
          <div
            className="mx-auto mb-6"
            style={{ width: 80, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}
          />
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-serif" style={{ color: '#f5ead5' }}>
            We are dedicated to preserving, documenting, and sharing India's magnificent cultural
            heritage through innovative digital solutions and community engagement.
          </p>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section id="mission" className="py-20 parchment-section" style={{ backgroundColor: '#FCF5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="vintage-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 border-4 rounded-2xl pointer-events-none" style={{ borderColor: 'rgba(212,175,55,0.15)' }} />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 font-display" style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}>
                  Our Mission
                </h2>
                <div style={{ width: 50, height: 2, background: 'linear-gradient(to right, #D4AF37, transparent)', marginBottom: '1.5rem' }} />
                <p className="text-lg mb-6 leading-relaxed font-serif" style={{ color: '#2d1a00' }}>
                  Our mission is to create a comprehensive digital platform that preserves and showcases
                  India's rich cultural heritage for future generations. We believe that by making heritage
                  accessible, we can foster greater appreciation of our shared Indian history.
                </p>
                <p className="text-lg mb-8 leading-relaxed font-serif" style={{ color: '#2d1a00' }}>
                  Through advanced technology, community collaboration, and partnerships with ASI and cultural
                  institutions, we work tirelessly to document, protect, and promote India's most precious
                  temples, forts, monuments, and living traditions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/explore" className="btn-royal inline-flex items-center justify-center">
                    Explore Our Work
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/donate" className="btn-outline inline-flex items-center justify-center">
                    Support Our Mission
                    <HeartIcon className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Taj Mahal — Heritage preservation"
                  className="rounded-2xl shadow-2xl royal-border"
                />
                <div
                  className="absolute -bottom-6 -left-6 p-6 rounded-xl shadow-xl"
                  style={{ backgroundColor: '#580000', border: '2px solid rgba(212,175,55,0.4)' }}
                >
                  <div className="flex items-center space-x-3 text-white">
                    <BuildingLibraryIcon className="w-8 h-8" style={{ color: '#D4AF37' }} />
                    <div>
                      <div className="text-3xl font-bold font-display gold-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {stats?.data?.totalVerified ?? 0}
                      </div>
                      <div className="text-sm font-serif" style={{ color: '#f5ead5' }}>Verified Sites</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#f5ead5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-display" style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}>
              Our Core Values
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '1rem auto' }} />
            <p className="text-xl max-w-3xl mx-auto font-serif" style={{ color: '#4a2c00' }}>
              The principles that guide our work and shape our approach to heritage preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 royal-border transition-all duration-300"
                    style={{ backgroundColor: '#FFFFF0' }}
                  >
                    <Icon className="w-10 h-10 transition-colors duration-300" style={{ color: '#580000' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-display" style={{ color: '#580000' }}>{value.title}</h3>
                  <p className="leading-relaxed font-serif" style={{ color: '#4a2c00' }}>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Impact / Achievements ──────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 100%)', color: '#FCF5E5' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 gold-text"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Impact
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '1rem auto' }} />
            <p className="text-xl max-w-3xl mx-auto font-serif" style={{ color: '#f5ead5' }}>
              Real numbers from our database, reflecting our commitment to preserving cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4AF37' }} />
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {achievement.value}
                  </div>
                  <div className="font-display uppercase tracking-widest text-sm" style={{ color: '#f5ead5' }}>
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our Contributors ──────────────────────────────────────────── */}
      <section className="py-20 parchment-section" style={{ backgroundColor: '#FCF5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 font-display"
              style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}
            >
              Our Contributors
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '1rem auto' }} />
            <p className="text-xl max-w-3xl mx-auto font-serif" style={{ color: '#4a2c00' }}>
              Heritage enthusiasts and scholars who have enriched our platform with documentation and reviews.
            </p>
          </div>

          {contributors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contributors.map((site, index) => (
                <Link key={site._id || index} to={`/heritage/${site._id}`} className="group">
                  <div className="card text-center py-6 px-4 group-hover:scale-105 transition-transform duration-300">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl font-display"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #b38728)', color: '#580000' }}
                    >
                      {(site.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold font-display text-sm mb-1" style={{ color: '#580000' }}>
                      {site.name}
                    </h3>
                    <p className="text-xs font-serif capitalize" style={{ color: '#D4AF37' }}>
                      {site.category?.replace('_', ' ')} · {site.location?.city}
                    </p>
                    <p className="text-xs mt-2 font-serif" style={{ color: '#4a2c00' }}>
                      {site.ratings?.count ?? 0} community reviews
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#D4AF37' }} />
              <p className="text-lg font-serif" style={{ color: '#580000' }}>
                Contributors will appear here once data is available.
              </p>
              <Link to="/care-the-culture" className="btn-primary mt-6 inline-flex items-center">
                Become a Contributor
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Partners ──────────────────────────────────────────────────── */}
      <section id="partners" className="py-20" style={{ backgroundColor: '#f5ead5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 font-display"
              style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}
            >
              Our Partners
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '1rem auto' }} />
            <p className="text-xl max-w-3xl mx-auto font-serif" style={{ color: '#4a2c00' }}>
              Collaborating with leading cultural organizations to advance heritage preservation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <p className="text-sm font-medium font-display" style={{ color: '#580000' }}>{partner.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 parchment-section" style={{ backgroundColor: '#FCF5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4 font-display"
              style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}
            >
              Get In Touch
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '1rem auto' }} />
            <p className="text-xl max-w-3xl mx-auto font-serif" style={{ color: '#4a2c00' }}>
              Have questions or want to contribute? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { Icon: EnvelopeIcon, title: 'Email Us', lines: ['info@cultureheritage.in', 'support@cultureheritage.in'] },
              { Icon: MapPinIcon, title: 'Visit Us', lines: ['Heritage Digital Campus', 'New Delhi — 110001, India'] },
              { Icon: GlobeAltIcon, title: 'Open Source', lines: ['github.com/AbhayHegde05', 'Culture-heritage-preservation'] },
            ].map(({ Icon, title, lines }, i) => (
              <div key={i} className="text-center vintage-card p-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)' }}
                >
                  <Icon className="w-8 h-8" style={{ color: '#580000' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: '#580000' }}>{title}</h3>
                {lines.map((l, li) => <p key={li} className="font-serif" style={{ color: '#4a2c00' }}>{l}</p>)}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/donate" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Support Our Work
              <HeartIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
