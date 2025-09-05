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
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end gap-4">
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
  );
};