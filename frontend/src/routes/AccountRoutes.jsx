import { Navigate, Route, Routes } from "react-router-dom";
import SettingPage from "../pages/account/SettingPage.jsx";
import HomePage from "../pages/account/HomePage.jsx";

export default function AccountRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to=":user_id/setting" replace />} />
            <Route path=":user_id/home" element={<HomePage />} />
            <Route path=":user_id/setting" element={<SettingPage/>} />
        </Routes>
    );
}
