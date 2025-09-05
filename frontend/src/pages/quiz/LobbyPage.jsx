import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useQuiz } from '../../hooks/useQuiz.js';
import LobbyHeader from '../../components/quiz/LobbyHeader';
import PlayersList from '../../components/quiz/PlayersList';
import QuizSettings from '../../components/quiz/QuizSettings';
import StartQuizButton from '../../components/quiz/StartQuizButton';

export default function LobbyPage() {
    const location = useLocation();
    const { getQuiz } = useQuiz();

    const participants = location.state?.participants || [];
    const maxPlayers = location.state?.maxPlayers;
    const title = location.state?.title || 'Quiz Room';
    const isHost = location.state?.isHost || sessionStorage.getItem('is_host') === 'true';

    const [contentQuestion, setContentQuestion] = useState([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizId = sessionStorage.getItem('quiz_id');
                const content = await getQuiz(quizId);
                setContentQuestion(content || []);
            } catch (err) {
                console.error('Lỗi khi load quiz:', err);
            }
        };
        fetchQuiz().then();
    }, []);

    const questionCount = contentQuestion.length;

    function onStartQuiz() {
        // logic bắt đầu quiz
    }

    function onLeaveRoom() {
        // logic thoát phòng
    }

    return (
        <div className="min-h-screen p-4" style={{ backgroundColor: '#0D0D0D' }}>
            <LobbyHeader
                title={title}
                quizId={sessionStorage.getItem('quiz_id')}
                onLeaveRoom={onLeaveRoom}
            />

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PlayersList
                    participants={participants}
                    maxPlayers={maxPlayers}
                />

                <div className="space-y-4">
                    <QuizSettings questionCount={questionCount} />
                    <StartQuizButton onStartQuiz={onStartQuiz} isHost={isHost} />
                </div>
            </div>
        </div>
    );
}
