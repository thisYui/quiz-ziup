import { useState } from "react";
import { QUESTION_TYPE, LEVEL_QUESTION } from "../../../constants/index.js";

export default function HeaderQuestion({ questionType, setQuestionType }) {
    const [selectedLevel, setSelectedLevel] = useState(0);
    const [point, setPoint] = useState(1);

    return (
        <div className="flex justify-between items-center mb-6 mx-auto gap-4">
            {/* Chọn độ khó */}
            <div className="flex items-center gap-2">
                <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(Number(e.target.value))}
                    className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium focus:outline-none"
                >
                    {Object.entries(LEVEL_QUESTION).map(([id, label]) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Điểm ở giữa */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setPoint(Math.max(1, point - 1))}
                    className="w-8 h-8 bg-[#DC2626] rounded text-white font-bold hover:bg-[#B91C1C] transition-colors"
                >
                    -
                </button>
                <span className="text-[#F5F5F5] font-bold text-xl min-w-[2rem] text-center">{point}</span>
                <button
                    onClick={() => setPoint(point + 1)}
                    className="w-8 h-8 bg-[#DC2626] rounded text-white font-bold hover:bg-[#B91C1C] transition-colors"
                >
                    +
                </button>
            </div>

            {/* Loại câu hỏi */}
            <div className="flex items-center gap-2">
                <select
                    value={questionType}
                    onChange={(e) => {setQuestionType(e.target.value);}}
                    className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium focus:outline-none"
                >
                    {Object.entries(QUESTION_TYPE).map(([id, name]) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
