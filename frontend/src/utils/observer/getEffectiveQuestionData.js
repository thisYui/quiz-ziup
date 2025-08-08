import { convertTypeNumberToString, isMultipleChoice } from '../questionTypeMapper.js';

/**
 * Lấy dữ liệu hiện tại từ DOM của một section
 * @param {string} sectionId - ID của section
 * @param {Object} fallbackData - Dữ liệu fallback nếu không lấy được từ DOM
 * @returns {Object|null} Dữ liệu hiện tại của section với format { question: {...} }
 */
export function getEffectiveQuestionData(sectionId, fallbackData = null) {
    if (!sectionId) return fallbackData;

    const sectionElement = document.querySelector(`[data-id="${sectionId}"]`);
    if (!sectionElement) {
        // Nếu không tìm thấy element trong DOM, trả về fallback data
        console.log(`[getEffectiveQuestionData] Element not found for section ${sectionId}, using fallback data`);
        return fallbackData;
    }

    // Lấy question type từ data-type attribute hoặc fallback data
    let questionTypeRaw = sectionElement.dataset.type || fallbackData?.question?.question_type;

    if (questionTypeRaw === undefined || questionTypeRaw === null) {
        console.warn(`[getEffectiveQuestionData] No question type found for section ${sectionId}, using fallback data`);
        return fallbackData;
    }

    // Convert số sang string nếu cần
    let questionType;
    if (typeof questionTypeRaw === 'string' && !isNaN(questionTypeRaw)) {
        // Nếu là string nhưng chứa số, convert thành number rồi map
        questionType = convertTypeNumberToString(parseInt(questionTypeRaw));
    } else if (typeof questionTypeRaw === 'number') {
        // Nếu là number, map trực tiếp
        questionType = convertTypeNumberToString(questionTypeRaw);
    } else {
        // Nếu đã là string type, sử dụng trực tiếp
        questionType = questionTypeRaw;
    }

    try {
        let questionData;
        switch (questionType) {
            case 'choice':
                questionData = getChoiceData(sectionElement, questionTypeRaw);
                break;
            case 'fill':
                questionData = getFillData(sectionElement);
                break;
            case 'matching':
                questionData = getMatchingData(sectionElement);
                break;
            default:
                console.warn(`[getEffectiveQuestionData] Unknown question type: ${questionType} (raw: ${questionTypeRaw}), using fallback data`);
                return fallbackData;
        }

        // Trả về format giống như fallbackData: { question: {...} }
        return {
            question: {
                id: sectionId,
                ...questionData
            }
        };
    } catch (error) {
        console.error(`[getEffectiveQuestionData] Error getting data for section ${sectionId}:`, error);
        return fallbackData;
    }
}

function getChoiceData(element, originalType) {
    const titleInput = element.querySelector('input[name="title"]');
    const descriptionTextarea = element.querySelector('textarea[name="description"]');

    // Xác định is_multiple dựa trên original type từ backend
    let isMultiple = false;
    if (typeof originalType === 'string' && !isNaN(originalType)) {
        isMultiple = isMultipleChoice(parseInt(originalType));
    } else if (typeof originalType === 'number') {
        isMultiple = isMultipleChoice(originalType);
    } else {
        // Fallback: kiểm tra checkbox trong DOM
        isMultiple = element.querySelector('input[type="checkbox"][name="multiple"]')?.checked || false;
    }

    // Lấy tất cả các options
    const optionElements = element.querySelectorAll('[data-option-id]');
    const options = Array.from(optionElements).map(optionEl => {
        const optionId = optionEl.dataset.optionId;
        const textInput = optionEl.querySelector('input[type="text"]');
        const isCorrect = optionEl.querySelector('input[type="checkbox"]')?.checked || false;

        return {
            id: optionId,
            text: textInput?.value || '',
            is_correct: isCorrect
        };
    });

    return {
        title: titleInput?.value || '',
        description: descriptionTextarea?.value || '',
        question_type: originalType, // Giữ nguyên original type từ backend
        is_multiple: isMultiple,
        choice_options: options
    };
}

function getFillData(element) {
    const titleInput = element.querySelector('input[name="title"]');
    const descriptionTextarea = element.querySelector('textarea[name="description"]');

    // Lấy tất cả các fill answers
    const fillElements = element.querySelectorAll('[data-fill-id]');
    const fillAnswers = Array.from(fillElements).map(fillEl => {
        const fillId = fillEl.dataset.fillId;
        const textInput = fillEl.querySelector('input[type="text"]');

        return {
            id: fillId,
            answer: textInput?.value || ''
        };
    });

    return {
        title: titleInput?.value || '',
        description: descriptionTextarea?.value || '',
        question_type: 'fill',
        fill_answers: fillAnswers
    };
}

function getMatchingData(element) {
    const titleInput = element.querySelector('input[name="title"]');
    const descriptionTextarea = element.querySelector('textarea[name="description"]');

    // Lấy tất cả matching options
    const matchingElements = element.querySelectorAll('[data-matching-id]');
    const matchingOptions = Array.from(matchingElements).map(matchEl => {
        const matchId = matchEl.dataset.matchingId;
        const leftInput = matchEl.querySelector('input[name="left"]');
        const rightInput = matchEl.querySelector('input[name="right"]');

        return {
            id: matchId,
            left: leftInput?.value || '',
            right: rightInput?.value || ''
        };
    });

    return {
        title: titleInput?.value || '',
        description: descriptionTextarea?.value || '',
        question_type: 'matching',
        matching_options: matchingOptions
    };
}
