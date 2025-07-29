import React, { useEffect, useState } from 'react';
import { BGPattern } from '../../components/ui/BGPattern.jsx';
import { Navbar } from '../../components/home/Navbar.jsx';
import { QuizList } from '../../components/quiz/list/index.js';
import { useNavigate } from "react-router-dom";
import { accountApi } from '../../services/apiService.js';

export default function HistoryQuizPage() {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await accountApi.getHistoryQuiz(sessionStorage.getItem('user_id'));
                setQuizList(res);
            } catch (error) {
                console.error('failed to fetch quizzes', error);
            }
        };
        fetchQuizzes().then();
    }, []);

    const handleOpenQuiz = (quiz) => {
        const userId = sessionStorage.getItem('user_id');
        navigate(`view/${userId}/quiz/${quiz.slug}`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />
            <div className="pt-28 px-6">
                <QuizList quizzes={quizList} openQuiz={handleOpenQuiz} isOwner={false} />
            </div>
        </div>
    );
}
