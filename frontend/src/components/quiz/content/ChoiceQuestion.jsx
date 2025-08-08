import { useState, useEffect, useRef, useCallback } from "react";
import { CHOICE_FORM, QUESTION_TYPE_NUMBER } from "../../../constants/index.js";
import AnswerForm from "./AnswerForm.jsx";
import { questionApi } from "../../../services/apiService.js";
import { useObserverStore } from "../../../hooks/useObserverStore.js";

export default function ChoiceQuestion({
                                           questionId,
                                           questionType,
                                           content,
                                           options = [],
                                           activeSectionId
                                       }) {
    const [position, setPosition] = useState(0);
    const [localOptions, setLocalOptions] = useState([]);
    const contentRefs = useRef({});
    const choiceApi = questionApi.choice;
    const updateObserver = useObserverStore((state) => state.updateQuestionPart);

    // Preserve cursor position helper
    const saveCursorPosition = useCallback((element) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;

        const range = selection.getRangeAt(0);
        if (!element.contains(range.commonAncestorContainer)) return null;

        return {
            startOffset: range.startOffset,
            endOffset: range.endOffset,
            startContainer: range.startContainer,
            endContainer: range.endContainer
        };
    }, []);

    const restoreCursorPosition = useCallback((element, position) => {
        if (!position) return;

        try {
            const selection = window.getSelection();
            const range = document.createRange();

            range.setStart(position.startContainer, position.startOffset);
            range.setEnd(position.endContainer, position.endOffset);

            selection.removeAllRanges();
            selection.addRange(range);
        } catch (err) {
            // Fallback: move cursor to end
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, []);

    // Initialize from props
    useEffect(() => {
        const mapped = options.map(opt => ({
            ...opt,
            text: opt.text || opt.content || ""
        }));
        setLocalOptions(mapped);

        const max = Math.max(...options.map(o => o.position ?? 0), 0);
        setPosition(max + 1);

        // Sync contentEditable without losing cursor
        setTimeout(() => {
            mapped.forEach(opt => {
                const el = contentRefs.current[opt.id];
                if (el && el.textContent !== opt.text) {
                    const cursorPos = saveCursorPosition(el);
                    el.textContent = opt.text;
                    restoreCursorPosition(el, cursorPos);
                }
            });
        }, 0);
    }, [options, saveCursorPosition, restoreCursorPosition]);

    // Update observer when active
    useEffect(() => {
        if (activeSectionId !== questionId) return;

        // Prepare results array based on question type
        const results = localOptions
            .filter(opt => opt.is_correct)
            .map(opt => ({ id: opt.id, is_correct: true }));

        updateObserver(questionId, {
            options: localOptions,
            results: results
        });
    }, [localOptions, activeSectionId, questionId, updateObserver]);

    const handleOptionCorrectChange = async (optionId) => {
        try {
            if (questionType === QUESTION_TYPE_NUMBER.SINGLE_CHOICE) {
                const response = await choiceApi.single_result(questionId, optionId);
                if (response.error) {
                    console.error("Failed to update single choice result:", response.error);
                    return;
                }

                // Update local state - only one answer is correct
                setLocalOptions(prev =>
                    prev.map(opt => ({
                        ...opt,
                        is_correct: opt.id === optionId
                    }))
                );
            } else {
                const response = await choiceApi.choice_result(questionId, optionId);
                if (response.error) {
                    console.error("Failed to update choice result:", response.error);
                    return;
                }

                // Toggle correct/incorrect
                setLocalOptions(prev =>
                    prev.map(opt =>
                        opt.id === optionId ? { ...opt, is_correct: !opt.is_correct } : opt
                    )
                );
            }
        } catch (err) {
            console.error("Error updating option correct status:", err);
        }
    };

    const handleOptionTextChange = useCallback((optionId, newText) => {
        setLocalOptions(prev =>
            prev.map(option =>
                option.id === optionId ? { ...option, text: newText, content: newText } : option
            )
        );
    }, []);

    const addOption = useCallback((newOption) => {
        setLocalOptions(prev => [...prev, newOption]);
        setPosition(prev => prev + 1);
    }, []);

    const handleAddOption = async () => {
        try {
            const { option_id } = await choiceApi.add_option(questionId, position);
            const newOption = {
                ...CHOICE_FORM,
                id: option_id,
                position,
                text: "",
                content: "",
                is_correct: false
            };
            addOption(newOption);
        } catch (err) {
            console.error("Error adding option:", err);
        }
    };

    const removeOption = async (optionId) => {
        if (localOptions.length <= 2) return;

        try {
            const response = await choiceApi.remove_option(questionId, optionId);
            if (response.error) {
                console.error("Failed to remove option:", response.error);
                return;
            }

            setLocalOptions(prev => prev.filter(option => option.id !== optionId));

            // Cleanup ref
            if (contentRefs.current[optionId]) {
                delete contentRefs.current[optionId];
            }
        } catch (err) {
            console.error("Error removing option:", err);
        }
    };

    const handleTextInput = useCallback((optionId, e) => {
        const newText = e.currentTarget.textContent;
        handleOptionTextChange(optionId, newText);
    }, [handleOptionTextChange]);

    return (
        <div>
            {/* Question */}
            <AnswerForm
                questionId={questionId}
                content={content}
                activeSectionId={activeSectionId}
            />

            {/* Options */}
            <div className="space-y-4 mb-6">
                {localOptions.map((option) => (
                    <div
                        key={option.id}
                        className="relative flex flex-col sm:flex-row gap-4 bg-[#FF8C42]/10 rounded-lg p-4"
                    >
                        {/* Correct tick */}
                        <button
                            onClick={() => handleOptionCorrectChange(option.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center hover:bg-blue-600 justify-center transition-colors ${
                                option.is_correct
                                    ? "bg-blue-600 border-white"
                                    : "bg-white border-white/50"
                            }`}
                        >
                            {option.is_correct && (
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

                        {/* Option content */}
                        <div className="flex-1 relative w-[98%] min-h-[3rem]">
                            {/* Placeholder */}
                            {(!option.text || option.text.trim() === "") && (
                                <div className="absolute inset-0 pointer-events-none p-4 text-white/60 flex items-center">
                                    Nhập đáp án ở đây...
                                </div>
                            )}

                            <div
                                ref={(el) => {
                                    if (el) contentRefs.current[option.id] = el;
                                }}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => handleTextInput(option.id, e)}
                                onBlur={(e) => {
                                    const newText = e.currentTarget.textContent;
                                    handleOptionTextChange(option.id, newText);
                                }}
                                className="w-full bg-[#FF8C42] text-white rounded-lg p-4 outline-none whitespace-pre-wrap break-all min-h-[3rem] focus:ring-2 focus:ring-[#FF8C42]/50"
                                spellCheck={false}
                            />
                        </div>

                        {/* Remove button */}
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

                {/* Add option button */}
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