// API Configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
      verifyEmail: '/api/auth/verify-email',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
    },
    user: {
      profile: '/api/users/profile',
      updateProfile: '/api/users/profile',
      changePassword: '/api/users/change-password',
    },
    health: {
      monitoring: '/api/health/monitoring',
      addReading: '/api/health/monitoring',
      getReadings: '/api/health/monitoring/history',
    },
    symptoms: {
      check: '/api/symptoms/check',
      history: '/api/symptoms/history',
    },
    emergency: {
      call: '/api/emergency/call',
      contacts: '/api/emergency/contacts',
    },
    nutrition: {
      plans: '/api/nutrition/plans',
      meals: '/api/nutrition/meals',
    },
    content: {
      educational: '/api/content/educational',
      byCategory: (category: string) => `/api/content/educational?category=${category}`,
    },
  },
};

export default config;
