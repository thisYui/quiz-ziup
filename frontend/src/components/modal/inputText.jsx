import React, { useState } from "react";
import { SETTING, SETTING_REVERSE } from "../../constants/index.js";
import { accountApi } from "../../services/apiService.js";

function FancyInput({ label, name, type = "text", defaultValue = "", readOnly = false, disabled = false, onChange }) {
    return (
        <div className="w-full">
            <input
                className="input w-full"
                placeholder={label}
                type={type}
                name={name}
                defaultValue={defaultValue}
                readOnly={readOnly}
                disabled={disabled}
                required
                onChange={onChange}
            />
            <style>{`
/* From Uiverse.io by Jaareet (theme-adapted) */
.input { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif; font-weight: 500; font-size: .8vw; color: #fff; background-color: rgb(28,28,30); box-shadow: 0 0 .4vw rgba(0,0,0,0.5), 0 0 0 .15vw transparent; border-radius: 0.4vw; border: none; outline: none; padding: 0.6vw 0.8vw; max-width: 100%; transition: .4s; }
.input:hover { box-shadow: 0 0 0 .15vw rgba(135, 207, 235, 0.186); }
.input:focus { box-shadow: 0 0 0 .15vw skyblue; }
@media (max-width: 768px) { .input { font-size: 14px; padding: 10px 12px; border-radius: 8px; } }
`}</style>
        </div>
    );
}

export function TextInputModal({ info, setInfo, label, onClose }) {
    const fieldKey = SETTING_REVERSE[label];
    const oldData = fieldKey && info ? info[fieldKey] : "";
    const [verifying, setVerifying] = useState(false);
    const [verifyPassed, setVerifyPassed] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const checkEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleConfirm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newValue = form.newValue ? form.newValue.value.trim() : "";
        const id = sessionStorage.getItem("user_id");

        if (label === SETTING.UPDATE_PASSWORD && !verifyPassed) {
            // Step 1: verify old password
            const oldPassword = form.oldPassword?.value?.trim();
            if (!oldPassword) {
                setErrorMsg("Please enter your current password.");
                return;
            }
            try {
                setErrorMsg("");
                setVerifying(true);
                await accountApi.verifyPassword(id, oldPassword);
                setVerifyPassed(true);
                setVerifying(false);
            } catch (err) {
                console.error("Verify password failed:", err);
                setErrorMsg("Incorrect password. Please try again.");
                setVerifying(false);
            }
            return;
        }

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

    if (label === SETTING.UPDATE_PASSWORD) {
        return (
            <div>
                <h2 className="text-xl font-semibold mb-4">Update password</h2>
                <form className="space-y-4" onSubmit={handleConfirm}>
                    {!verifyPassed && (
                        <>
                            <FancyInput label="Current password" name="oldPassword" type="password" />
                            {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}
                            <button type="submit" disabled={verifying} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm">
                                {verifying ? "Verifying..." : "Submit"}
                            </button>
                        </>
                    )}
                    {verifyPassed && (
                        <>
                            <FancyInput label="New password" name="newValue" type="password" />
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Confirm</button>
                        </>
                    )}
                </form>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 capitalize">{label}</h2>
            <form className="space-y-6" onSubmit={handleConfirm}>
                <FancyInput label="New" name="newValue" />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Confirm</button>
            </form>
        </div>
    );
}
