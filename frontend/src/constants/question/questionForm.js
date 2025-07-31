import { QUESTION_TYPE_NUMBER } from "../enum/questionType.js";
import { LEVEL_QUESTION_NUMBER } from "../enum/levelQuestion.js";

export const QUESTION_FORM = {
    question: {
        quiz_id: sessionStorage.getItem('quiz_id') || '',
        question_type: QUESTION_TYPE_NUMBER.SINGLE_CHOICE,
        content: '',
        score: 1,
        level: LEVEL_QUESTION_NUMBER.EASY,
        position: Number(sessionStorage.getItem('position')) || 0,
        time: 30,
        hide: false
    },
    options: [],
    results: []
}