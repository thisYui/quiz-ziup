import { useState, useEffect } from "react";
import { QUESTION_TYPE, LEVEL_QUESTION } from "../../../constants/index.js";
import { useObserverStore } from "../../../hooks/useObserverStore.js";

export default function HeaderQuestion({ questionData, onTypeChange, activeSectionId }) {
    const [selectedLevel, setSelectedLevel] = useState(questionData.level);
    const [point, setPoint] = useState(questionData.score);
    const updateObserver = useObserverStore((state) => state.updateQuestionPart);

    // Update observer when values change and section is active
    useEffect(() => {
        if (activeSectionId !== questionData.id) return;

        updateObserver(questionData.id, {
            level: selectedLevel,
            score: point
        });
    }, [selectedLevel, point, activeSectionId, questionData.id, updateObserver]);

    async function handleTypeChange(newType) {
        newType = Number(newType);

        if (newType === questionData.question_type) {
            return;
        }

        await onTypeChange(newType);
    }

    const handleLevelChange = (e) => {
        const newLevel = Number(e.target.value);
        setSelectedLevel(newLevel);
    };

    const handlePointDecrease = () => {
        const newPoint = Math.max(1, point - 1);
        setPoint(newPoint);
    };

    const handlePointIncrease = () => {
        const newPoint = point + 1;
        setPoint(newPoint);
    };

    // Sync with props when they change
    useEffect(() => {
        setSelectedLevel(questionData.level);
        setPoint(questionData.score);
    }, [questionData.level, questionData.score]);

    return (
        <div className="flex justify-between items-center mb-6 mx-auto gap-4">
            {/* Difficulty selection */}
            <div className="flex items-center gap-2">
                <select
                    value={selectedLevel}
                    onChange={handleLevelChange}
                    className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                >
                    {Object.entries(LEVEL_QUESTION).map(([id, label]) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Points in the middle */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePointDecrease}
                    disabled={point <= 1}
                    className="w-8 h-8 bg-[#DC2626] rounded text-white font-bold hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    -
                </button>
                <span className="text-[#F5F5F5] font-bold text-xl min-w-[2rem] text-center">{point}</span>
                <button
                    onClick={handlePointIncrease}
                    className="w-8 h-8 bg-[#DC2626] rounded text-white font-bold hover:bg-[#B91C1C] transition-colors"
                >
                    +
                </button>
            </div>

            {/* Question type */}
            <div className="flex items-center gap-2">
                <select
                    value={questionData.question_type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
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