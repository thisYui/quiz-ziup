// SettingModal.jsx
import React, { useState, useEffect } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { SettingModal } from "../../components/modal/index.js";
import { AppAvatar } from "../../components/ui/avatar.jsx";
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

            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-24 md:mt-28">
                <header className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>
                    <p className="text-gray-300 text-sm md:text-base">Manage your account and preferences</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 md:gap-8">
                    {/* Left: Profile + Details */}
                    <section className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_0_0_1px_#444444] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(147,51,234,0.15)] transition-shadow">
                            <div className="flex items-center gap-5 md:gap-6">
                                <AppAvatar src={info?.avatar_url || undefined} alt={info?.full_name || "Avatar"} size={112} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-lg md:text-xl font-medium truncate">{info?.full_name || "No Name"}</div>
                                    <div className="text-gray-300 text-sm md:text-base truncate">{info?.email || "No email"}</div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button onClick={() => setOpenModal(SETTING.UPDATE_AVATAR)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Update avatar</button>
                                        <button onClick={() => setOpenModal(SETTING.UPDATE_NAME)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Update name</button>
                                        <button onClick={() => setOpenModal(SETTING.UPDATE_EMAIL)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Update email</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_0_0_1px_#444444] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(37,99,235,0.15)] transition-shadow">
                            <h2 className="text-base md:text-lg font-medium mb-4">Account details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">Full name</div>
                                        <div className="text-sm md:text-base">{info?.full_name || "No Name"}</div>
                                    </div>
                                    <button onClick={() => setOpenModal(SETTING.UPDATE_NAME)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0">Edit</button>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">Email</div>
                                        <div className="text-sm md:text-base">{info?.email || "No email"}</div>
                                    </div>
                                    <button onClick={() => setOpenModal(SETTING.UPDATE_EMAIL)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0">Edit</button>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">Password</div>
                                        <div className="text-sm md:text-base">••••••••</div>
                                    </div>
                                    <button onClick={() => setOpenModal(SETTING.UPDATE_PASSWORD)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0">Change</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right: Quick Actions / Danger Zone */}
                    <aside className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_0_0_1px_#444444] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(37,99,235,0.15)] transition-shadow">
                            <h3 className="text-base md:text-lg font-medium mb-3">Security</h3>
                            <button onClick={() => setOpenModal(SETTING.UPDATE_PASSWORD)} className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Change password</button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_0_0_1px_#444444]">
                            <h3 className="text-base md:text-lg font-medium mb-3">Sessions</h3>
                            <button onClick={() => setOpenModal(SETTING.LOG_OUT)} className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Log out</button>
                        </div>

                        <div className="bg-red-600/10 border border-red-700/40 rounded-2xl p-5 md:p-6 shadow-[0_0_0_1px_#9333EA] shadow-red-500/20">
                            <h3 className="text-base md:text-lg font-medium mb-3 text-red-400">Danger zone</h3>
                            <button onClick={() => setOpenModal(SETTING.DELETE_ACCOUNT)} className="w-full text-left px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm">Delete account</button>
                        </div>
                    </aside>
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