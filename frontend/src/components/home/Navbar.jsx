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
        <div className="w-full h-20 bg-[#1F1F1F] border-b border-gray-700 shadow-sm z-20 fixed top-0 left-0">
            <div className="max-w-7xl h-20 mx-auto p-4 flex items-center justify-between gap-4">
                {/* trái: logo + tên */}
                <div className="flex items-center gap-3">
                    <img
                            src="/src/assets/favicon/favicon.png"
                            alt="Logo"
                            className="w-6 h-6"
                    />
                    <h1 className="text-lg font-bold text-white">
                        {name || 'Quiz App'}
                    </h1>
                </div>

                {/* phải: các nút */}
                <div className="flex items-center gap-3">
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
