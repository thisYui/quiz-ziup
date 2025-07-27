import React, { useState } from "react";
import { accountApi } from "../../services/apiService.js";
import { encodeFileToBase64 } from "../../utils/fileUtils.js";

export function FileInputModal({ info, setInfo, label, onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    async function handleUpload(e) {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please choose a file first.");
            return;
        }

        const userId = sessionStorage.getItem("user_id");

        try {
            setUploading(true);
            const { data, type } = await encodeFileToBase64(selectedFile);
            await accountApi.updateAvatar(userId, data, type);;
            const previewUrl = URL.createObjectURL(selectedFile);
            setInfo((prev) => ({ ...prev, avatar_url: previewUrl }));
            onClose();

        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload avatar.");

        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 capitalize">{label}</h2>
            <form className="space-y-4" onSubmit={handleUpload}>
                <label className="block">
                    <span className="text-sm text-gray-700">Choose new avatar:</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full mt-1"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </label>
                <button
                    type="submit"
                    disabled={uploading}
                    className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
}
