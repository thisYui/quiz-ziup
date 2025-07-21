import { useNavigate } from 'react-router-dom';
import { quizApi } from '../services/apiService.js';

export function useJoinQuiz() {
    const navigate = useNavigate();

    const joinQuiz = async (quizCode) => {
        try {
            const data = await quizApi.join({ code: quizCode });

            // ví dụ: data trả về có `quiz_id` hoặc `slug`
            navigate(`/quiz/${data.slug}/lobby`);
        } catch (err) {
            console.error(err);
            alert('Invalid quiz code');
        }
    };

    return { joinQuiz };
}
