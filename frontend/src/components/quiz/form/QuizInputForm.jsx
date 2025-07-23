import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { InputField } from '../../ui/InputField';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { useQuiz } from '../../../hooks/useQuiz.js';

export default function QuizInputForm({ is_client = false }) {
    const [quizCode, setQuizCode] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [name, setName] = useState('');
    const [requireKey, setRequireKey] = useState(false); // kiểm tra quiz có yêu cầu key hay không
    const [accessKeyError, setAccessKeyError] = useState(false);
    const [notFoundQuiz, setNotFoundQuiz] = useState(false); // kiểm tra quiz có tồn tại hay không
    const { joinQuiz } = useQuiz();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (quizCode.trim()) {
            const response = await joinQuiz({
                code: quizCode.trim(),
                full_name: name.trim(),
                key: accessKey.trim(),
            });

            if (response?.error) {
                if (response.error === 404) {
                    setNotFoundQuiz(true);
                } else if (response.error === 403) {
                    if (response.type === 0) {  // type 0: require key
                        setRequireKey(true);
                    } else if (response.type === 1) { // type 1: key invalid
                        setAccessKeyError(true); // 2: key invalid
                    } else {
                        alert('You do not have permission to join this quiz.');
                    }
                } else {
                    alert('An unexpected error occurred. Please try again later.');
                }
                return;
            }

            sessionStorage.setItem('quiz_id', response.quiz_id);
            sessionStorage.setItem('quiz_session_id', response.quiz_session_id);
            sessionStorage.setItem('participant_id', response.participator.participator_id);
            sessionStorage.setItem('avatar_url', response.participator.avatar_url);
            navigate(`/quiz/${response.quiz_slug}/lobby`, {
                state: {
                    participants: response.participants,
                    maxPlayers: response.max_participants,
                    title: response.quiz_title,
                }
            })
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* input name */}
                {is_client && (
                    <InputField
                        id="name"
                        label="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required={true}
                    />
                )}

                {/* input quiz code */}
                <InputField
                    id="quizCode"
                    label="Quiz Code"
                    value={quizCode}
                    onChange={(e) => setQuizCode(e.target.value)}
                    placeholder="Enter quiz code"
                    required={true}
                />

                {notFoundQuiz && (
                    <ErrorMessage message="Quiz not found. Please check the code and try again." />
                )}

                {/* input private key */}
                {requireKey && (
                    <InputField
                        id="accessKey"
                        label="Private Key"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        placeholder="Enter access key (if required)"
                    />
                )}

                { accessKeyError && (
                    <ErrorMessage message="Key invalid." />
                )}

                <Button
                    type="submit"
                    variant="gradient"
                    className="w-full py-4 px-8 rounded-lg font-medium text-white text-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                    style={{
                        background: 'linear-gradient(135deg, #9333EA, #DB2777)',
                        boxShadow: '0 4px 14px 0 rgba(219, 39, 119, 0.3)'
                    }}
                >
                    Join Quiz
                </Button>
            </form>
        </div>
    );
}