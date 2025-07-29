import React, { useState, useEffect } from "react";
import { SidebarQuiz } from "../../components/quiz/content";
import { Navbar } from "../../components/home/Navbar.jsx";
import { EmptyQuestion, SectionRenderer } from "../../components/quiz/content";
import { useQuizStore } from "../../hooks/useQuiz.js";
import { quizApi } from "../../services/apiService.js";

export default function MainQuizPage() {
    const [hasQuestions, setHasQuestions] = useState(false);
    const [sections, setSections] = useState([]);
    const quizData = useQuizStore(state => state.quizData);
    const questionData = useQuizStore(state => state.questionData);
    sessionStorage.setItem('position', 0);

    useEffect(() => {
        if (!questionData || questionData.length === 0) return;

        setHasQuestions(true);
        const formatted = questionData.map((q) => ({
            id: q.id,
            type: q.question_type,
            data: q,
        }));
        setSections(formatted);
    }, [questionData]); // nên đưa questionData vào deps

    function addSection(questionId, data) {
        setSections(prev => [
            ...prev,
            {
                id: questionId,
                type: data.question_type,
                data,
            },
        ]);
    }

    async function handleAddQuestion(data) {
        const response = await quizApi.add_question(quizData.id, data);
        const questionId = response.question_id;
        setHasQuestions(true);
        addSection(questionId, data);
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
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
