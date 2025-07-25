import { useState, useEffect } from "react"

export default function ChoiceQuestion({ questionType = "single-choice", onTypeChange, onBack }) {
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [timeLimit, setTimeLimit] = useState(30)
    const [question, setQuestion] = useState("")
    const [answers, setAnswers] = useState([
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
    ])

    //const quizData = useQuizStore((state) => state.getQuizData());
    const quizData = {}

    useEffect(() => {
        // Reset answers when question type changes
        if (questionType === "single-choice") {
            setAnswers([
                { id: 1, text: "", isCorrect: false },
                { id: 2, text: "", isCorrect: false },
            ])
        } else if (questionType === "multi-choice") {
            setAnswers([
                { id: 1, text: "", isCorrect: false },
                { id: 2, text: "", isCorrect: false },
                { id: 3, text: "", isCorrect: false },
                { id: 4, text: "", isCorrect: false },
            ])
        }
        setQuestion("")
    }, [questionType])

    const questionTypes = [
        { id: "single-choice", name: "Single Choice" },
        { id: "multi-choice", name: "Multi Choice" },
        { id: "matching", name: "Matching" },
        { id: "fill-in", name: "Fill In" },
    ]

    const handleAnswerCorrectChange = (answerId) => {
        if (questionType === "single-choice") {
            // Single choice: only one can be correct
            setAnswers(
                answers.map((answer) => ({
                    ...answer,
                    isCorrect: answer.id === answerId,
                })),
            )
        } else if (questionType === "multi-choice") {
            // Multi choice: multiple can be correct
            setAnswers(
                answers.map((answer) => (answer.id === answerId ? { ...answer, isCorrect: !answer.isCorrect } : answer)),
            )
        }
    }

    const handleAnswerTextChange = (answerId, text) => {
        setAnswers(answers.map((answer) => (answer.id === answerId ? { ...answer, text } : answer)))
    }

    const addAnswer = () => {
        const newId = Math.max(...answers.map((a) => a.id)) + 1
        setAnswers([...answers, { id: newId, text: "", isCorrect: false }])
    }

    const removeAnswer = (answerId) => {
        if (answers.length > 2) {
            setAnswers(answers.filter((answer) => answer.id !== answerId))
        }
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />

            <div className="relative z-10 flex items-center justify-center min-h-screen py-16">
                {/* Left Sidebar */}
                <SidebarQuiz quizData={quizData} onAddQuestion={addQuestion} />

                {/* Main Content */}
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
                                    value={questionType}
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
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="input...."
                    className="w-full bg-transparent text-white placeholder-white/70 resize-none outline-none text-lg"
                    rows={3}
                />
                            </div>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-4 mb-6">
                            {answers.map((answer, index) => (
                                <div key={answer.id} className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={answer.text}
                                            onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                                            placeholder={`Answer ${index + 1}`}
                                            className="w-full p-4 bg-[#FF8C42] rounded-lg text-white placeholder-white/70 outline-none"
                                        />

                                        {/* Correct Answer Indicator */}
                                        <button
                                            onClick={() => handleAnswerCorrectChange(answer.id)}
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded border-2 flex items-center justify-center ${
                                                answer.isCorrect ? "bg-white border-white" : "bg-transparent border-white/50"
                                            }`}
                                        >
                                            {answer.isCorrect && (
                                                <svg className="w-4 h-4 text-[#FF8C42]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Remove Answer Button */}
                                        {answers.length > 2 && (
                                            <button
                                                onClick={() => removeAnswer(answer.id)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 transition-colors flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    {questionType === "single-choice" && (
                                        <button
                                            onClick={() => handleAnswerCorrectChange(answer.id)}
                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                                answer.isCorrect
                                                    ? "bg-[#2563EB] border-[#2563EB] text-white"
                                                    : "border-[#666666] text-[#666666] hover:border-[#2563EB]"
                                            }`}
                                        >
                                            {answer.isCorrect ? "✓" : "×"}
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add Answer Button */}
                            <button
                                onClick={addAnswer}
                                className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                            >
                                +
                            </button>
                        </div>

                        {/* Time Slider */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="10"
                                            max="300"
                                            step="5"
                                            value={timeLimit}
                                            onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                                            className="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-[#888888] text-sm mt-2">
                                            <span>10s</span>
                                            <span className="text-[#F5F5F5] font-bold">{timeLimit}s</span>
                                            <span>300s</span>
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
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #14B8A6);
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #14B8A6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
        }
      `}</style>
        </div>
    )
}
