import axios from 'axios';

// Create base API instance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = api;
export const heritageAPI = api;
export const donationAPI = api;
export const exploreAPI = api;

// Specific API functions
export const auth = {
  login: (credentials) => authAPI.post('/auth/login', credentials),
  register: (userData) => authAPI.post('/auth/register', userData),
  getProfile: () => authAPI.get('/auth/profile'),
  updateProfile: (userData) => authAPI.put('/auth/profile', userData),
};

export const heritage = {
  getAll: (params) => heritageAPI.get('/heritage', { params }),
  getById: (id) => heritageAPI.get(`/heritage/${id}`),
  create: (data) => heritageAPI.post('/heritage', data),
  createWithImages: (formData) => heritageAPI.post('/heritage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => heritageAPI.put(`/heritage/${id}`, data),
  delete: (id) => heritageAPI.delete(`/heritage/${id}`),
  verify: (id) => heritageAPI.patch(`/heritage/${id}/verify`),
  reject: (id) => heritageAPI.patch(`/heritage/${id}/reject`),
  addReview: (id, data) => heritageAPI.post(`/heritage/${id}/reviews`, data),
  getNearby: (params) => heritageAPI.get('/heritage/nearby', { params }),
  getStats: () => heritageAPI.get('/heritage/stats'),
  searchBounds: (params) => heritageAPI.get('/heritage/search-bounds', { params }),
  externalSearch: (params) => heritageAPI.get('/heritage/external-search', { params }),
};

export const donations = {
  createPaymentIntent: (data) => donationAPI.post('/donations/create-payment-intent', data),
  processDonation: (data) => donationAPI.post('/donations', data),
  getMyDonations: (params) => donationAPI.get('/donations/my-donations', { params }),
  getDonations: (params) => donationAPI.get('/donations', { params }),
  getStats: () => donationAPI.get('/donations/stats'),
};

export const explore = {
  search: (params) => exploreAPI.get('/explore/search', { params }),
  getRecommendations: (params) => exploreAPI.get('/explore/recommendations', { params }),
  getCategories: () => exploreAPI.get('/explore/categories'),
  getTopDestinations: (params) => exploreAPI.get('/explore/top-destinations', { params }),
  getSitesByLocation: (params) => exploreAPI.get('/explore/locations', { params }),
};

export default api;
