import { Navigate, Route, Routes } from "react-router-dom";
import LobbyPage from "../pages/Quiz/LobbyPage.jsx";
import PlayPage from "../pages/Quiz/PlayPage.jsx";
import ResultPage from "../pages/Quiz/ResultPage.jsx";
import FinalPage from "../pages/Quiz/FinalPage.jsx";
import EditQuizPage from "../pages/Quiz/EditQuizPage.jsx";
import QuestionRoutes from "./QuestionRoutes.jsx";

export default function QuizRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="/" replace />} />
            <Route path=":quiz_id/lobby" element={<LobbyPage />} />
            <Route path=":quiz_id/play" element={<PlayPage />} />
            <Route path=":quiz_id/result" element={<ResultPage />} />
            <Route path=":quiz_id/final" element={<FinalPage />} />

            <Route path=":quiz_id/edit" element={<EditQuizPage />} />
            <Route path=":quiz_id/question/*" element={<QuestionRoutes />} />
        </Routes>
    );
}
