import { QUESTION_TYPE_NUMBER } from '../constants/enum/questionType.js';

/**
 * Mapping từ số (backend) sang string (frontend)
 */
export const QUESTION_TYPE_MAPPING = {
    [QUESTION_TYPE_NUMBER.SINGLE_CHOICE]: 'choice',
    [QUESTION_TYPE_NUMBER.MULTIPLE_CHOICE]: 'choice',
    [QUESTION_TYPE_NUMBER.MATCHING]: 'matching',
    [QUESTION_TYPE_NUMBER.FILL_IN_BLANK]: 'fill'
};

/**
 * Mapping ngược từ string (frontend) sang số (backend)
 */
export const QUESTION_TYPE_REVERSE_MAPPING = {
    'choice': QUESTION_TYPE_NUMBER.SINGLE_CHOICE, // Default to single choice
    'matching': QUESTION_TYPE_NUMBER.MATCHING,
    'fill': QUESTION_TYPE_NUMBER.FILL_IN_BLANK
};

/**
 * Convert question type từ số (backend) sang string (frontend)
 * @param {number} typeNumber - Số type từ backend
 * @returns {string} String type cho frontend
 */
export function convertTypeNumberToString(typeNumber) {
    return QUESTION_TYPE_MAPPING[typeNumber] || 'choice';
}

/**
 * Convert question type từ string (frontend) sang số (backend)
 * @param {string} typeString - String type từ frontend
 * @returns {number} Số type cho backend
 */
export function convertTypeStringToNumber(typeString) {
    return QUESTION_TYPE_REVERSE_MAPPING[typeString] || QUESTION_TYPE_NUMBER.SINGLE_CHOICE;
}

/**
 * Kiểm tra xem question type có phải multiple choice không
 * @param {number} typeNumber - Số type từ backend
 * @returns {boolean} True nếu là multiple choice
 */
export function isMultipleChoice(typeNumber) {
    return typeNumber === QUESTION_TYPE_NUMBER.MULTIPLE_CHOICE;
}
