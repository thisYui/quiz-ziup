import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CodeInputPage } from './pages/quiz/CodeInputPage';
import LobbyPage from './pages/quiz/Lobby';
import AuthForms from './components/auth/AuthForms';

export function App() {
  const [quizCode, setQuizCode] = useState('');

  const handleStartQuiz = (code) => {
    setQuizCode(code);
    console.log("Quiz code entered:", code);
    alert(`Quiz code entered: ${code}. Lobby functionality has been removed.`);
  };

  return (
    <Router>
      <Routes>
        {/* Route for the home page URI ("/") */}
        <Route 
          path="/" 
          element={<CodeInputPage onStartQuiz={handleStartQuiz} />} 
        />
        
        {/* Route for the lobby page URI ("/lobby") */}
        <Route 
          path="/lobby" 
          element={<LobbyPage />} 
        />
        
        {/* Route for the authentication page URI ("/auth") with nested routes */}
        <Route path="/auth">
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<AuthForms formType="login" />} />
          <Route path="register" element={<AuthForms formType="register" />} />
          <Route path="otp" element={<AuthForms formType="otp" />} />
          <Route path="password" element={<AuthForms formType="password" />} />
        </Route>
        
        {/* A catch-all route that redirects any unknown URI back to the home page */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
