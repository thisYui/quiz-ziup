import { useEffect, useRef, useState, useCallback } from "react";
import { useObserverStore } from "../../../hooks/useObserverStore";

export default function AnswerForm({ questionId, content = "", activeSectionId }) {
    const [text, setText] = useState(content);
    const divRef = useRef(null);
    const updateObserver = useObserverStore((state) => state.updateQuestionPart);

    // Preserve cursor position helper
    const saveCursorPosition = useCallback(() => {
        if (!divRef.current) return null;

        const selection = window.getSelection();
        if (!selection.rangeCount) return null;

        const range = selection.getRangeAt(0);
        if (!divRef.current.contains(range.commonAncestorContainer)) return null;

        return {
            startOffset: range.startOffset,
            endOffset: range.endOffset,
            startContainer: range.startContainer,
            endContainer: range.endContainer
        };
    }, []);

    const restoreCursorPosition = useCallback((position) => {
        if (!position || !divRef.current) return;

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
            range.selectNodeContents(divRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, []);

    // Update UI when prop content changes from outside
    useEffect(() => {
        setText(content);
        if (divRef.current && divRef.current.innerText !== content) {
            const cursorPos = saveCursorPosition();
            divRef.current.innerText = content;
            restoreCursorPosition(cursorPos);
        }
    }, [content, saveCursorPosition, restoreCursorPosition]);

    // Send data to observer when section is active
    useEffect(() => {
        if (activeSectionId !== questionId) return;

        updateObserver(questionId, { content: text });
    }, [text, activeSectionId, questionId, updateObserver]);

    const handleInput = useCallback((e) => {
        const newText = e.currentTarget.textContent;
        setText(newText);
    }, []);

    return (
        <div className="mb-6 relative">
            {/* Placeholder overlay */}
            {text.trim() === "" && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg p-4 pointer-events-none select-none opacity-60">
                    Nhập câu hỏi của bạn ở đây...
                </div>
            )}

            <div
                ref={divRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="answer-editable w-full min-h-[5rem] bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white text-lg p-4 rounded-lg outline-none whitespace-pre-wrap break-words text-center focus:ring-2 focus:ring-[#9333EA]/50"
                spellCheck={false}
            />
        </div>
    );
}