import React from "react";
import ChoiceQuestion from "./ChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import FillInQuestion from "./FillInQuestion.jsx";

export default function SectionRenderer({ type, hideQuestion, onTypeChange }) {
    const commonProps = {
        hideQuestion,
        onTypeChange
    };

    switch (type) {
        case 0: // single_choice
        case 1: // multiple_choice
            return <ChoiceQuestion {...commonProps} questionType={type} />;

        case 2: // matching
            return <MatchingQuestion {...commonProps} />;

        case 3: // fill_in_blank
            return <FillInQuestion {...commonProps} />;

        default:
            return <div className="text-red-500">Loại câu hỏi không hợp lệ</div>;
    }
}
