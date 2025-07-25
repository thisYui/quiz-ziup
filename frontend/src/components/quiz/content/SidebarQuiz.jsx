import { TOPIC } from "../../../constants/index.js";
import { Button } from "../../ui/button.jsx";
import { useNavigate } from "react-router-dom";

export default function SidebarQuiz({quizData, onAddQuestion}) {
    const navigate = useNavigate();

    function handleFixQuizContent() {
        // Navigate to the quiz content fixing page
        const slug = sessionStorage.getItem("quiz_slug");
        navigate(`/quiz/${slug}/edit`, { state: { quizData } });
    }

    return (
        <div className="w-80 p-6 border-r border-[#444444]">
            <div className="space-y-6">
                <div className="flex gap-3">
                    <Button
                        className="px-6 py-2 bg-gradient-to-r from-[#2A2A2A] to-[#2A2A2A] rounded-full text-white font-medium hover:shadow-lg transition-all"
                    >
                        Bắt đầu
                    </Button>
                    <Button
                        onClick={onAddQuestion}
                        className="px-6 py-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full text-white font-medium hover:shadow-lg transition-all"
                    >
                        Thêm câu hỏi
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[#CCCCCC] text-sm mb-2">Quiz Name</label>
                        <h2 className="text-[#F5F5F5] text-lg font-semibold">
                            {quizData.name}
                        </h2>
                    </div>

                    <div>
                        <label className="block text-[#CCCCCC] text-sm mb-2">Code</label>
                        <h2 className="text-[#F5F5F5] text-lg font-semibold">
                            {quizData.code}
                        </h2>
                    </div>

                    <div>
                        <label className="block text-[#CCCCCC] text-sm mb-2">Description</label>
                        <p className="text-[#888888]">
                            {quizData.description}
                        </p>
                    </div>

                    <div>
                        {quizData.isPublic && (
                            <label className="block text-[#CCCCCC] text-sm mb-2">Public</label>
                        )}
                        {!quizData.isPublic && (
                            <label className="block text-[#CCCCCC] text-sm mb-2">Private</label>
                        )}
                    </div>

                    <div>
                        <label className="block text-[#CCCCCC] text-sm mb-2">Topic</label>
                        <h2 className="text-[#F5F5F5] text-lg font-semibold">
                            {TOPIC[quizData.topic]}
                        </h2>
                    </div>

                    <Button
                        className="px-6 py-2 bg-gradient-to-r from-[#DB2777] to-[#DC2626] rounded-full text-white font-medium hover:shadow-lg transition-all"
                        onClick={handleFixQuizContent}
                    >
                        Sửa
                    </Button>
                </div>
            </div>
        </div>
    )
}