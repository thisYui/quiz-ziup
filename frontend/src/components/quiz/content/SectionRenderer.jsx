import React, { useState } from "react";
import ChoiceQuestion from "./ChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import FillInQuestion from "./FillInQuestion.jsx";
import { QUESTION_TYPE_NUMBER } from "../../../constants/index.js";
import { useQuizStore } from "../../../hooks/useQuiz.js";
import { FooterQuestion, HeaderQuestion } from "./index.js";

export default function SectionRenderer({ type, data }) {
    const neverStarted = useQuizStore(state => state.neverStarted);
    const [questionType, setQuestionType] = useState(type);

    const commonProps = {
        questionType,
        options: data.options || [],
        results: data.results || [],
    };

    let QuestionComponent = null;

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

    return (
        <div className="flex justify-center p-6">
            <div className="max-w-4xl mx-auto">
                <HeaderQuestion
                    questionType={questionType}
                    onTypeChange={setQuestionType}
                />
                {QuestionComponent}
                <FooterQuestion
                    hideQuestion={data.hideQuestion}
                    neverStarted={neverStarted}
                />
            </div>
        </div>
    );
}
