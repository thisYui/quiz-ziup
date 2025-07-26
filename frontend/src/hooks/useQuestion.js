import { quizApi } from '../services/apiService.js';
import { QUESTION_CONTENT } from "../constants/index.js";
import { useNavigate } from "react-router-dom";

export function useQuestion() {
    const navigate = useNavigate();

    const addQuestion = async () => {
        const questionData = {
            ...QUESTION_CONTENT, // clone lại để tránh mutate trực tiếp constant
            quiz_id: sessionStorage.getItem('quiz_id'),
            position: Number(sessionStorage.getItem('position')),
        };

        try {
            const response = await quizApi.add_question(questionData.quiz_id, questionData);
            const question_id = response.question_id;
            const slug = sessionStorage.getItem('quiz_slug');

            sessionStorage.setItem('position', String(questionData.position + 1));
            sessionStorage.setItem('question_id', question_id);

            navigate(`quiz/${slug}/question/${question_id}/choice`, { state: questionData });
        } catch (error) {
            console.error("Error adding question:", error);
            alert("Failed to add question. Please try again.");
        }
    };

    return { addQuestion };
}
