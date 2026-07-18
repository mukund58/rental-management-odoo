import axios from 'axios';

// Create configured axios instance
const api = axios.create({

  baseURL: 'http://10.206.143.170:5000/api',

  baseURL: 'http://localhost:5000/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add authorization bearer tokens
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

export default api;
