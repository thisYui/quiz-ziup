import React, { useEffect, useState } from 'react';
import { BGPattern } from '../../components/ui/BGPattern.jsx';
import { Navbar } from '../../components/home/Navbar.jsx';
import { QuizList } from '../../components/quiz/list/index.js';
import { useNavigate } from "react-router-dom";
import { accountApi, quizApi } from '../../services/apiService.js';
import { useQuizStore } from '../../hooks/useQuiz.js';

export default function OwnerQuizPage() {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]);
    const { setQuizData, setNeverStarted, setQuestionData } = useQuizStore();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await accountApi.getOwnerQuiz(sessionStorage.getItem('user_id'));
                setQuizList(res);
            } catch (error) {
                console.error('failed to fetch quizzes', error);
            }
        };
        fetchQuizzes().then();
    }, []);

    const handleAddQuiz = () => {
        navigate('/quiz/create');
    };

    const handleOpenQuiz = async (quiz) => {
        const { quiz_content} = await quizApi.get_content(quiz.id);
        if (quiz_content.error) return;

        setQuizData(quiz);
        setNeverStarted(quiz.neverStarted);
        setQuestionData(quiz_content || []);

        sessionStorage.setItem('quiz_id', quiz.id);
        sessionStorage.setItem('quiz_slug', quiz.slug);

        navigate(`/quiz/${quiz.slug}/content`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />
            <div className="pt-28 px-6">
                <QuizList quizzes={quizList} onAddQuiz={handleAddQuiz} openQuiz={handleOpenQuiz} isOwner={true} />
            </div>
        </div>
    );
}
