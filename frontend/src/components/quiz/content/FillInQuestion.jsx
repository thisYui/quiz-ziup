import { useEffect, useRef, useState } from "react";
import AnswerForm from "./AnswerForm.jsx";
import { FILL_IN_FORM } from "../../../constants/index.js";
import { questionApi } from "../../../services/apiService.js";

export default function FillInQuestionPage({ questionId, content, results = [] }) {
    const [localResults, setLocalResults] = useState([]);
    const fillApi = questionApi.fill_in_blank;
    const contentRefs = useRef({});

    // Khởi tạo từ props
    useEffect(() => {
        const initialized = results.map((r) => ({
            id: r.id,
            content: r.content || "",
        }));
        setLocalResults(initialized);

        // Đồng bộ contentEditable text
        setTimeout(() => {
            initialized.forEach((result) => {
                const el = contentRefs.current[result.id];
                if (el && el.textContent !== result.content) {
                    el.textContent = result.content;
                }
            });
        }, 0);
    }, [results]);

    const handleTextChange = (id) => {
        const el = contentRefs.current[id];
        if (!el) return;
        const newText = el.textContent;

        setLocalResults((prev) =>
            prev.map((result) =>
                result.id === id ? { ...result, content: newText } : result
            )
        );
    };

    const addResult = (resultID) => {
        setLocalResults((prev) => [
            ...prev,
            {
                ...FILL_IN_FORM,
                id: resultID,
            },
        ]);
    };

    async function handleAddResult() {
        const response = await fillApi.add_result(questionId);
        if (response.error) {
            console.error("Failed to add result:", response.error);
            return;
        }

        if (Array.isArray(response.results)) {
            setLocalResults(
                response.results.map((r) => ({
                    id: r.id,
                    content: r.content || "",
                }))
            );
        } else {
            addResult(response.result_id || Date.now());
        }
    }

    async function removeResult(id) {
        const response = await fillApi.remove_result(questionId, id);
        if (response.error) {
            console.error("Failed to remove result:", response.error);
            return;
        }

        if (localResults.length > 1) {
            setLocalResults((prev) => prev.filter((result) => result.id !== id));
        }
    }

    return (
        <div>
            {/* Câu hỏi */}
            <AnswerForm content={content} />

            {/* Danh sách đáp án */}
            <div className="space-y-4 mb-6">
                {localResults.map((result) => (
                    <div
                        key={result.id}
                        className="relative flex flex-col sm:flex-row gap-4 bg-[#FF8C42]/10 rounded-lg p-4"
                    >
                        {/* Ô nội dung */}
                        <div className="flex-1 relative w-[98%] min-h-[3rem]">
                            <div
                                ref={(el) => (contentRefs.current[result.id] = el)}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={() => handleTextChange(result.id)}
                                className="w-full bg-[#FF8C42] text-white rounded-lg p-4 outline-none whitespace-pre-wrap break-words min-h-[3rem]"
                                data-placeholder="Nhập đáp án ở đây..."
                            />
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
                    onClick={handleAddResult}
                    className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
}
