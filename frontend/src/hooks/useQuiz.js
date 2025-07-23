import { quizApi } from '../services/apiService.js';

export function useQuiz() {

    const joinQuiz = async (quizCode) => {
        try {
            return await quizApi.join({code: quizCode});

        } catch (err) {
            if (err.response?.status === 404) {
                // not found
                return { error: 404, message: 'Quiz not found' };
            }  else if (err.response?.status === 403) {
                // forbidden
                const code = err.response.data.code_error;
                return { error: 403, type: code};
            } else {
                console.error(err);
                alert("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };

    const getQuiz = async (quizId) => {
        try {
            return await quizApi.get(quizId);
        } catch (err) {
            console.error(err);
            alert("Đã xảy ra lỗi khi lấy thông tin quiz. Vui lòng thử lại.");
            return null;
        }
    }

    return { joinQuiz, getQuiz };
}
