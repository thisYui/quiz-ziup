import { useState, useEffect, useRef } from "react";
import { CHOICE_FORM, QUESTION_TYPE_NUMBER } from "../../../constants/index.js";
import AnswerForm from "./AnswerForm.jsx";
import { questionApi } from "../../../services/apiService.js";

export default function ChoiceQuestion({ questionId, questionType, content, options = [] }) {
    const [position, setPosition] = useState(0);
    const [localOptions, setLocalOptions] = useState([]);
    const contentRefs = useRef({});
    const choiceApi = questionApi.choice;

    useEffect(() => {
        const mapped = options.map(opt => ({
            ...opt,
            text: opt.text || opt.content || ""
        }));
        setLocalOptions(mapped);

        const max = Math.max(...options.map(o => o.position ?? 0), 0);
        setPosition(max + 1);

        // Cập nhật lại nội dung cho từng contentEditable sau khi mount
        setTimeout(() => {
            mapped.forEach(opt => {
                const el = contentRefs.current[opt.id];
                if (el && el.textContent !== opt.text) {
                    el.textContent = opt.text;
                }
            });
        }, 0);
    }, [options]);

    const handleOptionCorrectChange = (optionId) => {
        const response = choiceApi.choice_result(questionId, optionId);
        if (response.error) {
            console.error("Failed to update choice result:", response.error);
            return;
        }

        setLocalOptions(prev =>
            prev.map(option => ({
                ...option,
                isCorrect:
                    questionType === QUESTION_TYPE_NUMBER.SINGLE_CHOICE
                        ? option.id === optionId
                        : option.id === optionId
                            ? !option.isCorrect
                            : option.isCorrect
            }))
        );
    };

    const handleOptionTextChange = (optionId, newText) => {
        setLocalOptions(prev =>
            prev.map(option =>
                option.id === optionId ? { ...option, text: newText } : option
            )
        );
    };

    const addOption = (newOption) => {
        setLocalOptions(prev => [...prev, newOption]);
        setPosition(prev => prev + 1);
    };

    async function handleAddOption() {
        const { option_id } = await choiceApi.add_option(questionId, position);
        const newOption = {
            ...CHOICE_FORM,
            id: option_id,
            position
        };
        addOption(newOption);
    }

    const removeOption = async (optionId) => {
        const response = await choiceApi.remove_option(questionId, optionId);
        if (response.error) {
            console.error("Failed to remove option:", response.error);
            return;
        }

        if (localOptions.length > 2) {
            setLocalOptions(prev => prev.filter(option => option.id !== optionId));
        }
    };

    return (
        <div>
            {/* Câu hỏi */}
            <AnswerForm content={content} />

            {/* Các lựa chọn */}
            <div className="space-y-4 mb-6">
                {localOptions.map((option) => (
                    <div
                        key={option.id}
                        className="relative flex flex-col sm:flex-row gap-4 bg-[#FF8C42]/10 rounded-lg p-4"
                    >
                        {/* Tick chọn */}
                        <button
                            onClick={() => handleOptionCorrectChange(option.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center hover:bg-blue-600 justify-center transition-colors ${
                                option.isCorrect
                                    ? "bg-blue-600 border-white"
                                    : "bg-white border-white/50"
                            }`}
                        >
                            {option.isCorrect && (
                                <svg
                                    className="w-4 h-4 text-[#FF8C42]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Nội dung lựa chọn */}
                        <div className="flex-1 relative w-[98%] min-h-[3rem]">
                            <div
                                ref={(el) => {
                                    if (el) contentRefs.current[option.id] = el;
                                }}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                    const newText = e.currentTarget.textContent;
                                    handleOptionTextChange(option.id, newText);
                                }}
                                className="w-full bg-[#FF8C42] text-white rounded-lg p-4 outline-none whitespace-pre-wrap break-all min-h-[3rem]"
                                spellCheck={false}
                            />

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
                                aria-label="Remove choice"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}

                {/* Nút thêm lựa chọn */}
                <button
                    onClick={handleAddOption}
                    className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
}
