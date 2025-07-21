import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import OtpPage from '../pages/auth/OtpPage.jsx';
import PasswordPage from '../pages/auth/PasswordPage.jsx';

export default function AuthRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="otp" element={<OtpPage />} />
            <Route path="password" element={<PasswordPage />} />
        </Routes>
    );
}
