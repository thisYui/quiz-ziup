import { useState, useEffect, useRef } from "react";
import { CHOICE_FORM } from "../../../constants/index.js";
import AnswerForm from "./AnswerForm.jsx";

export default function ChoiceQuestion({ questionType = "single-choice", options = [] }) {
    const [position, setPosition] = useState(0);
    const [localOptions, setLocalOptions] = useState([]);
    const optionRefs = useRef({});

    useEffect(() => {
        options.forEach((opt) => {
            if (optionRefs.current[opt.id]) {
                optionRefs.current[opt.id].textContent = opt.text || "";
            }
        });
        setLocalOptions(options);
        const max = Math.max(...options.map(o => o.position ?? 0), 0);
        setPosition(max + 1);
    }, [options]);

    const setOptionRef = (id) => (el) => {
        optionRefs.current[id] = el;
    };

    const handleOptionCorrectChange = (optionId) => {
        // Cập nhật lại tất cả text từ DOM vào state trước
        const updatedOptions = localOptions.map((option) => {
            const el = optionRefs.current[option.id];
            const text = el?.textContent || "";
            return {
                ...option,
                text,
                isCorrect:
                    questionType === "single-choice"
                        ? option.id === optionId
                        : option.id === optionId
                            ? !option.isCorrect
                            : option.isCorrect,
            };
        });

        setLocalOptions(updatedOptions);
    };

    const handleOptionTextChange = (optionId) => {
        const el = optionRefs.current[optionId];
        const text = el?.textContent || "";
        setLocalOptions(prev =>
            prev.map(opt =>
                opt.id === optionId ? { ...opt, text } : opt
            )
        );
    };

    const addOption = (template = CHOICE_FORM) => {
        const newOption = {
            ...template,
            id: Date.now(),
            position,
            text: "",
            isCorrect: false
        };
        setLocalOptions([...localOptions, newOption]);
        setPosition(position + 1);
    };

    const removeOption = (optionId) => {
        if (localOptions.length > 2) {
            setLocalOptions(localOptions.filter((option) => option.id !== optionId));
        }
    };

    return (
        <div>
            {/* Câu hỏi */}
            <AnswerForm />

            {/* Các lựa chọn */}
            <div className="space-y-4 mb-6">
                {localOptions.map((option) => (
                    <div key={option.id} className="relative flex flex-col sm:flex-row gap-4 bg-[#FF8C42]/10 rounded-lg p-4">
                        {/* Tick */}
                        <button
                            onClick={() => handleOptionCorrectChange(option.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center hover:bg-blue-600 justify-center transition-colors ${
                                option.isCorrect ? "bg-blue-600 border-white" : "bg-white border-white/50"
                            }`}
                        >
                            {option.isCorrect && (
                                <svg className="w-4 h-4 text-[#FF8C42]" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Nội dung và xoá */}
                        <div className="flex-1 relative w-[98%] min-h-[3rem]">
                            <div
                                ref={setOptionRef(option.id)}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={() => handleOptionTextChange(option.id)}
                                className="w-full bg-[#FF8C42] text-white rounded-lg p-4 outline-none whitespace-pre-wrap break-all min-h-[3rem]"
                            ></div>

                            {(!option.text || option.text.trim() === "") && (
                                <div className="absolute inset-0 pointer-events-none p-4 text-white/60">
                                    Nhập đáp án ở đây...
                                </div>
                            )}
                        </div>

                        {localOptions.length > 2 && (
                            <button
                                onClick={() => removeOption(option.id)}
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
                    onClick={() => addOption(CHOICE_FORM)}
                    className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
}
