import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BuildingLibraryIcon,
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Heritage Sites', href: '/admin/heritage-sites', icon: BuildingLibraryIcon },
    { name: 'Pending Review', href: '/admin/pending', icon: ClockIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-red-900 text-white">
        <div className="flex items-center justify-center h-16 bg-red-950">
          <BuildingLibraryIcon className="w-8 h-8 text-yellow-500" />
          <span className="ml-2 text-xl font-bold">Admin Panel</span>
        </div>

        <nav className="mt-8 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-300 hover:bg-red-800 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-950">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-red-900 font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {navigation.find(n => window.location.pathname.startsWith(n.href))?.name || 'Dashboard'}
          </h1>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
