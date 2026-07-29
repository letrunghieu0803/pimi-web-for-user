import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3333/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach authorization bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pimi_tenant_auth_token') || localStorage.getItem('pimi_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap data and normalize errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data?.error || error)
);
