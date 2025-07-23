import React, { useEffect, useState } from 'react';
import { BGPattern } from '../../components/ui/BGPattern.jsx';
import { Navbar } from '../../components/home/Navbar.jsx';
import { QuizList } from '../../components/quiz/list/index.js';
import { useNavigate } from "react-router-dom";
import { accountApi } from '../../services/apiService.js';

export default function SummaryQuizPage() {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]);

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

    const handleOpenQuiz = (quiz) => {
      navigate(`quiz/${quiz.slug}/edit`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
          <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
          <Navbar />
          <div className="pt-28 px-6">
            <QuizList quizzes={quizList} onAddQuiz={handleAddQuiz} openQuiz={handleOpenQuiz} />
          </div>
        </div>
    );
}
