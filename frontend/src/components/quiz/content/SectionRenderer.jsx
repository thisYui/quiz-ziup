import React, { useState } from "react";
import ChoiceQuestion from "./ChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import FillInQuestion from "./FillInQuestion.jsx";
import { QUESTION_TYPE_NUMBER } from "../../../constants/index.js";
import { useQuizStore } from "../../../hooks/useQuiz.js";
import { FooterQuestion, HeaderQuestion } from "./index.js";
import { useObserverStore } from "../../../hooks/useObserverStore.js";

export default function SectionRenderer({
                                            type,
                                            data,
                                            changeQuestionType,
                                            deleteQuestion,
                                            activeSectionId
                                        }) {
    const neverStarted = useQuizStore((state) => state.neverStarted);
    const [questionType, setQuestionType] = useState(type);
    const updateObserver = useObserverStore((state) => state.updateQuestionPart);

    const commonProps = {
        questionId: data.question.id,
        questionType,
        content: data.question.content || "",
        options: data.options || [],
        results: data.results || [],
        activeSectionId
    };

    let QuestionComponent;

    switch (questionType) {
        case QUESTION_TYPE_NUMBER.SINGLE_CHOICE:
        case QUESTION_TYPE_NUMBER.MULTIPLE_CHOICE:
            QuestionComponent = <ChoiceQuestion {...commonProps} />;
            break;
        case QUESTION_TYPE_NUMBER.MATCHING:
            QuestionComponent = <MatchingQuestion {...commonProps} />;
            break;
        case QUESTION_TYPE_NUMBER.FILL_IN_BLANK:
            QuestionComponent = <FillInQuestion {...commonProps} />;
            break;
        default:
            QuestionComponent = <div className="text-red-500">Loại câu hỏi không hợp lệ</div>;
    }

    async function updateQuestionType(newType) {
        try {
            const newId = await changeQuestionType(data.question.id, newType);
            if (newId) {
                // Update data immutably instead of direct mutation
                const newData = {
                    ...data,
                    question: {
                        ...data.question,
                        id: newId
                    }
                };

                setQuestionType(newType);
                updateObserver(newId, { type: newType });

                return newId;
            }
        } catch (err) {
            console.error("Error updating question type:", err);
        }
    }

    return (
        <div className="flex justify-center p-6">
            <div className="max-w-4xl mx-auto">
                <HeaderQuestion
                    questionData={data.question}
                    onTypeChange={updateQuestionType}
                    activeSectionId={activeSectionId}
                />
                {QuestionComponent}
                <FooterQuestion
                    questionData={data.question}
                    deleteQuestion={deleteQuestion}
                    neverStarted={neverStarted}
                    activeSectionId={activeSectionId}
                />
            </div>
        </div>
    );
}