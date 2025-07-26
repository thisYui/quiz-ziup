import React, { useState, useEffect } from "react";
import { SidebarQuiz } from "../../components/quiz/content";
import { Navbar } from "../../components/home/Navbar.jsx";
import { EmptyQuestion, SectionRenderer } from "../../components/quiz/content";
import { useQuizStore } from "../../hooks/useQuiz.js";

export default function MainQuizPage() {
    const [hasQuestions, setHasQuestions] = useState(false);
    const [sections, setSections] = useState([]);
    const quizData = useQuizStore(state => state.quizData);
    const questionData = useQuizStore(state => state.questionData);

    useEffect(() => {
        if (!questionData || questionData.length === 0) return;

        questionData.forEach(question => {
            handleAddQuestion(question);
        });
    }, []);

    function handleAddQuestion(data) {
        setHasQuestions(true);
        setSections(prev => {
            const newId = prev.length;
            return [
                ...prev,
                {
                    id: newId,
                    type: data.type,
                    data: data,
                },
            ];
        });
    }

    function handleTypeChange(index, newType) {
        setSections(prev =>
            prev.map((s, i) =>
                i === index ? { ...s, type: newType } : s
            )
        );
    }

    function handleStartQuiz() {
        // thực hiện bắt đầu quiz (chưa viết logic)
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white">
            <Navbar />

            <div className="pt-20">
                <SidebarQuiz
                    quizData={quizData}
                    addQuestion={handleAddQuestion}
                    onCanStart={handleStartQuiz}
                />

                <div className="flex-1 relative px-4 pl-80">
                    <div className="max-w-4xl mx-auto py-10 space-y-12">
                        {!hasQuestions && (
                            <EmptyQuestion addQuestion={handleAddQuestion} />
                        )}

                        {sections.map((section, index) => (
                            <div key={section.id} className="mb-12 items-center justify-center">
                                <SectionRenderer
                                    type={section.type}
                                    data={section.data}
                                    onTypeChange={(newType) => handleTypeChange(index, newType)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
