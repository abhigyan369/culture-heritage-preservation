import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  CameraIcon,
  PencilIcon,
  CheckCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { auth, donations, heritage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile: updateUserProfile } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('contributions');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Fetch user's donations
  const { data: donationsData, isLoading: donationsLoading } = useQuery(
    'myDonations',
    () => donations.getMyDonations(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch user's contributed heritage sites
  const { data: contributedSites, isLoading: sitesLoading } = useQuery(
    'myContributedSites',
    () => heritage.getAll({ contributedBy: user?._id || user?.id }),
    {
      enabled: !!(user?._id || user?.id),
      staleTime: 5 * 60 * 1000,
    }
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(auth.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('profile');
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleProfileUpdate = (data) => {
    updateProfileMutation.mutate(data);
  };

  const deleteSiteMutation = useMutation((id) => heritage.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('myContributedSites');
      queryClient.invalidateQueries('heritageSites');
      queryClient.invalidateQueries('searchSites');
      toast.success('Site deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete site');
    }
  });

  const handleDeleteSite = (id) => {
    if (window.confirm('Are you sure you want to delete this heritage site? This action cannot be undone.')) {
      deleteSiteMutation.mutate(id);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      reset({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const donationsList = Array.isArray(donationsData?.data?.data) ? donationsData.data.data : [];
  const contributedSitesList = Array.isArray(contributedSites?.data?.data) ? contributedSites.data.data : [];

  const stats = {
    totalDonations: donationsList.reduce((sum, d) => sum + (d.amount || 0), 0),
    donationCount: donationsList.length,
    contributedSites: contributedSitesList.length,
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-primary-600" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                <CameraIcon className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-primary-600">₹{stats.totalDonations.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Donated</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-primary-600">{stats.donationCount}</div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-primary-600">{stats.contributedSites}</div>
                  <div className="text-sm text-gray-600">Contributions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-primary-600">{stats.joinedDate}</div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSubmit(handleProfileUpdate)} className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="input-field"
                  />
                  {errors.name && (
                    <p className="text-red-700 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input-field"
                  />
                  {errors.email && (
                    <p className="text-red-700 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-red-700 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'contributions', label: 'My Contributions', icon: BuildingLibraryIcon },
                { id: 'donations', label: 'Donation History', icon: CurrencyDollarIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Contributions Tab */}
            {activeTab === 'contributions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Heritage Sites Contributed</h3>
                {sitesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : contributedSitesList.length > 0 ? (
                  <div className="space-y-4">
                    {contributedSitesList.map((site) => (
                      <div key={site._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{site.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                site.verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {site.verified ? 'Verified' : 'Pending Review'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{site.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{site.location.city}, {site.location.state}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(site.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <a href={`/heritage/${site._id}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm text-right">
                              View Details
                            </a>
                            <button 
                              onClick={() => handleDeleteSite(site._id)}
                              disabled={deleteSiteMutation.isLoading}
                              className="text-red-600 hover:text-red-700 font-medium text-sm text-right disabled:opacity-50"
                            >
                              {deleteSiteMutation.isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BuildingLibraryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No contributions yet</h4>
                    <p className="text-gray-600 mb-4">
                      Start contributing heritage sites to help preserve our cultural legacy.
                    </p>
                    <a
                      href="/care-the-culture"
                      className="btn-primary inline-flex items-center"
                    >
                      <BuildingLibraryIcon className="w-5 h-5 mr-2" />
                      Contribute a Site
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h3>
                {donationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : donationsList.length > 0 ? (
                  <div className="space-y-4">
                    {donationsList.map((donation) => (
                      <div key={donation._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">₹{donation.amount.toLocaleString()}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                donation.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : donation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </span>
                              {donation.isAnonymous && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                  Anonymous
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              Type: {donation.donationType.replace('_', ' ')}
                            </p>
                            {donation.heritageSite && (
                              <p className="text-gray-600 text-sm mb-2">
                                Site: {donation.heritageSite.name}
                              </p>
                            )}
                            {donation.message && (
                              <p className="text-gray-600 text-sm italic mb-2">"{donation.message}"</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CurrencyDollarIcon className="w-4 h-4" />
                                <span>{donation.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                          {donation.status === 'completed' && (
                            <div className="ml-4">
                              <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CurrencyDollarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h4>
                    <p className="text-gray-600 mb-4">
                      Your donations help preserve heritage sites for future generations.
                    </p>
                    <a
                      href="/donate"
                      className="btn-primary inline-flex items-center"
                    >
                      <HeartIcon className="w-5 h-5 mr-2" />
                      Make a Donation
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
