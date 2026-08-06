import axios from 'axios';

// Create dedicated Axios instance for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach Bearer token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user storage if token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { full_name, email, password, confirm_password }
   */
  async signup(userData) {
    const response = await api.post('/auth/signup', {
      full_name: userData.fullName || userData.full_name,
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirmPassword || userData.confirm_password,
    });
    return response.data;
  },

  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Upload profile avatar directly to Cloudinary via FastAPI backend
   * @param {File} file - Image file to upload
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default authService;
