import React, { useState, useEffect, useRef } from "react";
import { SidebarQuiz } from "../../components/quiz/content";
import { Navbar } from "../../components/home/Navbar.jsx";
import { EmptyQuestion, SectionRenderer } from "../../components/quiz/content";
import { useQuizStore } from "../../hooks/useQuiz.js";
import { quizApi, questionApi } from "../../services/apiService.js";
import { QUESTION_FORM } from "../../constants/index.js";
import { useStableObserver } from "../../hooks/useStableObserver";
import { useQuestionSaver } from "../../hooks/useQuestionSaver";
import { useSectionTransition } from "../../hooks/useSectionTransition";

export default function MainQuizPage() {
    const [hasQuestions, setHasQuestions] = useState(false);
    const [sections, setSections] = useState([]);
    const [position, setPosition] = useState(0);
    const quizData = useQuizStore((state) => state.quizData);
    const questionData = useQuizStore((state) => state.questionData);
    const sectionRefs = useRef({});
    const [activeSectionId, setActiveSectionId] = useState(null);

    // Sử dụng custom hooks để xử lý save và transition
    const { saveSection, cleanupSection, updateSavedData } = useQuestionSaver();

    // Hook xử lý auto-save khi chuyển section
    useSectionTransition(activeSectionId, saveSection);

    // Auto-save mechanism - called every 1s to check if section is stable for 5s
    const { updateSavedData: updateStableObserverData } = useStableObserver(activeSectionId, async (data) => {
        console.log("[AutoSave] Section stable after 5s:", activeSectionId, data);

        if (!activeSectionId || !data) {
            console.log("[AutoSave] Skipping - no active section or data");
            return;
        }

        const saveResult = await saveSection(activeSectionId, data);
        if (saveResult) {
            // Cập nhật dữ liệu đã save cho stable observer
            updateStableObserverData(activeSectionId, data);
        }
    });

    // Intersection Observer to detect which section is currently active
    useEffect(() => {
        const currentRefs = Object.values(sectionRefs.current).filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                let maxRatio = 0;
                let visibleId = null;

                for (const entry of entries) {
                    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio;
                        visibleId = entry.target.dataset.id;
                    }
                }

                if (visibleId && visibleId !== activeSectionId) {
                    setActiveSectionId(visibleId);
                    console.log("[Observer] Active section changed to:", visibleId);
                }
            },
            {
                threshold: [0, 0.2, 0.5, 0.7, 1],
                rootMargin: "-20px 0px -20px 0px" // Better detection
            }
        );

        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
            observer.disconnect();
        };
    }, [sections, activeSectionId]);

    // Initialize sections from question data
    useEffect(() => {
        if (!questionData || questionData.length === 0) {
            setHasQuestions(false);
            setSections([]);
            return;
        }

        setHasQuestions(true);
        const formatted = questionData.map((e) => ({
            id: e.question.id,
            type: e.question.question_type,
            data: e,
        }));
        setSections(formatted);

        // Khởi tạo dữ liệu đã save cho mỗi section
        formatted.forEach(section => {
            if (section.data && section.data.question) {
                updateSavedData(section.id, section.data.question);
                updateStableObserverData(section.id, section.data.question);
            }
        });

        // Set first section as active if none is active
        if (!activeSectionId && formatted.length > 0) {
            setActiveSectionId(formatted[0].id);
        }
    }, [questionData, activeSectionId, updateSavedData, updateStableObserverData]);

    function addSection(questionId, data) {
        const newData = {
            ...data,
            question: {
                ...data.question,
                id: questionId
            }
        };

        setSections((prev) => [
            ...prev,
            {
                id: questionId,
                type: newData.question.question_type,
                data: newData,
            },
        ]);
    }

    async function handleAddQuestion(data) {
        try {
            const questionData = {
                ...data.question,
                position: position
            };

            const response = await quizApi.add_question(quizData.id, questionData);

            if (response.error) {
                console.error("Failed to add question:", response.error);
                return;
            }

            const questionId = response.question_id;
            setHasQuestions(true);
            addSection(questionId, data);
            setPosition((prev) => prev + 1);

            // Set new question as active
            setTimeout(() => {
                setActiveSectionId(questionId);
            }, 100);
        } catch (err) {
            console.error("Error adding question:", err);
        }
    }

    async function handleDeleteQuestion(questionId) {
        try {
            const response = await quizApi.remove_question(quizData.id, questionId);
            if (response.error) {
                console.error("Failed to delete question:", response.error);
                return;
            }

            setSections((prev) => {
                const updated = prev.filter((section) => section.id !== questionId);
                if (updated.length === 0) {
                    setHasQuestions(false);
                    setActiveSectionId(null);
                } else if (activeSectionId === questionId) {
                    // Set next section as active
                    setActiveSectionId(updated[0]?.id || null);
                }
                return updated;
            });

            setPosition((prev) => Math.max(0, prev - 1));

            // Cleanup refs và saved data sử dụng hook
            if (sectionRefs.current[questionId]) {
                delete sectionRefs.current[questionId];
            }
            cleanupSection(questionId);
        } catch (err) {
            console.error("Error deleting question:", err);
        }
    }

    async function changeQuestionType(questionId, newType) {
        try {
            const response = await questionApi.change_type(questionId, newType);
            if (!response || !response.question_id) {
                console.error("Change type failed or returned invalid response:", response);
                return null;
            }

            const form = {
                ...QUESTION_FORM,
                question: {
                    ...QUESTION_FORM.question,
                    id: response.question_id,
                    question_type: newType
                }
            };

            setSections((prev) =>
                prev.map((section) =>
                    section.id === questionId
                        ? {
                            id: response.question_id,
                            type: newType,
                            data: form,
                        }
                        : section
                )
            );

            // Update active section ID if it was the changed question
            if (activeSectionId === questionId) {
                setActiveSectionId(response.question_id);
            }

            // Update refs
            if (sectionRefs.current[questionId]) {
                sectionRefs.current[response.question_id] = sectionRefs.current[questionId];
                delete sectionRefs.current[questionId];
            }

            return response.question_id;
        } catch (err) {
            console.error("Error changing question type:", err);
            return null;
        }
    }

    function handleStartQuiz() {
        // TODO: Implement quiz start logic
        console.log("Starting quiz...");
    }

    function canStartQuiz() {
        return hasQuestions && sections.length > 0;
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white">
            <Navbar />

            <div className="pt-20">
                <SidebarQuiz
                    quizData={quizData}
                    addQuestion={handleAddQuestion}
                    onCanStart={canStartQuiz()}
                />

                <div className="flex-1 relative px-4 pl-80">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {!hasQuestions && (
                            <EmptyQuestion addQuestion={handleAddQuestion} />
                        )}

                        {sections.map((section) => {
                            // Sử dụng dữ liệu gốc cho UI rendering, không cần getEffectiveQuestionData
                            const sectionData = section.data;
                            return (
                                <div
                                    key={section.id}
                                    data-id={section.id}
                                    data-type={section.type}
                                    ref={(el) => {
                                        if (el) {
                                            sectionRefs.current[section.id] = el;
                                        }
                                    }}
                                    className={`mb-12 ${
                                        activeSectionId === section.id
                                            ? "ring-2 ring-blue-500/30 rounded-lg"
                                            : ""
                                    }`}
                                >
                                    <SectionRenderer
                                        type={section.type}
                                        data={sectionData}
                                        deleteQuestion={handleDeleteQuestion}
                                        changeQuestionType={changeQuestionType}
                                        activeSectionId={activeSectionId}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {hasQuestions && (
                        <div className="flex justify-center py-4 mt-8">
                            <button
                                onClick={() => handleAddQuestion(QUESTION_FORM)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
                            >
                                + Thêm câu hỏi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}