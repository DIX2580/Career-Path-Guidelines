// src/services/api.js

import axios from 'axios';

// Create an axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://career-path-guidelines-backend.onrender.com',
});

// Add authorization header with JWT token for authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User authentication API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getProfile: () => API.get('/auth/me'),
  guestLogin: () => API.get('/auth/guest-login'),
  updateProfile: (userData) => API.put('/auth/update-profile', userData),
};

// User career API calls
export const careerAPI = {
  createCareerInfo: (careerData) => API.post('/user-career', careerData),
  getCareerInfo: (id) => API.get(`/user-career/${id}`),
  getAllCareerInfo: () => API.get('/user-career'),
  updateCareerInfo: (id, careerData) => API.put(`/user-career/${id}`, careerData),
};

export default API;