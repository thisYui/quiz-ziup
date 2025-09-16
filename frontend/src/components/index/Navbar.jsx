import React from 'react';
import { Button } from '../ui/button.jsx';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleSignup = () => {
    navigate('/auth/register');
  };

  return (
      <div className="w-full bg-[#1F1F1F] border-b border-gray-700 shadow-sm z-20 fixed top-0 left-0">
        <div className="w-full px-2 md:px-2 h-16 md:h-20 flex items-center">
          <button
              onClick={() => navigate('/')}
              aria-label="Home"
              className="flex items-center gap-2 md:gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
          >
            <img src="/src/assets/favicon/favicon.png" alt="quiz-ziup logo" className="w-6 h-6 md:w-7 md:h-7" />
            <span className="text-white font-semibold text-lg md:text-xl">quiz-ziup</span>
          </button>

          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            <Button
                variant="default"
                size="sm"
                style={{ backgroundColor: '#2563EB' }}
                onClick={handleLogin}
            >
              Login
            </Button>

            <Button
                variant="default"
                size="sm"
                style={{ backgroundColor: '#9333EA' }}
                onClick={handleSignup}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
  );
};