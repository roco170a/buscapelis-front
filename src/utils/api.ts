import axios from 'axios';

// RCC Define the base API URL from environment variables
const API_URL = `${import.meta.env.VITE_API_URL}`;

// RCC Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RCC Interceptor to handle authentication tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RCC Interceptor to handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // RCC Centralized error handling
    if (error.response) {
      // RCC Server responded with a status code outside of 2xx range
      if (error.response.status === 401) {
        // RCC Expired or invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // RCC Here we could redirect to login if there's a global navigation system
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 