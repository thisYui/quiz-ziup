import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from "./pages/IndexPage.jsx";
import AuthRoutes from './routes/AuthRoutes.jsx';
import QuizRoutes from "./routes/QuizRoutes.jsx";
import AccountRoutes from "./routes/AccountRoutes.jsx";
import ViewRoutes from "./routes/ViewRoutes.jsx";
import { useEffect } from 'react';
import { authApi } from "./services/apiService.js";

function App() {
    useEffect(() => {
        /**
         *********** RENEW TOKEN EVERY 45 MINUTES ***********
         */

        const token = localStorage.getItem('token');
        if (!token) return;

        let intervalId;

        const handleTokenRenewal = async () => {
            try {
                await authApi.renewToken();
            } catch (err) {
                console.error("Token renewal failed:", err);
            }
        };

        handleTokenRenewal();

        intervalId = setInterval(() => {
            handleTokenRenewal();
        }, 45 * 60 * 1000); // 45 phút

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/auth/*" element={<AuthRoutes />} />
                <Route path="/account/*" element={<AccountRoutes />} />
                <Route path="/quiz/*" element={<QuizRoutes />} />
                <Route path="/view/*" element={<ViewRoutes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
