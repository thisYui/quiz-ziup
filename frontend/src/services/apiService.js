import axios from 'axios';

// Base URL for the backend API - adjust based on environment
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5173';

// Create an Axios instance with default configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header with the JWT token
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Auth API methods
export const authApi = {
  login: async (email, password, rememberMe = false, deviceInfo = {}) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      remember_me: rememberMe,
      jwt_token: deviceInfo,
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (email, password, birthDate) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      birth_date: birthDate,
    });
    return response.data;
  },

  sendOtp: async (email) => {
    const response = await apiClient.post('/auth/send_otp', { email });
    return response.data;
  },

  confirmOtp: async (email, otp) => {
    const response = await apiClient.post('/auth/confirm_otp', { email, otp });
    return response.data;
  },

  logout: async (jti, device, ipAddress, userAgent) => {
    const response = await apiClient.delete('/auth/logout', {
      data: { jti, device, ip_address: ipAddress, user_agent: userAgent },
    });
    setAuthToken(null);
    localStorage.removeItem('token');
    return response.data;
  },
};

// Quiz API methods - placeholder for future implementation
export const quizApi = {
  join: async (data) => {
    const response = await apiClient.post('/quiz/join', data);
    return response.data;
  },
  submitAnswer: async (data) => {
    const response = await apiClient.post('/quiz/submit_answer', data);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/quiz/create', data);
    return response.data;
  },
  // Additional quiz endpoints can be added here as needed
};

// Account API methods - placeholder for future implementation
export const accountApi = {
  getInformation: async () => {
    const response = await apiClient.post('/account/information');
    return response.data;
  },
  updateName: async (name) => {
    const response = await apiClient.post('/account/update_name', { name });
    return response.data;
  },
  // Additional account endpoints can be added here as needed
};

// Initialize the token from localStorage if it exists
const storedToken = localStorage.getItem('token');
if (storedToken) {
  setAuthToken(storedToken);
}

// Axios interceptors for handling responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      setAuthToken(null);
      localStorage.removeItem('token');
      // Optionally redirect to login page or show a message
      console.error('Unauthorized: Token expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
