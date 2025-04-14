// src/services/API.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://career-path-guidelines-backend.onrender.com/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to each request
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Optionally redirect to login or handle token refresh
      // For now, just logging out
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;