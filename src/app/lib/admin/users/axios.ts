'use client';
import axios from 'axios';

export const apiURL = process.env.NEXT_PUBLIC_APIENDPOINT_URL as string

const axiosInstance = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk request
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Tambahkan interceptor untuk response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login?expired=true'; // Redirect menggunakan App Router
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;