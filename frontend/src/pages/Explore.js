import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useForm } from 'react-hook-form';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  HeartIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { explore, heritage } from '../services/api';
import { categories } from '../config/constants';
import 'leaflet/dist/leaflet.css';

// ── Gold Verified Badge ────────────────────────────────────────────
const GoldVerifiedBadge = () => (
  <span className="gold-verified-badge">
    <ShieldCheckIcon style={{ width: 12, height: 12 }} />
    Verified
  </span>
);


// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map component for auto-centering
const MapController = ({ sites, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (sites && sites.length > 0) {
      const bounds = L.latLngBounds(sites.map(site => [site.location.coordinates.latitude, site.location.coordinates.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 10);
    }
  }, [sites, userLocation, map]);

  return null;
};

// Search This Area button component
const SearchThisAreaButton = ({ onSearchArea }) => {
  const map = useMapEvents({
    moveend: () => {
      // Map moved, could trigger re-search
    },
  });

  return (
    <button
      onClick={onSearchArea}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white text-primary-600 font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-primary-50 transition-colors flex items-center space-x-2"
    >
      <MagnifyingGlassIcon className="w-4 h-4" />
      <span>Search this area</span>
    </button>
  );
};

const Explore = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [viewMode, setViewMode] = useState('grid'); // grid, map, list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [mapSites, setMapSites] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [boundsSites, setBoundsSites] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchedValues = watch();

  // Get user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);


  // Search query
  const searchQuery = {
    q: watchedValues.query,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    city: watchedValues.city,
    state: watchedValues.state,
    minRating: watchedValues.minRating,
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    maxDistance: watchedValues.maxDistance,
  };

  // Fetch search results
  const { data: searchSites, isLoading: searchLoading } = useQuery(
    ['searchSites', searchQuery],
    () => explore.search(searchQuery),
    {
      enabled: activeTab === 'search' ? true : false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery(
    ['recommendations', selectedCategory, userLocation],
    () => explore.getRecommendations({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
    }),
    {
      enabled: activeTab === 'recommendations' ? true : false,
      staleTime: 10 * 60 * 1000,
    }
  );

  // Fetch top destinations
  const { data: topDestinations, isLoading: topLoading } = useQuery(
    'topDestinations',
    () => explore.getTopDestinations({ limit: 12 }),
    {
      enabled: activeTab === 'top' ? true : false,
      staleTime: 15 * 60 * 1000,
    }
  );

  // Fetch nearby sites
  const { data: nearbySites, isLoading: nearbyLoading } = useQuery(
    ['nearbySites', userLocation],
    () => heritage.getNearby({
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      maxDistance: 50000, // 50km
    }),
    {
      enabled: (activeTab === 'nearby' && userLocation) ? true : false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'search':
        return { data: searchSites?.data?.data, loading: searchLoading };
      case 'recommendations':
        return { data: recommendations?.data?.data, loading: recommendationsLoading };
      case 'top':
        return { data: topDestinations?.data?.data, loading: topLoading };
      case 'nearby':
        return { data: nearbySites?.data?.data, loading: nearbyLoading };
      default:
        return { data: [], loading: false };
    }
  };

  const { data: currentData, loading } = getCurrentData();

  // Handle search
  const handleSearch = (data) => {
    // Search is handled by the useQuery hook automatically when searchQuery changes
  };

  // Handle search this area on map
  const handleSearchArea = useCallback(async () => {
    if (!mapRef) return;
    const bounds = mapRef.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    try {
      const res = await heritage.searchBounds({
        southWestLng: southWest.lng,
        southWestLat: southWest.lat,
        northEastLng: northEast.lng,
        northEastLat: northEast.lat,
      });
      setBoundsSites(res.data.data || []);
      setMapSites(res.data.data || []);
    } catch (err) {
      // Silently handle
    }
  }, [mapRef]);

  // Update map sites when data changes
  useEffect(() => {
    if (currentData && viewMode === 'map') {
      setMapSites(currentData.slice(0, 50)); // Limit to 50 markers for performance
    }
  }, [currentData, viewMode]);

  const SiteCard = ({ site }) => (
    <div className="card group hover:scale-105 transition-transform duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={site.images?.[0]?.url || 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={site.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <StarIconSolid className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{site.ratings.average.toFixed(1)}</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium capitalize font-display text-xs uppercase tracking-wider"
            style={{ backgroundColor: '#580000', color: '#f5ead5' }}
          >
            {site.category.replace('_', ' ')}
          </span>
          {site.verified && <GoldVerifiedBadge />}
        </div>
        {site.distance && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {site.distance} km away
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {site.location.city}, {site.location.state}
          </div>
        </div>
        <h3 className="text-xl font-semibold font-display mb-2 group-hover:text-accent-500 transition-colors" style={{ color: '#580000' }}>
          {site.name}
        </h3>
        <p className="text-secondary-600 mb-4 line-clamp-2 font-serif">
          {site.description}
        </p>
        <div className="flex items-center justify-between">
          <Link
            to={`/heritage/${site._id}`}
            className="inline-flex items-center font-medium font-display text-xs uppercase tracking-wider transition-colors"
            style={{ color: '#D4AF37' }}
          >
            Explore Site
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
          <div className="flex items-center space-x-1 text-sm" style={{ color: '#580000' }}>
            <StarIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span>{site.ratings.count} reviews</span>
          </div>
        </div>
      </div>
    </div>
  );

  const SiteListItem = ({ site }) => (
    <div className="vintage-card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 h-32 md:h-auto overflow-hidden rounded-lg">
          <img
            src={site.images?.[0]?.url || 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
            alt={site.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span
                  className="px-2 py-1 rounded-full text-xs font-display uppercase tracking-wider capitalize"
                  style={{ backgroundColor: 'rgba(88,0,0,0.08)', color: '#580000', border: '1px solid rgba(88,0,0,0.2)' }}
                >
                  {site.category.replace('_', ' ')}
                </span>
                {site.status === 'active' && <GoldVerifiedBadge />}
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <StarIconSolid className="w-4 h-4 text-yellow-500" />
                  <span>{site.ratings.average.toFixed(1)}</span>
                  <span>({site.ratings.count})</span>
                </div>
                {site.distance && (
                  <span className="text-sm text-gray-500">{site.distance} km away</span>
                )}
              </div>
              <h3 className="text-xl font-semibold font-display mb-2" style={{ color: '#580000' }}>{site.name}</h3>
              <div className="flex items-center text-secondary-600 text-sm mb-2 font-serif">
                <MapPinIcon className="w-4 h-4 mr-1" style={{ color: '#D4AF37' }} />
                {site.location.address}, {site.location.city}, {site.location.state}
              </div>
            </div>
            <Link
              to={`/heritage/${site._id}`}
              className="btn-primary text-sm px-4 py-2"
            >
              Explore
            </Link>
          </div>
          <p className="text-secondary-600 line-clamp-2 font-serif">{site.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF5E5' }}>
      {/* Hero Section */}
      <section className="relative py-16 text-white" style={{ background: 'linear-gradient(135deg, #720e0e 0%, #5a0b0b 100%)' }}>
        <div className="absolute inset-0" style={{ opacity: 0.1, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0-10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm10 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-10 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm10 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display gold-foil-text">
              Explore Heritage Sites
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-100">
              Discover magnificent temples, serene lakes, ancient forts, and more.
              Find your next cultural adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'search', label: 'Search', icon: MagnifyingGlassIcon },
                { id: 'recommendations', label: 'For You', icon: HeartIcon },
                { id: 'top', label: 'Top Rated', icon: StarIcon },
                { id: 'nearby', label: 'Nearby', icon: MapPinIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <GlobeAltIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Form */}
          {activeTab === 'search' && (
            <form onSubmit={handleSubmit(handleSearch)} className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('query')}
                    type="text"
                    placeholder="Search heritage sites, cities, or states..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <select
                  {...register('category')}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  <span>Filters</span>
                </button>

                <button type="submit" className="btn-primary">
                  Search
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      {...register('city')}
                      type="text"
                      placeholder="Enter city"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      {...register('state')}
                      type="text"
                      placeholder="Enter state"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                    <select {...register('minRating')} className="input-field">
                      <option value="">Any rating</option>
                      <option value="4">4+ stars</option>
                      <option value="4.5">4.5+ stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Distance (km)</label>
                    <input
                      {...register('maxDistance')}
                      type="number"
                      placeholder="50"
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display mb-6" style={{ color: '#580000' }}>
              {activeTab === 'search' && 'Search Results'}
              {activeTab === 'recommendations' && 'Recommended for You'}
              {activeTab === 'top' && 'Top Rated Heritage Sites'}
              {activeTab === 'nearby' && 'Heritage Sites Near You'}
              {currentData && ` (${currentData.length})`}
            </h2>

            {userLocation && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-1" />
                Location detected
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && !loading && currentData && currentData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 relative">
              <div className="h-96 lg:h-[600px]">
                <MapContainer
                  center={[20.5937, 78.9629]} // Center of India
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={(map) => setMapRef(map)}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapController sites={mapSites} userLocation={userLocation} />
                  <SearchThisAreaButton onSearchArea={handleSearchArea} />
                  {mapSites.map((site) => (
                    <Marker
                      key={site._id}
                      position={[site.location.coordinates.latitude, site.location.coordinates.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-sm mb-1">{site.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">{site.location.city}</p>
                          <Link
                            to={`/heritage/${site._id}`}
                            className="text-primary-600 text-xs font-medium hover:underline"
                          >
                            View Details →
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && !loading && currentData && currentData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentData.map((site) => (
                <SiteCard key={site._id} site={site} />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && !loading && currentData && currentData.length > 0 && (
            <div className="space-y-4">
              {currentData.map((site) => (
                <SiteListItem key={site._id} site={site} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && (!currentData || currentData.length === 0) && (
            <div className="text-center py-12">
              <BuildingLibraryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No heritage sites found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'search'
                  ? 'Try adjusting your search terms or filters'
                  : activeTab === 'nearby'
                    ? 'No heritage sites found near your location'
                    : 'Check back later for new additions'}
              </p>
              <Link
                to="/care-the-culture"
                className="btn-primary inline-flex items-center"
              >
                <BuildingLibraryIcon className="w-5 h-5 mr-2" />
                Contribute a Heritage Site
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Explore;
