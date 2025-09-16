import {WarningModal} from "./warning.jsx";
import {FileInputModal} from "./inputFile.jsx";
import {TextInputModal} from "./inputText.jsx";
import { SETTING } from "../../constants/index.js";
import React, { useEffect, useMemo, useState } from "react";
import { GlowEffect } from "../ui/GlowEffect.jsx";

export function SettingModal({ info, setInfo, label, onClose }) {
    const [cardStyle, setCardStyle] = useState('prism');

    useEffect(() => {
        const saved = localStorage.getItem('settings_card_style');
        if (saved) setCardStyle(saved);
    }, []);

    const CARD_STYLES = useMemo(() => ({
        prism: { className: "bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#444444]", isLight: false },
        aurora: { className: "bg-gradient-to-b from-[#161616] to-[#1F1F1F] border border-[#444444]", isLight: false },
        indigo: { className: "bg-gradient-to-br from-[#0F172A] to-[#111827] border border-[#374151]", isLight: false },
        tealCarbon: { className: "bg-gradient-to-br from-[#0B1C1B] to-[#0D2524] border border-[#265B57]", isLight: false },
        slateLift: { className: "bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#374151]", isLight: false },
        plumCarbon: { className: "bg-gradient-to-br from-[#1A1024] to-[#0E0A12] border border-[#4B2E83]", isLight: false },
        frost: { className: "bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#444444]", isLight: false },
        halo: { className: "border border-[#444444] bg-[#1A1A1A] [background:radial-gradient(600px_200px_at_20%_10%,rgba(219,39,119,0.05)_0%,transparent_50%),radial-gradient(500px_200px_at_60%_0%,rgba(147,51,234,0.06)_0%,transparent_50%)]", isLight: false },
        orbit: { className: "border border-[#444444] bg-[#1A1A1A] [background:conic-gradient(from_180deg_at_10%_10%,#1A1A1A,#202020,#2A2A2A,#1A1A1A)]", isLight: false },
        paper: { className: "bg-gradient-to-br from-[#F5F5F5] to-[#EDEDED] border border-[#CCCCCC]", isLight: true },
        frostLight: { className: "bg-white/90 backdrop-blur-md border border-[#E5E7EB]", isLight: true },
    }), []);

    const current = CARD_STYLES[cardStyle] || CARD_STYLES.prism;
    const commonProps = {
        info,
        setInfo,
        label,
        onClose
    }

    const renderContent = () => {
        if (label === SETTING.DELETE_ACCOUNT || label === SETTING.LOG_OUT) {
            return <WarningModal {...commonProps} />;
        } else if (label === SETTING.UPDATE_AVATAR) {
            return <FileInputModal {...commonProps} />;
        } else {
            return <TextInputModal {...commonProps} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="relative w-full max-w-md">
                <GlowEffect colors={["#9333EA", "#DB2777", "#2563EB", "#14B8A6"]} mode="pulse" blur="medium" className="rounded-2xl" />
                <div className={`relative rounded-2xl p-6 w-full text-white shadow-2xl ${current.className} ${current.isLight ? 'text-black' : 'text-white'}`}>
                    <button
                        onClick={onClose}
                        className={`absolute top-2 right-3 ${current.isLight ? 'text-gray-600 hover:text-black' : 'text-gray-300 hover:text-white'} text-xl`}
                    >
                        &times;
                    </button>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
