import { Navigate, Route, Routes } from "react-router-dom";
import InformationPage from "../pages/view/InformationPage.jsx";
import SummaryQuizPage from "../pages/view/SummaryQuizPage.jsx";
import OutstandingPage from "../pages/view/OutstandingPage.jsx";
import ShowQuizPage from "../pages/view/ShowQuizPage.jsx";

export default function ViewRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="/" replace />} />
            <Route path=":user_id/history" element={<SummaryQuizPage />} />
            <Route path=":user_id/information" element={<InformationPage />} />
            <Route path=":user_id/owner" element={<SummaryQuizPage />} />
            <Route path=":user_id/outstanding" element={<OutstandingPage />} />
            <Route path=":user_id/quiz/:quiz_id" element={<ShowQuizPage />} />
        </Routes>
    );
}
