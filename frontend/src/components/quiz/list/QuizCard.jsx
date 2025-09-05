import React from 'react';
import { TOPIC } from '../../../constants/index.js';

export const QuizCard = ({ quiz, onClick }) => {
    return (
        <div
            onClick={() => onClick(quiz)}
            className="bg-purple-500 hover:bg-purple-600 transition-colors text-black w-44 p-4 rounded-2xl shadow-md text-center space-y-2 cursor-pointer"
        >
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p className="text-sm text-black/80">{quiz.code}</p>
            <p className="text-sm text-black/80">{TOPIC[quiz.topic]}</p>
            <p className="text-sm text-black/80">{quiz.description}</p>
        </div>
    );
};