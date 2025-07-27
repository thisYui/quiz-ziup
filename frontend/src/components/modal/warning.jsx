import React from "react";
import { authApi, accountApi } from "../../services/apiService.js";
import { useNavigate } from "react-router-dom";
import { SETTING } from "../../constants/index.js";

export function WarningModal({ label, onClose }) {
    const navigate = useNavigate();

    function handleAction() {
        const id = localStorage.getItem("userId");

        if (label === SETTING.DELETE_ACCOUNT) {
            accountApi.deleteAccount(id)
                .then(() => {
                })
                .catch(error => {
                    console.error("Error logging out:", error);
                });
        } else if (label === SETTING.LOG_OUT) {
            authApi.logout(id)
                .then(() => {
                })
                .catch(error => {
                    console.error("Error logging out:", error);
                });
        }

        navigate("/");
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 capitalize">{label}</h2>
            <p className="text-red-600 font-medium mb-4">
                Are you sure you want to <strong>{label}</strong>?
                <br /> This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAction}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                    Yes, {label}
                </button>
            </div>
        </div>
    );
}