import { useState, useEffect } from "react";
import { Button } from "../../ui/button.jsx";
import InfiniteTimeRuler from "./InfiniteTimeRuler.jsx";
import { quizApi } from "../../../services/apiService.js";
import { useObserverStore } from "../../../hooks/useObserverStore.js";

export default function FooterQuestion({
                                           questionData,
                                           neverStarted,
                                           deleteQuestion,
                                           activeSectionId
                                       }) {
    const [timeLimit, setTimeLimit] = useState(questionData.time);
    const [hide, setHide] = useState(questionData.hide || false);
    const updateObserver = useObserverStore((state) => state.updateQuestionPart);

    // Update observer when time changes and section is active
    useEffect(() => {
        if (activeSectionId !== questionData.id) return;

        updateObserver(questionData.id, {
            time: timeLimit
        });
    }, [timeLimit, activeSectionId, questionData.id, updateObserver]);

    // Sync with props when they change
    useEffect(() => {
        setTimeLimit(questionData.time);
        setHide(questionData.hide || false);
    }, [questionData.time, questionData.hide]);

    async function handleDeleteQuestion() {
        if (!neverStarted) return;
        deleteQuestion(questionData.id);
    }

    async function handleUpdateTimeLimit(newTime) {
        setTimeLimit(newTime);
    }

    async function handleHideQuestion() {
        try {
            const quiz_id = sessionStorage.getItem('quiz_id');
            const response = await quizApi.hide_question(quiz_id, questionData.id);
            if (response.error) {
                console.error("Failed to hide question:", response.error);
                return;
            }
            setHide(true);
        } catch (err) {
            console.error("Error hiding question:", err);
        }
    }

    async function handleShowQuestion() {
        try {
            const quiz_id = sessionStorage.getItem('quiz_id');
            const response = await quizApi.show_question(quiz_id, questionData.id);
            if (response.error) {
                console.error("Failed to show question:", response.error);
                return;
            }
            setHide(false);
        } catch (err) {
            console.error("Error showing question:", err);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 mx-auto">
            {/* Timeline Slider */}
            <div className="w-full max-w-2xl mb-6">
                <InfiniteTimeRuler
                    value={timeLimit}
                    onChange={handleUpdateTimeLimit}
                    min={1}
                />
                <p className="text-white text-center font-semibold mt-2">{timeLimit}s</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
                {neverStarted && (
                    <Button
                        className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-lg text-white font-medium hover:shadow-lg transition-all"
                        onClick={handleDeleteQuestion}
                    >
                        Xóa
                    </Button>
                )}
                {hide ? (
                    <Button
                        className="px-8 py-3 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all"
                        onClick={handleShowQuestion}
                    >
                        Hiện
                    </Button>
                ) : (
                    <Button
                        className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all"
                        onClick={handleHideQuestion}
                    >
                        Ẩn
                    </Button>
                )}
            </div>
        </div>
    )
}