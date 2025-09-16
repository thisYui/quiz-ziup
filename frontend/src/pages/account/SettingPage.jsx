// SettingModal.jsx
import React, { useState, useEffect } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { SettingModal } from "../../components/modal/index.js";
import { AppAvatar } from "../../components/ui/avatar.jsx";
import { GlowEffect } from "../../components/ui/GlowEffect.jsx";
import { accountApi } from '../../services/apiService.js';
import { SETTING } from "../../constants/index.js";

export default function SettingPage() {
    const [openModal, setOpenModal] = useState(null);
    const [info, setInfo] = useState(null);
    const [cardStyle, setCardStyle] = useState("prism");

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

    useEffect(() => {
        const saved = localStorage.getItem('settings_card_style');
        if (saved) setCardStyle(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem('settings_card_style', cardStyle);
    }, [cardStyle]);

    const CARD_STYLES = {
        prism: {
            label: 'Charcoal Prism',
            className: "bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#444444] shadow-[0_0_0_1px_#444444] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(147,51,234,0.12)] transition-shadow",
        },
        aurora: {
            label: 'Midnight Aurora',
            className: "bg-gradient-to-b from-[#161616] to-[#1F1F1F] border border-[#444444] shadow-[0_8px_0_-6px_rgba(37,99,235,0.12)] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(20,184,166,0.10)] transition-shadow",
        },
        indigo: {
            label: 'Indigo Mist',
            className: "bg-gradient-to-br from-[#0F172A] to-[#111827] border border-[#374151] shadow-[0_0_0_1px_#374151] hover:shadow-[0_0_0_1px_#93C5FD,0_0_24px_0_rgba(37,99,235,0.18)] transition-shadow",
        },
        tealCarbon: {
            label: 'Teal Carbon',
            className: "bg-gradient-to-br from-[#0B1C1B] to-[#0D2524] border border-[#265B57] shadow-[0_0_0_1px_#265B57] hover:shadow-[0_0_0_1px_#99F6E4,0_0_24px_0_rgba(20,184,166,0.18)] transition-shadow",
        },
        slateLift: {
            label: 'Slate Lift',
            className: "bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#374151] shadow-[0_0_0_1px_#374151] hover:shadow-[0_0_0_1px_#9CA3AF,0_0_24px_0_rgba(156,163,175,0.20)] transition-shadow",
        },
        plumCarbon: {
            label: 'Plum Carbon',
            className: "bg-gradient-to-br from-[#1A1024] to-[#0E0A12] border border-[#4B2E83] shadow-[0_0_0_1px_#4B2E83] hover:shadow-[0_0_0_1px_#C084FC,0_0_24px_0_rgba(147,51,234,0.20)] transition-shadow",
        },
        frost: {
            label: 'Obsidian Frost',
            className: "bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#444444] shadow-[inset_0_0_0_1px_#2A2A2A,0_0_0_1px_#444444] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(37,99,235,0.14)] transition-shadow",
        },
        halo: {
            label: 'Nebula Halo',
            className: "border border-[#444444] bg-[#1A1A1A] [background:radial-gradient(600px_200px_at_20%_10%,rgba(219,39,119,0.05)_0%,transparent_50%),radial-gradient(500px_200px_at_60%_0%,rgba(147,51,234,0.06)_0%,transparent_50%)] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(147,51,234,0.12)] transition-shadow",
        },
        orbit: {
            label: 'Subtle Orbit',
            className: "border border-[#444444] bg-[#1A1A1A] [background:conic-gradient(from_180deg_at_10%_10%,#1A1A1A,#202020,#2A2A2A,#1A1A1A)] hover:shadow-[0_0_0_1px_#CCCCCC,0_0_24px_0_rgba(147,51,234,0.16)] transition-shadow",
        },
        // Light variants kept but de-emphasized
        paper: {
            label: 'Luminous Paper (Light)',
            className: "bg-gradient-to-br from-[#F5F5F5] to-[#EDEDED] border border-[#CCCCCC] shadow-[0_0_0_1px_#CCCCCC] hover:shadow-[0_0_0_1px_#A3A3A3,0_0_24px_0_rgba(147,51,234,0.08)] transition-shadow text-black",
            isLight: true,
        },
        frostLight: {
            label: 'Frosted Glass (Light)',
            className: "bg-white/90 backdrop-blur-md border border-[#E5E7EB] shadow-[inset_0_0_0_1px_#F3F4F6,0_0_0_1px_#E5E7EB] hover:shadow-[0_0_0_1px_#A3A3A3,0_0_24px_0_rgba(20,184,166,0.10)] transition-shadow text-black",
            isLight: true,
        },
    };

    const isLight = CARD_STYLES[cardStyle]?.isLight === true;
    const cardCls = (extra = "") => `${CARD_STYLES[cardStyle]?.className || CARD_STYLES.prism.className} ${extra}`.trim();
    const mutedTextCls = isLight ? 'text-gray-600' : 'text-gray-300';
    const labelTextCls = isLight ? 'text-gray-600' : 'text-gray-400';

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
                    {/* Style selector */}
                    <section className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base md:text-lg font-medium">Card background</h2>
                            <div className="text-xs text-gray-400">Preview & select</div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {Object.entries(CARD_STYLES).map(([key, val]) => (
                                <button
                                    key={key}
                                    onClick={() => setCardStyle(key)}
                                    className={`rounded-xl p-3 text-left border ${cardStyle===key? 'border-[#CCCCCC]':'border-[#444444]'} transition-colors`}
                                >
                                    <div className={`h-16 rounded-lg mb-2 ${val.className}`}></div>
                                    <div className="text-xs text-gray-300">{val.label}</div>
                                </button>
                            ))}
                        </div>
                    </section>
                    {/* Left: Profile + Details */}
                    <section className="space-y-6">
                        {/* Profile Card */}
                        <div className="relative">
                            <GlowEffect colors={["#9333EA", "#DB2777", "#2563EB", "#14B8A6"]} mode="pulse" blur="medium" className="rounded-2xl" />
                            <div className={`relative rounded-2xl p-5 md:p-6 ${cardCls()}`}>
                                <div className="flex items-center gap-5 md:gap-6">
                                    <AppAvatar src={info?.avatar_url || undefined} alt={info?.full_name || "Avatar"} size={112} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-lg md:text-xl font-medium truncate">{info?.full_name || "No Name"}</div>
                                        <div className={`${mutedTextCls} text-sm md:text-base truncate`}>{info?.email || "No email"}</div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button onClick={() => setOpenModal(SETTING.UPDATE_AVATAR)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Update avatar</button>
                                            <button onClick={() => setOpenModal(SETTING.UPDATE_NAME)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Update name</button>
                                            <button onClick={() => setOpenModal(SETTING.UPDATE_EMAIL)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Update email</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="relative">
                            <GlowEffect colors={["#9333EA", "#DB2777", "#2563EB", "#14B8A6"]} mode="pulse" blur="medium" className="rounded-2xl" />
                            <div className={`relative rounded-2xl p-5 md:p-6 ${cardCls()}`}>
                                <h2 className="text-base md:text-lg font-medium mb-4">Account details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className={`text-sm ${labelTextCls}`}>Full name</div>
                                            <div className="text-sm md:text-base">{info?.full_name || "No Name"}</div>
                                        </div>
                                        <button onClick={() => setOpenModal(SETTING.UPDATE_NAME)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0">Edit</button>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className={`text-sm ${labelTextCls}`}>Email</div>
                                            <div className="text-sm md:text-base">{info?.email || "No email"}</div>
                                        </div>
                                        <button onClick={() => setOpenModal(SETTING.UPDATE_EMAIL)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0">Edit</button>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className={`text-sm ${labelTextCls}`}>Password</div>
                                            <div className="text-sm md:text-base">••••••••</div>
                                        </div>
                                        <button onClick={() => setOpenModal(SETTING.UPDATE_PASSWORD)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0">Change</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right: Quick Actions / Danger Zone */}
                    <aside className="space-y-6">
                        <div className="relative">
                            <GlowEffect colors={["#9333EA", "#DB2777", "#2563EB", "#14B8A6"]} mode="pulse" blur="medium" className="rounded-2xl" />
                            <div className={`relative rounded-2xl p-5 md:p-6 ${cardCls()}`}>
                                <h3 className="text-base md:text-lg font-medium mb-3">Sessions</h3>
                                <button onClick={() => setOpenModal(SETTING.LOG_OUT)} className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Log out</button>
                            </div>
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