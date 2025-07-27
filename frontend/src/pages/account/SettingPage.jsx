// SettingModal.jsx
import React, { useState, useEffect } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { SettingModal } from "../../components/modal/index.js";
import { accountApi } from '../../services/apiService.js';
import { SETTING } from "../../constants/index.js";

export default function SettingPage() {
    const [openModal, setOpenModal] = useState(null);
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const id = sessionStorage.getItem('user_id');
        const fetchInfo = async () => {
            try {
                const res = await accountApi.getInformation(id);
                setInfo(res);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };
        fetchInfo().then();
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />

            <div className="flex flex-col items-center mt-24 px-4">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg mb-6 flex items-center justify-center text-4xl font-bold text-white uppercase">
                    {info?.avatar_url ? (
                        <img src={info.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <img src={"https://via.placeholder.com/150"} alt="Default Avatar" className="w-full h-full rounded-full object-cover" />
                    )}
                </div>

                <div className="text-center mb-8">
                    <div className="text-2xl font-semibold tracking-wide">{info?.full_name || "No Name"}</div>
                    <div className="text-sm text-gray-300 mt-1">{info?.email || "No email"}</div>
                </div>

                <div className="bg-white/90 backdrop-blur-md text-black rounded-3xl px-10 py-8 w-full max-w-md shadow-2xl space-y-4">
                    {Object.values(SETTING).map((label, index) => {
                        const danger = [SETTING.DELETE_ACCOUNT, SETTING.LOG_OUT].includes(label);

                        return (
                            <button
                                key={index}
                                onClick={() => setOpenModal(label)}
                                className={`block w-full text-left px-4 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-gray-100 ${
                                    danger ? "text-red-600 hover:bg-red-100" : "text-gray-800"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {openModal && (
                <SettingModal
                    info={info}
                    setInfo={setInfo}
                    label={openModal}
                    onClose={() => setOpenModal(null)}
                />
            )}
        </div>
    );
}