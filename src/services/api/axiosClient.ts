import axios from 'axios';
import { API_BASE_URL } from '../../config/env';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: any) => {
    // Add auth token if available
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      // Redirect to login or emit event
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
