import { Navigate, Route, Routes } from "react-router-dom";
import HistoryQuizPage from "../pages/view/HistoryQuizPage.jsx";
import ShowQuizPage from "../pages/view/ShowQuizPage.jsx";

export default function ViewRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="/" replace />} />
            <Route path=":user_id/history" element={<HistoryQuizPage />} />
            <Route path=":user_id/quiz/:quiz_id" element={<ShowQuizPage />} />
        </Routes>
    );
}
