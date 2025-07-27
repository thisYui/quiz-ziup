import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from "./pages/IndexPage.jsx";
import AuthRoutes from './routes/AuthRoutes.jsx';
import QuizRoutes from "./routes/QuizRoutes.jsx";
import AccountRoutes from "./routes/AccountRoutes.jsx";
import ViewRoutes from "./routes/ViewRoutes.jsx";


import SettingPage from "./pages/account/SettingPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SettingPage />} />
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
