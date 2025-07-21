import { Navigate, Route, Routes } from "react-router-dom";
import ChoiceQuestionPage from "../pages/question/ChoiceQuestionPage.jsx";
import MatchingQuestionPage from "../pages/question/MatchingQuestionPage.jsx";
import FillInQuestionPage from "../pages/question/FillInQuestionPage.jsx";

export default function QuestionRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="/" replace />} />
            <Route path=":question_id/choice" element={<ChoiceQuestionPage />} />
            <Route path=":question_id/matching" element={<MatchingQuestionPage />} />
            <Route path=":question_id/fill-in" element={<FillInQuestionPage />} />
        </Routes>
    );
}
