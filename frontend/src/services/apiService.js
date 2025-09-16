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
    },

    renewToken: async () => {
        const token = {
            jti: localStorage.getItem('token'),
            device: navigator.platform,
            user_agent: navigator.userAgent,
        };

        const response = await apiClient.post('/auth/renew_token', token);

        if (response.data.token) {
            setAuthToken(response.data.token);
            localStorage.setItem('token', response.data.token);
        }

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
    remove_question: async (quiz_id, question_id) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/remove_question`, { question_id: question_id });
        return response.data;
    },
    hide_question: async (quiz_id, question_id) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/hide_question`, { question_id: question_id });
        return response.data;
    },
    show_question: async (quiz_id, question_id) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/show_question`, { question_id: question_id });
        return response.data;
    },
    get_content: async (quiz_id) => {
        const response = await apiClient.post(`/quiz/${quiz_id}/get_content_quiz`);
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
    verifyPassword: async (userId, old_password) => {
        const response = await apiClient.post(`/account/${userId}/verify_password`, { old_password });
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

export const questionApi = {
    update: async (question_id, type, question, options, results) => {
        const response = await apiClient.post(`/quiz/question/${question_id}/update`, {
            type: type,
            question: question,
            options: options,
            results: results
        });
        return response.data;
    },
    change_type: async (question_id, type) => {
        const response = await apiClient.post(`/quiz/question/${question_id}/change_type`, { type: type });
        return response.data;
    },
    choice: {
        add_option: async (question_id,  position) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/choice/add_option`, { position: position });
            return response.data;
        },
        choice_result: async (question_id, option_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/choice/choice_result`, { option_id: option_id });
            return response.data;
        },
        single_result: async (question_id, option_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/choice/single_result`, { option_id: option_id });
            return response.data;
        },
        remove_option: async (question_id, option_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/choice/remove_option`, { option_id: option_id });
            return response.data;
        },
    },
    matching: {
        add_option: async (question_id, side, position) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/match/add_option`,
                { side: side, position: position }
            );
            return response.data;
        },
        remove_option: async (question_id, option_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/match/remove_option`, { option_id: option_id });
            return response.data;
        },
        add_result: async (question_id, option_left_id, option_right_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/match/add_result`, {
                option_left_id: option_left_id,
                option_right_id: option_right_id
            });
            return response.data;
        },
        remove_result: async (question_id, result_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/match/remove_result`, {result_id: result_id});
            return response.data;
        },
    },
    fill_in_blank: {
        add_result: async (question_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/fill/add_result`);
            return response.data;
        },
        remove_result: async (question_id, result_id) => {
            const response = await apiClient.post(`/quiz/question/${question_id}/fill/remove_result`, {result_id: result_id});
            return response.data;
        },
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
