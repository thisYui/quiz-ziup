import { useState, useEffect } from "react"
import { Button } from "../../ui/button.jsx";
import { CHOICE_FORM } from "../../../constants/index.js";

export default function ChoiceQuestion({ questionType = "single-choice", options }) {
    const [text, setText] = useState("");
    const [position, setPosition] = useState(0);

    useEffect(() => {

    }, [questionType])


    const handleAnswerCorrectChange = (answerId) => {
        if (questionType === "single-choice") {
            // Single choice: only one can be correct
            setOptions(
                options.map((answer) => ({
                    ...answer,
                    isCorrect: answer.id === answerId,
                })),
            )
        } else if (questionType === "multi-choice") {
            // Multi choice: multiple can be correct
            setOptions(
                options.map((answer) => (answer.id === answerId ? { ...answer, isCorrect: !answer.isCorrect } : answer)),
            )
        }
    }

    const handleAnswerTextChange = (answerId, text) => {
        setOptions(options.map((answer) => (answer.id === answerId ? { ...answer, text } : answer)))
    }

    const addOption = (data) => {
        if (data.position === null) {
            data.position = position
        }

        setPosition(position + 1)
    }

    const removeAnswer = (answerId) => {
        if (options.length > 2) {
            setOptions(options.filter((answer) => answer.id !== answerId))
        }
    }

    return (
        <div>
            {/* Question Input */}
            <div className="mb-6 relative">
                {/* khung nền + vùng nhập */}
                <div
                    contentEditable
                    onInput={(e) => setText(e.currentTarget.textContent)}
                    className="w-full min-h-[3rem] bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white text-lg p-4 rounded-lg outline-none whitespace-pre-wrap"
                ></div>

                {/* placeholder ảo căn giữa */}
                {text.trim() === "" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/70 text-lg p-4">
                        Nhập câu hỏi của bạn ở đây...
                    </div>
                )}
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-6">
                {options.map((answer, index) => (
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
                            <Button
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
                            </Button>

                            {/* Remove Answer Button */}
                            {options.length > 2 && (
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
                    onClick={() => {addOption(CHOICE_FORM)}}
                    className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    )
}
