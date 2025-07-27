import {useState} from "react";

export default function AnswerForm() {
    const [text, setText] = useState("");

    return (
        <div className="mb-6 relative">
            <div
                contentEditable
                onInput={(e) => setText(e.currentTarget.textContent)}
                className="w-full min-h-[5rem] bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white text-lg p-4 rounded-lg outline-none whitespace-pre-wrap break-words flex items-center justify-center text-center"
            ></div>

            {text.trim() === "" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/70 text-lg p-4">
                    Nhập câu hỏi của bạn ở đây...
                </div>
            )}
        </div>
    );
}