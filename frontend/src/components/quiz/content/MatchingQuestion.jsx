import React, { useEffect, useRef, useState } from "react";
import Xarrow from "react-xarrows";
import AnswerForm from "./AnswerForm.jsx";
import { questionApi } from "../../../services/apiService.js";

const SIDE = {
    LEFT: 0,
    RIGHT: 1,
};

export default function MatchingQuestion({ questionId, content, options = [], results = [] }) {
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [connections, setConnections] = useState([]);
    const [dragged, setDragged] = useState(null);
    const contentRefs = useRef({}); // id -> ref

    const matchApi = questionApi.matching;

    useEffect(() => {
        setLeftItems(options.filter((o) => o.side === SIDE.LEFT));
        setRightItems(options.filter((o) => o.side === SIDE.RIGHT));
        setConnections(results);
    }, [options, results]);

    const handleAddItem = async (side) => {
        const list = side === SIDE.LEFT ? leftItems : rightItems;
        const position = Math.max(...list.map((i) => i.position ?? 0), 0) + 1;
        const res = await matchApi.add_option(questionId, side, position);
        if (res?.option_id) {
            const newItem = { id: res.option_id, content: "", side, position };
            if (side === SIDE.LEFT) setLeftItems((prev) => [...prev, newItem]);
            else setRightItems((prev) => [...prev, newItem]);
        }
    };

    const handleRemoveItem = async (id, side) => {
        const res = await matchApi.remove_option(questionId, id);
        if (res.error) return;
        if (side === SIDE.LEFT) {
            setLeftItems((prev) => prev.filter((i) => i.id !== id));
            setConnections((prev) => prev.filter((c) => c.option_left_id !== id));
        } else {
            setRightItems((prev) => prev.filter((i) => i.id !== id));
            setConnections((prev) => prev.filter((c) => c.option_right_id !== id));
        }
        delete contentRefs.current[id];
    };

    const handleConnect = async (draggedItem, draggedSide, targetItem, targetSide) => {
        if (draggedSide === targetSide) return;
        const leftId = draggedSide === SIDE.LEFT ? draggedItem.id : targetItem.id;
        const rightId = draggedSide === SIDE.RIGHT ? draggedItem.id : targetItem.id;
        const res = await matchApi.add_result(questionId, leftId, rightId);
        if (!res?.result_id) return;
        setConnections((prev) => {
            const filtered = prev.filter(
                (c) => c.option_left_id !== leftId && c.option_right_id !== rightId
            );
            return [...filtered, { id: res.result_id, option_left_id: leftId, option_right_id: rightId }];
        });
    };

    const handleDisconnect = async (resultId) => {
        const res = await matchApi.remove_result(questionId, resultId);
        if (res.error) return;
        setConnections((prev) => prev.filter((c) => c.id !== resultId));
    };

    const renderItems = (items, side) => (
        <div className="flex-1 min-w-[300px] max-w-[48%] space-y-4">
            {items.map((item, index) => {
                const connectedResult =
                    side === SIDE.LEFT
                        ? connections.find((c) => c.option_left_id === item.id)
                        : connections.find((c) => c.option_right_id === item.id);
                const resultId = connectedResult?.id;

                if (!contentRefs.current[item.id]) {
                    contentRefs.current[item.id] = React.createRef();
                }

                return (
                    <div
                        key={item.id}
                        id={`${side === SIDE.LEFT ? "left" : "right"}-${item.id}`}
                        draggable
                        onDragStart={() => setDragged({ item, side })}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                            if (dragged) {
                                handleConnect(dragged.item, dragged.side, item, side);
                                setDragged(null);
                            }
                        }}
                        className={`relative p-4 rounded-lg cursor-move flex items-start gap-3 transition-colors ${
                            side === SIDE.LEFT ? "bg-blue-600" : "bg-orange-500"
                        }`}
                    >
            <span className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded shrink-0">
              {index + 1}
            </span>

                        <div
                            ref={contentRefs.current[item.id]}
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder={`${side === SIDE.LEFT ? "Trái" : "Phải"} ${index + 1}`}
                            onBlur={(e) => {
                                const newText = e.currentTarget.textContent;
                                const updater = side === SIDE.LEFT ? setLeftItems : setRightItems;
                                updater((prev) =>
                                    prev.map((i) => (i.id === item.id ? { ...i, content: newText } : i))
                                );
                            }}
                            className="flex-1 outline-none text-white placeholder-white/70 bg-transparent px-1 py-0.5 whitespace-pre-wrap break-words"
                            style={{
                                minWidth: "50px",
                                maxWidth: "100%",
                                minHeight: "2rem",
                                maxHeight: "6rem",
                                overflow: "auto",
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                            }}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />

                        {items.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(item.id, side);
                                }}
                                className="w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 flex items-center justify-center"
                            >
                                ×
                            </button>
                        )}

                        {connectedResult && (
                            <button
                                onClick={() => handleDisconnect(resultId)}
                                className="ml-2 px-2 py-1 bg-white/20 text-xs text-white rounded hover:bg-red-500"
                            >
                                Hủy nối
                            </button>
                        )}
                    </div>
                );
            })}
            <button
                onClick={() => handleAddItem(side)}
                className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D]"
            >
                +
            </button>
        </div>
    );

    return (
        <div className="relative">
            <AnswerForm content={content} />
            <div className="flex flex-wrap gap-12 justify-between mb-6 items-start">
                {renderItems(leftItems, SIDE.LEFT)}
                {renderItems(rightItems, SIDE.RIGHT)}
            </div>
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
