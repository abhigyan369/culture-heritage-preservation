import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  HeartIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { heritage, explore } from '../services/api';

// ── Gold Verified Badge used in cards ──────────────────────────────────────
const GoldVerifiedBadge = () => (
  <span className="gold-verified-badge">
    <ShieldCheckIcon style={{ width: 12, height: 12 }} />
    Verified
  </span>
);

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured heritage sites
  const { data: featuredSites, isLoading: featuredLoading } = useQuery(
    'featuredSites',
    () => explore.getTopDestinations({ limit: 6 }),
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch statistics from the API
  const { data: stats } = useQuery(
    'heritageStats',
    () => heritage.getStats(),
    { staleTime: 10 * 60 * 1000 }
  );

  // Hero slider data — Indian Heritage Focus
  const heroSlides = [
    {
      title: 'Ram Mandir — The Divine Abode of Ayodhya',
      description: "Witness the grandeur of the newly consecrated Ram Mandir in Ayodhya — a timeless symbol of devotion, heritage, and India's spiritual legacy.",
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ram_Mandir_Ayodhya_Jan_2024.jpg/1280px-Ram_Mandir_Ayodhya_Jan_2024.jpg',
      cta: 'Explore Ram Mandir',
      link: '/explore?category=temple',
    },
    {
      title: 'Varanasi — The Eternal City of Light',
      description: "Immerse yourself in the sacred Ganga Aarti, ancient ghats, and the timeless spiritual energy of the world's oldest living city.",
      image: 'https://images.unsplash.com/photo-1561361058-4f4f93480940?q=80&w=1920&auto=format&fit=crop',
      cta: 'Discover Varanasi',
      link: '/explore?category=lake',
    },
    {
      title: "Amer Fort — Rajasthan's Royal Glory",
      description: "Step back in time and witness the grandeur of Rajasthan's majestic hill forts and palaces.",
      image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      cta: 'View Forts',
      link: '/explore?category=fort',
    },
  ];

  // Auto-rotate hero slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const features = [
    {
      icon: BuildingLibraryIcon,
      title: 'Rich Heritage Database',
      description: 'Comprehensive information about thousands of heritage sites with detailed historical context.',
    },
    {
      icon: MapPinIcon,
      title: 'Interactive Maps',
      description: 'Navigate and explore heritage sites with our advanced mapping and location services.',
    },
    {
      icon: HeartIcon,
      title: 'Preservation Efforts',
      description: 'Support and contribute to the preservation of our cultural heritage for future generations.',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Join a community of heritage enthusiasts and contribute your knowledge and experiences.',
    },
  ];

  // Stats drawn from live API data — no hardcoded values
  const statsData = [
    { label: 'Heritage Sites', value: stats?.data?.totalVerified ?? 0, icon: BuildingLibraryIcon },
    { label: 'Categories', value: stats?.data?.categoryBreakdown?.length ?? 0, icon: GlobeAltIcon },
    { label: 'Contributors', value: stats?.data?.totalContributors ?? 0, icon: UserGroupIcon },
    { label: 'Sites Preserved', value: stats?.data?.totalVerified ?? 0, icon: HeartIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Dark maroon overlay */}
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(88, 0, 0, 0.55)' }} />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Thin gold ornament line */}
            <div
              className="mx-auto mb-6"
              style={{
                width: 80,
                height: 2,
                background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
              }}
            />
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in gold-text"
              style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.15, letterSpacing: '0.02em' }}
            >
              {heroSlides[currentSlide].title}
            </h1>
            <div
              className="mx-auto mb-6"
              style={{
                width: 80,
                height: 2,
                background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
              }}
            />
            <p
              className="text-xl md:text-2xl mb-10 animate-slide-up font-serif drop-shadow-md"
              style={{ color: '#f5ead5' }}
            >
              {heroSlides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to={heroSlides[currentSlide].link}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {heroSlides[currentSlide].cta}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/about"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
                style={{ borderColor: '#D4AF37', color: '#f5ead5' }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>


      </section>

      {/* ── Stats Section ────────────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 100%)', color: '#FCF5E5' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4" style={{ color: '#D4AF37' }} />
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-display uppercase tracking-widest text-sm" style={{ color: '#f5ead5' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="py-20 parchment-section" style={{ backgroundColor: '#FCF5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4" style={{ color: '#580000' }}>
              Discover India's Rich Heritage
            </h2>
            <div
              className="mx-auto mt-3 mb-6"
              style={{
                width: 60,
                height: 2,
                background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
              }}
            />
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-serif">
              Explore the land of ancient traditions, magnificent architecture, and diverse cultural treasures that span millennia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 royal-border shadow-inner"
                    style={{ backgroundColor: '#FFFFF0' }}
                  >
                    <Icon
                      className="w-9 h-9 transition-colors duration-300"
                      style={{ color: '#580000' }}
                    />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3" style={{ color: '#580000' }}>
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed font-serif">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Heritage Sites ────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#f5ead5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4" style={{ color: '#580000' }}>
              Featured Indian Heritage Sites
            </h2>
            <div
              className="mx-auto mt-3 mb-6"
              style={{
                width: 60,
                height: 2,
                background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
              }}
            />
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-serif">
              Discover India's UNESCO World Heritage Sites and architectural wonders from Kashmir to Kanyakumari.
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 skeleton-image" />
                  <div className="p-6">
                    <div className="skeleton-title rounded" />
                    <div className="skeleton-text rounded" />
                    <div className="skeleton-text rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(featuredSites?.data?.data) ? featuredSites.data.data.slice(0, 6).map((site) => (
                <div key={site._id} className="card group hover:scale-105 transition-transform duration-300">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={site.images?.[0]?.url || 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Rating Badge */}
                    <div
                      className="absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full border"
                      style={{ backgroundColor: 'rgba(255,255,240,0.95)', borderColor: '#D4AF37' }}
                    >
                      <div className="flex items-center space-x-1">
                        <StarIconSolid className="w-4 h-4" style={{ color: '#D4AF37' }} />
                        <span className="text-sm font-medium" style={{ color: '#580000' }}>
                          {site.ratings.average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {/* Verified Badge */}
                    {site.status === 'active' && (
                      <div className="absolute top-4 left-4">
                        <GoldVerifiedBadge />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium font-sans capitalize" style={{ color: '#D4AF37' }}>
                        {site.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center text-secondary-500 text-sm font-sans">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {site.location.city}
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2" style={{ color: '#580000' }}>
                      {site.name}
                    </h3>
                    <p className="text-secondary-700 mb-4 line-clamp-2 font-serif leading-relaxed">
                      {site.description}
                    </p>
                    <Link
                      to={`/heritage/${site._id}`}
                      className="inline-flex items-center font-medium font-display text-sm uppercase tracking-wider transition-colors"
                      style={{ color: '#D4AF37' }}
                    >
                      Explore Site
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 col-span-3">
                  <p className="text-secondary-600 font-serif">No heritage sites available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/explore" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              View All Sites
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 60%, #D4AF37 200%)', color: '#FCF5E5' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 gold-text"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Preserve India's Cultural Heritage
          </h2>
          <p className="text-xl mb-10 font-serif leading-relaxed" style={{ color: '#f5ead5' }}>
            Join us in protecting India's timeless treasures for future generations.{' '}
            Your contribution helps safeguard our shared heritage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="font-bold font-display py-4 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center shadow-lg uppercase tracking-wider"
              style={{ backgroundColor: '#D4AF37', color: '#580000' }}
            >
              Make a Donation
              <HeartIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/care-the-culture"
              className="font-bold font-display py-4 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center uppercase tracking-wider"
              style={{ border: '2px solid #D4AF37', color: '#f5ead5' }}
            >
              Contribute Information
              <PlayIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
