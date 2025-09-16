import React from 'react';
import { Button } from '../ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.jsx';
import { MoreVertical } from 'lucide-react';
import plusIcon from '../../assets/ui/plus.svg';

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
        <div className="w-full bg-[#1F1F1F] border-b border-gray-700 shadow-sm z-50 fixed top-0 left-0">
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
                        className="flex items-center gap-2 md:gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded cursor-pointer select-none"
                >
                    <img src="/src/assets/favicon/favicon.png" alt="quiz-ziup logo" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-white font-semibold text-lg md:text-xl">{name || 'quiz-ziup'}</span>
                </button>

                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    <Button
                            variant="default"
                            size="sm"
                            style={{ backgroundColor: '#9333EA' }}
                            onClick={handleCreate}
                            className="group relative overflow-visible"
                    >
                        <span className="icon-glow" aria-hidden="true"></span>
                        <span className="flex items-center gap-2">
                            <span className="icon-ring" style={{ ['--ring-color']: '#a855f7' }}>
                                <img src={plusIcon} alt="plus" className="h-4 w-4" />
                            </span>
                            Create
                        </span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                    className="burger rounded-md"
                                    aria-label="Open menu"
                            >
                                <span></span><span></span><span></span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={handleHistory}>History</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleMyQuiz}>My Quiz</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSetting}>Settings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};
