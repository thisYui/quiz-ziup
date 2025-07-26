import { useState, useEffect } from "react"

export default function FillInQuestionPage({ results, onTypeChange, hideQuestion }) {
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [timeLimit, setTimeLimit] = useState(30)
    const [question, setQuestion] = useState("")
    const [results, setResults] = useState([""])

    const questionTypes = [
        { id: "single-choice", name: "Single Choice" },
        { id: "multi-choice", name: "Multi Choice" },
        { id: "matching", name: "Matching" },
        { id: "fill-in", name: "Fill In" },
    ]

    const handleCorrectAnswerChange = (index, value) => {
        const newAnswers = [...results]
        newAnswers[index] = value
        setResults(newAnswers)
    }

    const addCorrectAnswer = () => {
        setResults([...results, ""])
    }

    const removeCorrectAnswer = (index) => {
        if (results.length > 1) {
            setResults(results.filter((_, i) => i !== index))
        }
    }

    return (
        <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Top Controls */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium">level</span>
                                <span className="text-[#CCCCCC]">can change</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedLevel(Math.max(1, selectedLevel - 1))}
                                    className="w-8 h-8 bg-[#DC2626] rounded text-white font-bold hover:bg-[#B91C1C] transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-[#F5F5F5] font-bold text-xl min-w-[2rem] text-center">{selectedLevel}</span>
                                <button
                                    onClick={() => setSelectedLevel(Math.min(5, selectedLevel + 1))}
                                    className="w-8 h-8 bg-[#2563EB] rounded text-white font-bold hover:bg-[#1D4ED8] transition-colors"
                                >
                                    +
                                </button>
                                <span className="text-[#CCCCCC] ml-2">point</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value="fill-in"
                                    onChange={(e) => onTypeChange(e.target.value)}
                                    className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium focus:outline-none"
                                >
                                    {questionTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-[#CCCCCC]">can change</span>
                            </div>
                        </div>

                        {/* Question Input */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-r from-[#9333EA] to-[#DB2777] p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">level</span>
                                    <span className="text-white font-medium">fill in</span>
                                </div>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="input...."
                                    className="w-full bg-transparent text-white placeholder-white/70 resize-none outline-none text-lg"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Correct Answers */}
                        <div className="space-y-4 mb-6">
                            {results.map((answer, index) => (
                                <div key={index} className="relative">
                                    <input
                                        type="text"
                                        value={answer}
                                        onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                        placeholder="input correct answer"
                                        className="w-full p-4 bg-[#2563EB] rounded-lg text-white placeholder-white/70 outline-none text-lg"
                                    />
                                    {results.length > 1 && (
                                        <button
                                            onClick={() => removeCorrectAnswer(index)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 transition-colors flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add More Correct Answer Button */}
                            <button
                                onClick={addCorrectAnswer}
                                className="w-full p-4 bg-[#84CC16] rounded-lg text-black font-medium hover:bg-[#65A30D] transition-colors"
                            >
                                add more correct answer
                            </button>
                        </div>

                        {/* Time Slider */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        {/* Custom Time Slider */}
                                        <div className="relative bg-[#2A2A2A] h-12 rounded-lg border-2 border-[#9333EA] overflow-hidden">
                                            {/* Ruler marks */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {Array.from({ length: 30 }, (_, i) => (
                                                    <div key={i} className="w-px bg-black h-8" style={{ marginRight: i < 29 ? "8px" : "0" }} />
                                                ))}
                                            </div>

                                            {/* Slider input */}
                                            <input
                                                type="range"
                                                min="10"
                                                max="300"
                                                step="5"
                                                value={timeLimit}
                                                onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            {/* Slider thumb indicator */}
                                            <div
                                                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded pointer-events-none"
                                                style={{
                                                    left: `${((timeLimit - 10) / (300 - 10)) * 100}%`,
                                                    transform: "translateX(-50%) translateY(-50%)",
                                                }}
                                            />
                                        </div>

                                        <div className="text-center mt-2">
                                            <span className="text-[#F5F5F5] font-bold text-lg">{timeLimit}s</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <button className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-lg text-white font-medium hover:shadow-lg transition-all">
                                Xóa
                            </button>
                            <button className="px-8 py-3 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all">
                                Ẩn
                            </button>
                        </div>
                    </div>
                </div>
    )
}
