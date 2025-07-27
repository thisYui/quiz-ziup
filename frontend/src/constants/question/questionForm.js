import { QUESTION_TYPE_NUMBER } from "../enum/questionType.js";
import { LEVEL_QUESTION } from "../enum/levelQuestion.js";

export const QUESTION_FORM = {
    id: null,
    question_type: QUESTION_TYPE_NUMBER.SINGLE_CHOICE,
    content: '',
    score: 1,
    level: LEVEL_QUESTION["0"],
    position: Number(sessionStorage.getItem('position')) || 0,
    time: 30
}