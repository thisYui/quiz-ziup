import React from "react";
import ChoiceQuestion from "./ChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import FillInQuestion from "./FillInQuestion.jsx";
import { QUESTION_TYPE_NUMBER } from "../../../constants/index.js";
import { useQuizStore } from "../../../hooks/useQuiz.js";
import { FooterQuestion, HeaderQuestion } from "./index.js";

export default function SectionRenderer({ type, data, onTypeChange }) {
    const neverStarted = useQuizStore(state => state.neverStarted);

    const commonProps = {
        questionType: type,
        options: data.options || [],
        results: data.results || [],
    };

    // chọn component render dựa theo type
    let QuestionComponent = null;

    switch (type) {
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

    // layout bọc ngoài
    return (
        <div className="flex justify-center p-6">
            <div className="max-w-4xl mx-auto">
                {/* Top Controls */}
                <HeaderQuestion
                    questionType={type}
                    onTypeChange={onTypeChange}
                />

                {/* Render câu hỏi */}
                {QuestionComponent}

                {/* Footer */}
                <FooterQuestion
                    hideQuestion={data.hideQuestion}
                    neverStarted={neverStarted}
                />
            </div>
        </div>
    );
}
