import React from 'react';
import { QuizCard } from './QuizCard';
import { AddQuizButton } from './AddQuizButton';

export const QuizList = ({ quizzes, onAddQuiz, openQuiz }) => {
    return (
        <div className="flex flex-wrap justify-center gap-8">
            {quizzes.map((quiz, idx) => (
                <QuizCard key={idx} quiz={quiz} onClick={openQuiz}/>
            ))}

            <AddQuizButton onClick={onAddQuiz} />
        </div>
    );
};