import api from './api';

export const authService = {
  // Auth
  register:        (data)  => api.post('/auth/register', data),
  login:           (data)  => api.post('/auth/login', data),
  logout:          ()      => { localStorage.removeItem('token'); localStorage.removeItem('user'); },
  forgotPassword:  (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP:       (data)  => api.post('/auth/verify-otp', data),
  resendOTP:       (data)  => api.post('/auth/resend-otp', data),
  resetPassword:   (data)  => api.post('/auth/reset-password', data),

  // Profile
  getMe:           ()      => api.get('/auth/me'),
  getProfile:      ()      => api.get('/users/profile'),
  updateProfile:   (data)  => api.put('/users/profile', data),
};
