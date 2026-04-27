import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  InformationCircleIcon,
  HeartIcon,
  CurrencyDollarIcon,
  MapIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Care the Culture', href: '/care-the-culture', icon: HeartIcon },
    { name: 'Donate', href: '/donate', icon: CurrencyDollarIcon },
    { name: 'Explore', href: '/explore', icon: MapIcon },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-accent-500 ${isScrolled
          ? 'bg-primary-600/98 backdrop-blur-md shadow-lg'
          : 'bg-primary-600 shadow-md'
        }`}
      style={{ backgroundColor: '#580000' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center group-hover:bg-accent-600 transition-colors border border-accent-600">
              <HeartIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white font-display tracking-wider">INDIAN HERITAGE</h1>
              <p className="text-xs text-accent-200 font-serif">Preserving India's Treasures</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 font-display uppercase tracking-widest ${isActive
                      ? 'text-accent-500 bg-primary-700'
                      : 'text-white hover:text-accent-500 hover:bg-primary-700'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-yellow-300 hover:text-yellow-400 hover:bg-primary-700 transition-all duration-200 font-display uppercase tracking-widest"
                  >
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span className="hidden md:block">Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-white hover:text-accent-500 hover:bg-primary-700 transition-all duration-200 font-display uppercase tracking-widest"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden md:block">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-accent-300 hover:text-accent-500 hover:bg-primary-700 transition-all duration-200 font-display uppercase tracking-widest"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="hidden md:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin/login"
                  className="px-4 py-2 text-xs font-medium text-yellow-300 hover:text-yellow-400 transition-colors font-display uppercase tracking-widest flex items-center"
                >
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  Admin
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-medium text-accent-300 hover:text-accent-500 transition-colors font-display uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-primary-700 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-accent-500 py-4" style={{ backgroundColor: '#580000' }}>
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 font-display uppercase tracking-wider ${isActive
                        ? 'text-accent-500 bg-primary-700'
                        : 'text-white hover:text-accent-500 hover:bg-primary-700'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="border-t border-accent-500 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-yellow-300 hover:text-yellow-400 hover:bg-primary-700 transition-all duration-200 font-display uppercase tracking-wider"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-white hover:text-accent-500 hover:bg-primary-700 transition-all duration-200 font-display uppercase tracking-wider"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Profile ({user?.name})</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-accent-300 hover:text-accent-500 hover:bg-primary-700 transition-all duration-200 font-display uppercase tracking-wider"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link
                      to="/admin/login"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-yellow-300 hover:text-yellow-400 transition-colors font-display uppercase tracking-wider flex items-center justify-center"
                    >
                      <ShieldCheckIcon className="w-4 h-4 mr-1" />
                      Admin Login
                    </Link>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-accent-300 hover:text-accent-500 transition-colors font-display uppercase tracking-wider"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center btn-primary text-sm px-4 py-3"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
