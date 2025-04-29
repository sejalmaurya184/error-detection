import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  signup: (userData) => api.post('/users/signup', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

export const recordService = {
  createRecord: (recordData) => api.post('/records', recordData),
  getRecords: () => api.get('/records'),
  getRecord: (id) => api.get(`/records/${id}`),
  updateRecord: (id, recordData) => api.put(`/records/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/records/${id}`),
  uploadFiles: (recordId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post(`/records/${recordId}/files`, formData);
  },
  getFiles: (recordId) => api.get(`/records/${recordId}/files`)
};

export const userService = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  getLoginHistory: () => api.get('/users/login-history'),
  getUserProfile: () => api.get('/users/profile')
}; 