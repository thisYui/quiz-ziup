import React from 'react';
import { Button } from '../ui/button.jsx';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ name }) => {
    const navigate = useNavigate();

    const handleHistory = () => {
      const userId = sessionStorage.getItem('user_id');
        navigate(`/view/${userId}/history`);
    }
    const handleCreate = () => {
        navigate('/quiz/create');
    }

    const handleMyQuiz = () => {
        const userId = sessionStorage.getItem('user_id');
        navigate(`/account/${userId}/owner`);
    }

    const handleSetting = () => {
        const userId = sessionStorage.getItem('user_id');
        navigate(`/account/${userId}/setting`);
    }

    return (
        <div className="w-full bg-[#1F1F1F] border-b border-gray-700 shadow-sm z-20 fixed top-0 left-0">
            <div className="w-full px-2 md:px-2 h-16 md:h-20 flex items-center">
                <button
                        onClick={() => {
                            const userId = sessionStorage.getItem('user_id');
                            if (userId) {
                                navigate(`/account/${userId}/home`);
                            } else {
                                navigate('/');
                            }
                        }}
                        aria-label="Home"
                        className="flex items-center gap-2 md:gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                >
                    <img src="/src/assets/favicon/favicon.png" alt="quiz-ziup logo" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-white font-semibold text-lg md:text-xl">{name || 'quiz-ziup'}</span>
                </button>

                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    <Button
                            variant="default"
                            size="sm"
                            style={{ backgroundColor: '#9333EA' }}
                            onClick={handleHistory}
                    >
                        History
                    </Button>

                    <Button
                            variant="default"
                            size="sm"
                            style={{ backgroundColor: '#9333EA' }}
                            onClick={handleCreate}
                    >
                        Create
                    </Button>

                    <Button
                            variant="default"
                            size="sm"
                            style={{ backgroundColor: '#9333EA' }}
                            onClick={handleMyQuiz}
                    >
                        My Quiz
                    </Button>

                    <Button
                            variant="default"
                            size="sm"
                            style={{ backgroundColor: '#2563EB' }}
                            onClick={handleSetting}
                    >
                        Setting
                    </Button>
                </div>
            </div>
        </div>
    );
};
