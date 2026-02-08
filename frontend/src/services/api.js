import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
// OR if deployed:
// const API_URL = 'https://your-backend-url.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
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

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Attendance APIs
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getMyAttendance: () => api.get('/attendance/my-attendance'),
  generateQR: (data) => api.post('/attendance/generate-qr', data),
  getTeacherSessions: () => api.get('/attendance/teacher/sessions'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: () => api.get('/admin/students'),
  getDefaulters: () => api.get('/admin/defaulters'),
  getReport: (params) => api.get('/admin/attendance-report', { params }),
};

export default api;