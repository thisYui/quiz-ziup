import { Navigate, Route, Routes } from "react-router-dom";
import SettingPage from "../pages/account/SettingPage.jsx";
import HomePage from "../pages/account/HomePage.jsx";
import OwnerQuizPage from "../pages/account/OwnerQuizPage.jsx";

export default function AccountRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to=":user_id/home" replace />} />
            <Route path=":user_id/home" element={<HomePage />} />
            <Route path=":user_id/setting" element={<SettingPage/>} />
            <Route path=":user_id/owner" element={<OwnerQuizPage />} />
        </Routes>
    );
}
