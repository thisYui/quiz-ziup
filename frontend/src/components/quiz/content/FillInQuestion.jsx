import { useEffect, useRef, useState, useCallback } from "react";
import AnswerForm from "./AnswerForm.jsx";
import { FILL_IN_FORM } from "../../../constants/index.js";
import { questionApi } from "../../../services/apiService.js";
import { useObserverStore } from "../../../hooks/useObserverStore.js";

export default function FillInQuestion({
                                           questionId,
                                           content,
                                           results = [],
                                           activeSectionId
                                       }) {
    const [localResults, setLocalResults] = useState([]);
    const fillApi = questionApi.fill_in_blank;
    const contentRefs = useRef({});
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
        const initialized = results.map((r) => ({
            id: r.id,
            content: r.content || "",
        }));
        setLocalResults(initialized);

        // Sync contentEditable text without losing cursor
        setTimeout(() => {
            initialized.forEach((result) => {
                const el = contentRefs.current[result.id];
                if (el && el.textContent !== result.content) {
                    const cursorPos = saveCursorPosition(el);
                    el.textContent = result.content;
                    restoreCursorPosition(el, cursorPos);
                }
            });
        }, 0);
    }, [results, saveCursorPosition, restoreCursorPosition]);

    // Update observer when active
    useEffect(() => {
        if (activeSectionId !== questionId) return;

        updateObserver(questionId, {
            results: localResults
        });
    }, [localResults, activeSectionId, questionId, updateObserver]);

    const handleTextChange = useCallback((id, newText) => {
        setLocalResults((prev) =>
            prev.map((result) =>
                result.id === id ? { ...result, content: newText } : result
            )
        );
    }, []);

    const handleTextInput = useCallback((id, e) => {
        const newText = e.currentTarget.textContent;
        handleTextChange(id, newText);
    }, [handleTextChange]);

    const addResult = useCallback((resultID, content = "") => {
        setLocalResults((prev) => [
            ...prev,
            {
                id: resultID,
                content: content,
            },
        ]);
    }, []);

    const handleAddResult = async () => {
        try {
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
        } catch (err) {
            console.error("Error adding result:", err);
        }
    };

    const removeResult = async (id) => {
        if (localResults.length <= 1) return;

        try {
            const response = await fillApi.remove_result(questionId, id);
            if (response.error) {
                console.error("Failed to remove result:", response.error);
                return;
            }

            setLocalResults((prev) => prev.filter((result) => result.id !== id));

            // Cleanup ref
            if (contentRefs.current[id]) {
                delete contentRefs.current[id];
            }
        } catch (err) {
            console.error("Error removing result:", err);
        }
    };

    return (
        <div>
            {/* Question */}
            <AnswerForm
                questionId={questionId}
                content={content}
                activeSectionId={activeSectionId}
            />

            {/* Results list */}
            <div className="space-y-4 mb-6">
                {localResults.map((result) => (
                    <div
                        key={result.id}
                        className="relative flex flex-col sm:flex-row gap-4 bg-[#FF8C42]/10 rounded-lg p-4"
                    >
                        {/* Content input */}
                        <div className="flex-1 relative w-[98%] min-h-[3rem]">
                            {/* Placeholder */}
                            {(!result.content || result.content.trim() === "") && (
                                <div className="absolute inset-0 pointer-events-none p-4 text-white/60 flex items-center">
                                    Nhập đáp án ở đây...
                                </div>
                            )}

                            <div
                                ref={(el) => {
                                    if (el) contentRefs.current[result.id] = el;
                                }}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => handleTextInput(result.id, e)}
                                onBlur={(e) => {
                                    const newText = e.currentTarget.textContent;
                                    handleTextChange(result.id, newText);
                                }}
                                className="w-full bg-[#FF8C42] text-white rounded-lg p-4 outline-none whitespace-pre-wrap break-words min-h-[3rem] focus:ring-2 focus:ring-[#FF8C42]/50"
                                spellCheck={false}
                            />
                        </div>

                        {/* Remove button */}
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

                {/* Add button */}
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