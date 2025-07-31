import { useEffect, useRef, useState } from "react";

export default function AnswerForm({ content }) {
    const [text, setText] = useState(content ?? "");
    const divRef = useRef(null);

    useEffect(() => {
        // Gán nội dung ban đầu duy nhất 1 lần
        if (divRef.current && content) {
            divRef.current.innerText = content;
            setText(content);
        }
    }, [content]);

    function handleInput(e) {
        const newText = e.currentTarget.textContent;
        setText(newText);
    }

    return (
        <div className="mb-6 relative">
            <div
                ref={divRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="answer-editable w-full min-h-[5rem] bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white text-lg p-4 rounded-lg outline-none whitespace-pre-wrap break-words flex items-center justify-center text-center relative"
                data-placeholder="Nhập câu hỏi của bạn ở đây..."
            ></div>
        </div>
    );
}
