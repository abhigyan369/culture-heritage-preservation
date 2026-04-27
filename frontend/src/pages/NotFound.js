import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been removed, 
          renamed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full inline-flex items-center justify-center"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Looking for something specific?
          </h3>
          <div className="space-y-2 text-sm">
            <Link
              to="/explore"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              → Explore Heritage Sites
            </Link>
            <Link
              to="/care-the-culture"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              → Contribute Heritage Information
            </Link>
            <Link
              to="/donate"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              → Make a Donation
            </Link>
            <Link
              to="/about"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              → Learn About Our Mission
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <a href="mailto:info@cultureheritage.org" className="text-primary-600 hover:text-primary-700 font-medium">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
