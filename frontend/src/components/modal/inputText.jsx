import React from "react";
import { SETTING, SETTING_REVERSE } from "../../constants/index.js";
import { accountApi } from "../../services/apiService.js";

export function TextInputModal({ info, setInfo, label, onClose }) {
    const fieldKey = SETTING_REVERSE[label];
    const oldData = fieldKey && info ? info[fieldKey] : "";

    const checkEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleConfirm = async (e) => {
        e.preventDefault();
        const newValue = e.target.newValue.value.trim();
        const id = sessionStorage.getItem("user_id");

        if (!newValue) {
            alert("Please enter a valid value.");
            return;
        }

        try {
            if (label === SETTING.UPDATE_PASSWORD) {
                await accountApi.updatePassword(id, newValue);
                alert("Password updated successfully.");
            } else if (label === SETTING.UPDATE_EMAIL) {
                if (!checkEmailFormat(newValue)) {
                    alert("Please enter a valid email address.");
                    return;
                }
                await accountApi.updateEmail(id, newValue);
                setInfo((prev) => ({ ...prev, email: newValue }));
                alert("Email updated successfully.");
            } else if (label === SETTING.UPDATE_NAME) {
                await accountApi.updateName(id, newValue);
                setInfo((prev) => ({ ...prev, full_name: newValue }));
                alert("Name updated successfully.");
            } else {
                alert("Unsupported update option.");
                return;
            }

            onClose();
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update. Please try again.");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 capitalize">{label}</h2>
            <form className="space-y-4" onSubmit={handleConfirm}>
                {label !== SETTING.UPDATE_PASSWORD && (
                    <label className="block">
                        <span className="text-sm text-gray-700">Old:</span>
                        <input
                            type="text"
                            value={oldData}
                            readOnly
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
                        />
                    </label>
                )}
                <label className="block">
                    <span className="text-sm text-gray-700">New:</span>
                    <input
                        type="text"
                        name="newValue"
                        placeholder="Enter new value"
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </label>
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                    Confirm
                </button>
            </form>
        </div>
    );
}
