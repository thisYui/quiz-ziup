import {WarningModal} from "./warning.jsx";
import {FileInputModal} from "./inputFile.jsx";
import {TextInputModal} from "./inputText.jsx";
import { SETTING } from "../../constants/index.js";
import React from "react";

export function SettingModal({ info, setInfo, label, onClose }) {
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md text-black shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                >
                    &times;
                </button>
                {renderContent()}
            </div>
        </div>
    );
}
