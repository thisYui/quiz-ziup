import axios from 'axios';

// Base URL for the backend API - adjust based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

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
    login: async (email, password, rememberMe = false) => {
        let body;

        if (localStorage.getItem('token') !== null) {
            body = {
                token: {
                    jti: localStorage.getItem('token'),
                    device: navigator.platform,
                    user_agent: navigator.userAgent,
                }
            };
        } else if (email && password) {
            body = {
                email,
                password,
                remember_me: rememberMe,
                jwt_token: {
                    device: navigator.platform,
                    user_agent: navigator.userAgent,
                }
            };
        } else {
            return { error: 'No token or credentials provided' };
        }

        const response = await apiClient.post('/auth/login', body);

        if (response.data.token) {
            setAuthToken(response.data.token);
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    },

    register: async (full_name, email, password, confirm_password) => {
      const response = await apiClient.post('/auth/register', {
          full_name,
          email,
          password,
          confirm_password
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

    logout: async () => {
        if (localStorage.getItem('token') === null) {
            return true;
        }

        const token = {
            jti: localStorage.getItem('token'),
            device: navigator.platform,
            user_agent: navigator.userAgent,
            user_id: sessionStorage.getItem('user_id'),
        };

        const response = await apiClient.post(`/auth/logout`, token );

        setAuthToken(null);
        sessionStorage.clear();
        localStorage.removeItem('token');

        return response.data;
    }
};

// Quiz API methods - placeholder for future implementation
export const quizApi = {
    join: async (data) => {
        const response = await apiClient.post('/quiz/join', data);
        return response.data;
    },
    get: async (quiz_id) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/get`, );
        return response.data;
    },
    submit: async (quiz_id) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/submit`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/quiz/create', data);
        return response.data;
    },
    add_question: async (quiz_id, question_data) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/add_question`, question_data);
        return response.data;
    },
    update_title: async (quiz_id, new_title) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/update_title`, { new_title: new_title });
        return response.data;
    },
    update_description: async (quiz_id, new_description) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/update_description`, { new_description: new_description });
        return response.data;
    },
    update_code: async (quiz_id, new_code) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/update_code`, { new_code: new_code });
        return response.data;
    },
    update_max_participants: async (quiz_id, new_max_participants) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/update_max_participants`, { new_max_participants: new_max_participants });
        return response.data;
    },
    update_key: async (quiz_id, new_key) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/update_key`, { new_key: new_key });
        return response.data;
    },
    update_topic: async (quiz_id, new_topic) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/update_topic`, { new_topic: new_topic });
        return response.data;
    },
};

// Account API methods - placeholder for future implementation
export const accountApi = {
    getInformation: async (userId) => {
        const response = await apiClient.post(`/account/${userId}/information`);
        return response.data;
    },
    getOwnerQuiz: async (userId) => {
        const response = await apiClient.post(`/account/${userId}/owner_quiz`);
        return response.data;
    },
    getHistoryQuiz: async (userId) => {
        const response = await apiClient.post(`/account/${userId}/history`);
        return response.data;
    },
    updateName: async (userId, new_name) => {
        const response = await apiClient.post(`/account/${userId}/update_name`, { new_name: new_name });
        return response.data;
    },
    updateEmail: async (userId, new_email) => {
        const response = await apiClient.post(`/account/${userId}/update_email`, { new_email: new_email });
        return response.data;
    },
    updatePassword: async (userId, new_password) => {
        const response = await apiClient.post(`/account/${userId}/update_password`, { new_password: new_password });
        return response.data;
    },
    updateAvatar: async (userId, data, type) => {
        const formData = new FormData();

        // nếu backend cần field tên là 'data' và 'type'
        formData.append("data", data);
        formData.append("type", type);

        const response = await apiClient.post(
            `/account/${userId}/update_avatar`,
            formData,
            {
              headers: {}
            }
        );

        return response.data;
    },
    deleteAccount: async (userId) => {
        const response = await apiClient.delete(`/account/${userId}/deletet`);
        setAuthToken(null);
        sessionStorage.clear();
        localStorage.removeItem('token');
        return response.data;
    },
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
