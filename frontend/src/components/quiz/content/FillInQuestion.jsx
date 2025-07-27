import { useState, useEffect, useRef } from "react";
import AnswerForm from "./AnswerForm.jsx";

export default function FillInQuestionPage({ results = [] }) {
    const [localResults, setLocalResults] = useState([]);
    const resultRefs = useRef({});

    // Khởi tạo state từ props ban đầu
    useEffect(() => {
        const initialized = results.map((content, idx) => ({
            id: Date.now() + idx,
            content,
        }));
        setLocalResults(initialized);
    }, [results]);

    // Gán ref cho từng ô input
    const setResultRef = (id) => (el) => {
        resultRefs.current[id] = el;
    };

    // Xử lý thay đổi nội dung
    const handleResultTextChange = (id) => {
        const el = resultRefs.current[id];
        const text = el?.textContent || "";

        setLocalResults((prev) =>
            prev.map((result) =>
                result.id === id ? { ...result, content: text } : result
            )
        );
    };

    // Thêm đáp án mới
    const addResult = () => {
        setLocalResults([
            ...localResults,
            {
                id: Date.now(),
                content: "",
            },
        ]);
    };

    // Xoá đáp án
    const removeResult = (id) => {
        if (localResults.length > 1) {
            setLocalResults(localResults.filter((result) => result.id !== id));
        }
    };

    return (
        <div>
            {/* Form nhập câu hỏi */}
            <AnswerForm />

            {/* Danh sách đáp án đúng */}
            <div className="space-y-4 mb-6">
                {localResults.map((result) => (
                    <div
                        key={result.id}
                        className="relative flex flex-col sm:flex-row gap-4 bg-[#FF8C42]/10 rounded-lg p-4"
                    >
                        {/* Ô nội dung */}
                        <div className="flex-1 relative w-[98%] min-h-[3rem]">
                            <div
                                ref={setResultRef(result.id)}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={() => handleResultTextChange(result.id)}
                                className="w-full bg-[#FF8C42] text-white rounded-lg p-4 outline-none whitespace-pre-wrap break-all min-h-[3rem]"
                            ></div>

                            {/* Placeholder */}
                            {(!resultRefs.current[result.id]?.textContent?.trim()) && (
                                <div className="absolute inset-0 pointer-events-none p-4 text-white/60">
                                    Nhập đáp án ở đây...
                                </div>
                            )}
                        </div>

                        {/* Nút xoá */}
                        {localResults.length > 1 && (
                            <button
                                onClick={() => removeResult(result.id)}
                                className="absolute top-1 right-1 w-5 h-5 bg-white/20 rounded-full text-white hover:bg-red-600 transition-colors flex items-center justify-center text-lg font-bold"
                                aria-label="Xoá lựa chọn"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}

                {/* Nút thêm */}
                <button
                    onClick={addResult}
                    className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
}
