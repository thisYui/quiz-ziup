import React, { useEffect, useRef, useState, useCallback } from "react";
import Xarrow from "react-xarrows";
import AnswerForm from "./AnswerForm.jsx";
import { questionApi } from "../../../services/apiService.js";
import { useObserverStore } from "../../../hooks/useObserverStore.js";

const SIDE = {
    LEFT: 0,
    RIGHT: 1,
};

export default function MatchingQuestion({
                                             questionId,
                                             content,
                                             options = [],
                                             results = [],
                                             activeSectionId
                                         }) {
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [connections, setConnections] = useState([]);
    const [dragged, setDragged] = useState(null);
    const contentRefs = useRef({});
    const matchApi = questionApi.matching;
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
        const left = options.filter((o) => o.side === SIDE.LEFT);
        const right = options.filter((o) => o.side === SIDE.RIGHT);

        setLeftItems(left);
        setRightItems(right);
        setConnections(results);

        // Sync contentEditable without losing cursor
        setTimeout(() => {
            [...left, ...right].forEach((item) => {
                const el = contentRefs.current[item.id];
                if (el && el.innerHTML !== item.content) {
                    const cursorPos = saveCursorPosition(el);
                    el.innerHTML = item.content || "";
                    restoreCursorPosition(el, cursorPos);
                }
            });
        }, 0);
    }, [options, results, saveCursorPosition, restoreCursorPosition]);

    // Update observer when active
    useEffect(() => {
        if (activeSectionId !== questionId) return;

        const allOptions = [...leftItems, ...rightItems];
        updateObserver(questionId, {
            options: allOptions,
            results: connections
        });
    }, [leftItems, rightItems, connections, activeSectionId, questionId, updateObserver]);

    const handleAddItem = async (side) => {
        try {
            const list = side === SIDE.LEFT ? leftItems : rightItems;
            const position = Math.max(...list.map((i) => i.position ?? 0), 0) + 1;

            const res = await matchApi.add_option(questionId, side, position);
            if (!res?.option_id) {
                console.error("Failed to add item:", res);
                return;
            }

            const newItem = {
                id: res.option_id,
                content: "",
                side,
                position
            };

            if (side === SIDE.LEFT) {
                setLeftItems((prev) => [...prev, newItem]);
            } else {
                setRightItems((prev) => [...prev, newItem]);
            }
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    const handleRemoveItem = async (id, side) => {
        try {
            const res = await matchApi.remove_option(questionId, id);
            if (res.error) {
                console.error("Failed to remove item:", res.error);
                return;
            }

            if (side === SIDE.LEFT) {
                setLeftItems((prev) => prev.filter((i) => i.id !== id));
                setConnections((prev) => prev.filter((c) => c.option_left_id !== id));
            } else {
                setRightItems((prev) => prev.filter((i) => i.id !== id));
                setConnections((prev) => prev.filter((c) => c.option_right_id !== id));
            }

            // Cleanup ref
            if (contentRefs.current[id]) {
                delete contentRefs.current[id];
            }
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    const handleConnect = async (draggedItem, draggedSide, targetItem, targetSide) => {
        if (draggedSide === targetSide) return;

        try {
            const leftId = draggedSide === SIDE.LEFT ? draggedItem.id : targetItem.id;
            const rightId = draggedSide === SIDE.RIGHT ? draggedItem.id : targetItem.id;

            const res = await matchApi.add_result(questionId, leftId, rightId);
            if (!res?.result_id) {
                console.error("Failed to connect items:", res);
                return;
            }

            setConnections((prev) => {
                // Remove existing connections for these items
                const filtered = prev.filter(
                    (c) => c.option_left_id !== leftId && c.option_right_id !== rightId
                );
                return [...filtered, {
                    id: res.result_id,
                    option_left_id: leftId,
                    option_right_id: rightId
                }];
            });
        } catch (err) {
            console.error("Error connecting items:", err);
        }
    };

    const handleDisconnect = async (resultId) => {
        try {
            const res = await matchApi.remove_result(questionId, resultId);
            if (res.error) {
                console.error("Failed to disconnect:", res.error);
                return;
            }

            setConnections((prev) => prev.filter((c) => c.id !== resultId));
        } catch (err) {
            console.error("Error disconnecting:", err);
        }
    };

    const handleItemTextChange = useCallback((itemId, newText, side) => {
        const setter = side === SIDE.LEFT ? setLeftItems : setRightItems;
        setter((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, content: newText } : i))
        );
    }, []);

    const renderItems = (items, side) => (
        <div className="flex-1 min-w-[300px] max-w-[48%] space-y-4">
            {items.map((item, index) => {
                const connectedResult =
                    side === SIDE.LEFT
                        ? connections.find((c) => c.option_left_id === item.id)
                        : connections.find((c) => c.option_right_id === item.id);
                const resultId = connectedResult?.id;

                return (
                    <div
                        key={item.id}
                        id={`${side === SIDE.LEFT ? "left" : "right"}-${item.id}`}
                        draggable
                        onDragStart={() => setDragged({ item, side })}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (dragged && dragged.item.id !== item.id) {
                                handleConnect(dragged.item, dragged.side, item, side);
                                setDragged(null);
                            }
                        }}
                        className={`relative p-4 rounded-lg cursor-move flex items-start gap-3 transition-colors ${
                            side === SIDE.LEFT ? "bg-blue-600" : "bg-orange-500"
                        } ${dragged?.item.id === item.id ? "opacity-50" : ""}`}
                    >
                        <span className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded shrink-0">
                            {index + 1}
                        </span>

                        <div className="flex-1 relative">
                            {/* Placeholder */}
                            {(!item.content || item.content.trim() === "") && (
                                <div className="absolute inset-0 pointer-events-none text-white/60 flex items-center">
                                    {side === SIDE.LEFT ? "Trái" : "Phải"} {index + 1}
                                </div>
                            )}

                            <div
                                ref={(el) => {
                                    if (el) contentRefs.current[item.id] = el;
                                }}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => {
                                    const newText = e.currentTarget.innerHTML;
                                    handleItemTextChange(item.id, newText, side);
                                }}
                                onBlur={(e) => {
                                    const newText = e.currentTarget.innerHTML;
                                    handleItemTextChange(item.id, newText, side);
                                }}
                                className="outline-none text-white bg-transparent px-1 py-0.5 whitespace-pre-wrap break-words min-h-[2rem] focus:ring-2 focus:ring-white/30 rounded"
                                style={{
                                    minWidth: "50px",
                                    maxWidth: "100%",
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere",
                                }}
                                spellCheck={false}
                            />
                        </div>

                        {/* Remove button */}
                        {items.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(item.id, side);
                                }}
                                className="w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                ×
                            </button>
                        )}

                        {/* Disconnect button */}
                        {connectedResult && (
                            <button
                                onClick={() => handleDisconnect(resultId)}
                                className="ml-2 px-2 py-1 bg-white/20 text-xs text-white rounded hover:bg-red-500 transition-colors"
                            >
                                Hủy nối
                            </button>
                        )}
                    </div>
                );
            })}

            {/* Add item button */}
            <button
                onClick={() => handleAddItem(side)}
                className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
            >
                +
            </button>
        </div>
    );

    return (
        <div className="relative">
            <AnswerForm
                questionId={questionId}
                content={content}
                activeSectionId={activeSectionId}
            />

            <div className="flex flex-wrap gap-12 justify-between mb-6 items-start">
                {renderItems(leftItems, SIDE.LEFT)}
                {renderItems(rightItems, SIDE.RIGHT)}
            </div>

            {/* Connection arrows */}
            {connections.map((conn) => (
                <Xarrow
                    key={conn.id}
                    start={`left-${conn.option_left_id}`}
                    end={`right-${conn.option_right_id}`}
                    color="#00FFFF"
                    strokeWidth={3}
                    showHead={false}
                    curveness={0.5}
                />
            ))}
        </div>
    );
}