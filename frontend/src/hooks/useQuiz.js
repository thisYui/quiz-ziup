import { quizApi } from '../services/apiService.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ERROR } from "../constants/index.js";

export function useQuiz() {
    const joinQuiz = async (quizCode) => {
        try {
            return await quizApi.join({code: quizCode});

        } catch (err) {
            if (err.response?.status === ERROR.not_found.code) {
                // not found
                return { error: ERROR.not_found.code, message: 'Quiz not found' };
            }  else if (err.response?.status === ERROR.forbidden.code) {
                // forbidden
                const code = err.response.data.code_error;
                return { error: ERROR.forbidden.code, type: code};
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

export const useQuizStore = create(
    persist(
        (set) => ({
            quizData: {},
            neverStarted: true,
            questionData: [],

            setQuizData: (data) => set({ quizData: data }),
            setNeverStarted: (value) => set({ neverStarted: value }),
            setQuestionData: (data) => set({ questionData: data }),

            clearQuizData: () => {
                set({ quizData: {}, neverStarted: true, questionData: [] });
            },
        }),
        {
            name: 'quiz-store',
            getStorage: () => localStorage,
        }
    )
);
