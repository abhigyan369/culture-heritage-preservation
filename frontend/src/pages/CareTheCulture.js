import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  MapPinIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { heritage, explore } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { categories } from '../config/constants';

// ── Gold Verified Badge ──────────────────────────────────────────────────────
const GoldVerifiedBadge = () => (
  <span className="gold-verified-badge">
    <ShieldCheckIcon style={{ width: 12, height: 12 }} />
    Verified
  </span>
);

const CareTheCulture = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch heritage sites (all sites are now published immediately)
  const { data: sitesData, isLoading, refetch } = useQuery(
    ['heritageSites', selectedCategory, searchQuery],
    () => heritage.getAll({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      limit: 20,
    }),
    { staleTime: 5 * 60 * 1000 }
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please log in to contribute heritage information');
      return;
    }

    try {
      const formData = new FormData();
      // Core cultural fields only — no internal IDs or DB-specific metadata
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('location[address]', data.address);
      formData.append('location[city]', data.city);
      formData.append('location[state]', data.state);
      formData.append('location[country]', 'India');
      formData.append('location[coordinates][latitude]', data.latitude);
      formData.append('location[coordinates][longitude]', data.longitude);
      formData.append('location[coordinates][type]', 'Point');
      formData.append('history[established]', data.established);
      formData.append('history[historicalSignificance]', data.historicalSignificance);
      if (data.architecture) formData.append('history[architecture]', data.architecture);
      if (data.culturalImportance) formData.append('history[culturalImportance]', data.culturalImportance);
      // status is enforced as 'pending' by the backend — not settable from UI
      imageFiles.forEach((file) => { formData.append('images', file); });

      await heritage.createWithImages(formData);
      toast.success('Thank you! Your contribution has been published successfully.');
      reset();
      setShowUploadForm(false);
      setImagePreviews([]);
      setImageFiles([]);
      
      // Invalidate relevant queries so Explore page fetches fresh data
      queryClient.invalidateQueries('searchSites');
      queryClient.invalidateQueries('recommendations');
      queryClient.invalidateQueries('topDestinations');
      queryClient.invalidateQueries('nearbySites');
      
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    }
  };

  const filteredSites = Array.isArray(sitesData?.data?.data)
    ? sitesData.data.data.filter(site =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF5E5' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 text-white"
        style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 60%, #4a0000 100%)' }}
      >
        {/* Mandala pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.5'%3E%3Cpath d='M30 30c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0-10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm10 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 gold-text"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Care for Our Culture
          </h1>
          <div
            className="mx-auto mb-6"
            style={{ width: 80, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}
          />
          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 font-serif drop-shadow-md"
            style={{ color: '#f5ead5' }}
          >
            Explore India's heritage shared by our community and contribute your knowledge
            to help preserve our cultural legacy for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all duration-200 font-bold"
              style={{ backgroundColor: '#D4AF37', color: '#580000' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b38728'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
            >
              <CloudArrowUpIcon className="w-5 h-5 mr-2" />
              Contribute a Heritage Site
            </button>
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all duration-200 font-bold"
              style={{ border: '2px solid #D4AF37', color: '#f5ead5' }}
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              Support Preservation
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contribution Modal ─────────────────────────────────────────────── */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="vintage-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="p-6 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.3)' }}
            >
              <div>
                <h2
                  className="text-2xl font-bold font-display"
                  style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}
                >
                  Contribute a Heritage Site
                </h2>
                <p className="text-sm font-serif mt-1" style={{ color: '#8a6a3a' }}>
                  Your contribution will be published immediately and visible to all users.
                </p>
              </div>
              <button
                onClick={() => setShowUploadForm(false)}
                className="p-2 rounded-lg transition-colors ml-4"
                style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
              >
                <XMarkIcon className="w-6 h-6" style={{ color: '#580000' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleUploadSubmit)} className="p-6 space-y-8">
              {/* ── Site Identity ───────────────────────────────────────── */}
              <section>
                <h3 className="text-base font-semibold font-display uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>
                  Site Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Site Name *
                    </label>
                    <input
                      {...register('name', { required: 'Site name is required' })}
                      className="input-field"
                      placeholder="e.g., Hampi Ruins, Dholavira"
                    />
                    {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Category *
                    </label>
                    <select {...register('category', { required: 'Category is required' })} className="input-field">
                      <option value="">Select category</option>
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-700 text-xs mt-1">{errors.category.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={3}
                      className="input-field"
                      placeholder="Describe the heritage site, its architecture, and what makes it culturally significant"
                    />
                    {errors.description && <p className="text-red-700 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              </section>

              {/* ── Historical Background ──────────────────────────────── */}
              <section>
                <h3 className="text-base font-semibold font-display uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>
                  Historical Background
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Establishment Period *
                    </label>
                    <input
                      {...register('established', { required: 'Establishment period is required' })}
                      className="input-field"
                      placeholder="e.g., 12th Century, 1750 CE, Ancient (pre-1000 BCE)"
                    />
                    {errors.established && <p className="text-red-700 text-xs mt-1">{errors.established.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Historical Significance *
                    </label>
                    <textarea
                      {...register('historicalSignificance', { required: 'Historical significance is required' })}
                      rows={3}
                      className="input-field"
                      placeholder="Describe the historical importance — events, rulers, battles, or cultural milestones associated with this site"
                    />
                    {errors.historicalSignificance && <p className="text-red-700 text-xs mt-1">{errors.historicalSignificance.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                        Architectural Style (Optional)
                      </label>
                      <input
                        {...register('architecture')}
                        className="input-field"
                        placeholder="e.g., Dravidian, Mughal, Colonial"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                        Cultural Importance (Optional)
                      </label>
                      <input
                        {...register('culturalImportance')}
                        className="input-field"
                        placeholder="e.g., Pilgrimage site, Festival venue"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Location ────────────────────────────────────────────── */}
              <section>
                <h3 className="text-base font-semibold font-display uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Address *
                    </label>
                    <input
                      {...register('address', { required: 'Address is required' })}
                      className="input-field"
                      placeholder="Village / Road / Landmark"
                    />
                    {errors.address && <p className="text-red-700 text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>City *</label>
                    <input {...register('city', { required: 'City is required' })} className="input-field" placeholder="City" />
                    {errors.city && <p className="text-red-700 text-xs mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>State *</label>
                    <input {...register('state', { required: 'State is required' })} className="input-field" placeholder="State" />
                    {errors.state && <p className="text-red-700 text-xs mt-1">{errors.state.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Latitude *
                      <span className="text-xs font-serif font-normal ml-1" style={{ color: '#8a6a3a' }}>(decimal degrees)</span>
                    </label>
                    <input
                      {...register('latitude', { required: 'Required' })}
                      type="number" step="any" className="input-field"
                      placeholder="e.g., 28.6139"
                    />
                    {errors.latitude && <p className="text-red-700 text-xs mt-1">{errors.latitude.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-display mb-2" style={{ color: '#580000' }}>
                      Longitude *
                      <span className="text-xs font-serif font-normal ml-1" style={{ color: '#8a6a3a' }}>(decimal degrees)</span>
                    </label>
                    <input
                      {...register('longitude', { required: 'Required' })}
                      type="number" step="any" className="input-field"
                      placeholder="e.g., 77.2090"
                    />
                    {errors.longitude && <p className="text-red-700 text-xs mt-1">{errors.longitude.message}</p>}
                  </div>
                </div>
              </section>

              {/* ── Images ──────────────────────────────────────────────── */}
              <section>
                <h3 className="text-base font-semibold font-display uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>
                  Images (up to 5)
                </h3>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                  style={{ borderColor: 'rgba(212,175,55,0.4)' }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'}
                >
                  <CloudArrowUpIcon className="w-10 h-10 mx-auto mb-3" style={{ color: '#D4AF37' }} />
                  <p className="font-serif mb-1" style={{ color: '#580000' }}>Click to upload images of the heritage site</p>
                  <p className="text-sm font-serif" style={{ color: '#8a6a3a' }}>JPG, PNG, WebP · Max 5 images</p>
                  <input
                    ref={fileInputRef}
                    type="file" multiple accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange} className="hidden"
                  />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview} alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg royal-border"
                        />
                        <button
                          type="button" onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: '#580000' }}
                        >
                          <XMarkIcon className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Publish Notice ────────────────────────────────────────── */}
              <div className="rounded-lg p-4 font-serif text-sm" style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', color: '#4a2c00' }}>
                🛡️ Your contribution will be published immediately and visible to all users. Please ensure all information is accurate and respectful of cultural heritage.
              </div>

              {/* ── Actions ─────────────────────────────────────────────── */}
              <div className="flex justify-end space-x-4 pt-2" style={{ borderTop: '1px solid rgba(212,175,55,0.25)' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-6 py-2 rounded-lg font-display text-xs uppercase tracking-wider transition-colors"
                  style={{ border: '1px solid rgba(212,175,55,0.4)', color: '#580000', backgroundColor: '#FFFFF0' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Search & Category Filter ───────────────────────────────────────── */}
      <section
        className="py-6 sticky top-0 z-10"
        style={{ backgroundColor: '#FCF5E5', borderBottom: '1px solid rgba(212,175,55,0.3)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#D4AF37' }} />
              <input
                type="text"
                placeholder="Search heritage sites by name or description…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg font-serif text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: '#FFFFF0',
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: '#2d1a00',
                }}
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg font-display text-xs uppercase tracking-wider focus:outline-none"
              style={{
                backgroundColor: '#FFFFF0',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#580000',
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Heritage Sites Grid ────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }} />
                  <div className="p-6 space-y-3">
                    <div className="h-6 rounded" style={{ backgroundColor: 'rgba(212,175,55,0.12)' }} />
                    <div className="h-4 rounded" style={{ backgroundColor: 'rgba(212,175,55,0.08)' }} />
                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'rgba(212,175,55,0.08)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-16">
              <BuildingLibraryIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(212,175,55,0.5)' }} />
              <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: '#580000' }}>
                {searchQuery ? 'No sites match your search' : 'No heritage sites yet'}
              </h3>
              <p className="mb-6 font-serif" style={{ color: '#8a6a3a' }}>
                {searchQuery ? 'Try different keywords or clear the search.' : 'Be the first to document a heritage site!'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Heritage Site
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-display" style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}>
                  Heritage Sites ({filteredSites.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm font-serif" style={{ color: '#580000' }}>
                  <span>Community contributions</span>
                  <HeartIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSites.map((site) => (
                  <div
                    key={site._id}
                    className="card group hover:scale-105 transition-transform duration-300"
                    style={{ border: '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <img
                        src={site.images?.[0]?.url || 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Rating badge */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                        <StarIconSolid className="w-3 h-3" style={{ color: '#D4AF37' }} />
                        <span className="text-xs font-display text-white">{site.ratings.average.toFixed(1)}</span>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-display uppercase tracking-wider"
                          style={{ backgroundColor: '#580000', color: '#f5ead5' }}
                        >
                          {site.category.replace('_', ' ')}
                        </span>
                      </div>
                      {/* Verified badge */}
                      {site.verified && (
                        <div className="absolute bottom-3 left-3">
                          <GoldVerifiedBadge />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-xs mb-2 font-serif" style={{ color: '#D4AF37' }}>
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {site.location.city}, {site.location.state}
                      </div>
                      <h3
                        className="text-lg font-semibold mb-2 font-display group-hover:opacity-80 transition-opacity"
                        style={{ color: '#580000' }}
                      >
                        {site.name}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-2 font-serif" style={{ color: '#4a2c00' }}>
                        {site.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/heritage/${site._id}`}
                          className="inline-flex items-center text-xs font-display uppercase tracking-wider transition-colors"
                          style={{ color: '#D4AF37' }}
                        >
                          Explore Site
                          <ArrowRightIcon className="w-3 h-3 ml-1" />
                        </Link>
                        {site.contributedBy && (
                          <span className="text-xs font-serif" style={{ color: '#8a6a3a' }}>
                            by {site.contributedBy.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CareTheCulture;
