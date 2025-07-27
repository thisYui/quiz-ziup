import { useState, useEffect, useRef } from "react";
import AnswerForm from "./AnswerForm.jsx";

export default function MatchingQuestion({ options = [], results = [] }) {
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [connections, setConnections] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedSide, setDraggedSide] = useState(null);

    const leftRefs = useRef({});
    const rightRefs = useRef({});

    // Initialize from props
    useEffect(() => {
        const left = options.filter(opt => opt.side === 0);
        const right = options.filter(opt => opt.side === 1);
        setLeftItems(left);
        setRightItems(right);

        const initConnections = results.map(res => ({
            leftId: res.option_left_id,
            rightId: res.option_right_id
        }));
        setConnections(initConnections);
    }, [options, results]);

    const handleItemChange = (id, side, value) => {
        const updateFn = side === "left" ? setLeftItems : setRightItems;
        const list = side === "left" ? leftItems : rightItems;
        updateFn(
            list.map(item => (item.id === id ? { ...item, text: value } : item))
        );
    };

    const addItem = (side) => {
        const list = side === "left" ? leftItems : rightItems;
        const updateFn = side === "left" ? setLeftItems : setRightItems;
        const newId = Date.now();
        updateFn([...list, { id: newId, text: "", side: side === "left" ? 0 : 1 }]);
    };

    const removeItem = (id, side) => {
        const list = side === "left" ? leftItems : rightItems;
        const updateFn = side === "left" ? setLeftItems : setRightItems;
        if (list.length > 1) {
            updateFn(list.filter(item => item.id !== id));
            setConnections(
                connections.filter(conn =>
                    side === "left" ? conn.leftId !== id : conn.rightId !== id
                )
            );
        }
    };

    const handleDragStart = (item, side) => {
        setDraggedItem(item);
        setDraggedSide(side);
    };

    const handleDrop = (targetItem, targetSide) => {
        if (!draggedItem || draggedSide === targetSide) return;

        const newConnection = {
            leftId: draggedSide === "left" ? draggedItem.id : targetItem.id,
            rightId: draggedSide === "right" ? draggedItem.id : targetItem.id
        };

        // Remove existing connections for either side
        const filtered = connections.filter(
            conn =>
                conn.leftId !== newConnection.leftId &&
                conn.rightId !== newConnection.rightId
        );

        setConnections([...filtered, newConnection]);
        setDraggedItem(null);
        setDraggedSide(null);
    };

    const removeConnection = (leftId, rightId) => {
        setConnections(
            connections.filter(conn => !(conn.leftId === leftId && conn.rightId === rightId))
        );
    };

    return (
        <div>
            <AnswerForm />

            <div className="relative">
                <div className="flex flex-wrap gap-12 justify-between mb-6">
                    {/* Left Column */}
                    <div className="flex-1 min-w-[300px] space-y-4">
                        {leftItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="relative"
                                draggable
                                onDragStart={() => handleDragStart(item, "left")}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(item, "left")}
                                ref={(el) => (leftRefs.current[item.id] = el)}
                            >
                                <div className="bg-[#2563EB] rounded-lg p-4 cursor-move hover:bg-[#1D4ED8] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-white rounded text-[#2563EB] font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(e) => handleItemChange(item.id, "left", e.target.value)}
                                            placeholder={`Trái ${index + 1}`}
                                            className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        {leftItems.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(item.id, "left");
                                                }}
                                                className="w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 transition-colors flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => addItem("left")}
                            className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                        >
                            +
                        </button>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 min-w-[300px] space-y-4">
                        {rightItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="relative"
                                draggable
                                onDragStart={() => handleDragStart(item, "right")}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(item, "right")}
                                ref={(el) => (rightRefs.current[item.id] = el)}
                            >
                                <div
                                    className={`rounded-lg p-4 cursor-move transition-colors ${
                                        index % 2 === 0
                                            ? "bg-[#2563EB] hover:bg-[#1D4ED8]"
                                            : "bg-[#FF8C42] hover:bg-[#E07B39]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-white rounded text-black font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(e) => handleItemChange(item.id, "right", e.target.value)}
                                            placeholder={`Phải ${index + 1}`}
                                            className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        {rightItems.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(item.id, "right");
                                                }}
                                                className="w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 transition-colors flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => addItem("right")}
                            className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {connections.map((conn, index) => {
                        const leftEl = leftRefs.current[conn.leftId];
                        const rightEl = rightRefs.current[conn.rightId];

                        if (!leftEl || !rightEl) return null;

                        const leftRect = leftEl.getBoundingClientRect();
                        const rightRect = rightEl.getBoundingClientRect();

                        const containerRect = leftEl.offsetParent.getBoundingClientRect();

                        const x1 = leftRect.right - containerRect.left;
                        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;

                        const x2 = rightRect.left - containerRect.left;
                        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

                        return (
                            <line
                                key={index}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#FF8C42"
                                strokeWidth="3"
                                className="cursor-pointer"
                                onClick={() => removeConnection(conn.leftId, conn.rightId)}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
