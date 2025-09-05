/**
 * So sánh dữ liệu cũ và mới để kiểm tra xem có thay đổi thực sự hay không
 * @param {Object} oldData - Dữ liệu cũ đã được lưu
 * @param {Object} newData - Dữ liệu mới từ DOM
 * @returns {boolean} True nếu có thay đổi, false nếu không
 */
export function hasDataChanged(oldData, newData) {
    if (!oldData && !newData) return false;
    if (!oldData || !newData) return true;

    // So sánh các thuộc tính cơ bản
    if (oldData.title !== newData.title ||
        oldData.description !== newData.description ||
        oldData.question_type !== newData.question_type) {
        return true;
    }

    // So sánh theo từng loại câu hỏi
    switch (newData.question_type) {
        case 'choice':
            return hasChoiceDataChanged(oldData, newData);
        case 'fill':
            return hasFillDataChanged(oldData, newData);
        case 'matching':
            return hasMatchingDataChanged(oldData, newData);
        default:
            return false;
    }
}

function hasChoiceDataChanged(oldData, newData) {
    // So sánh is_multiple
    if (oldData.is_multiple !== newData.is_multiple) {
        return true;
    }

    // So sánh choice_options
    const oldOptions = oldData.choice_options || [];
    const newOptions = newData.choice_options || [];

    if (oldOptions.length !== newOptions.length) {
        return true;
    }

    // Tạo map để so sánh theo ID
    const oldOptionsMap = new Map(oldOptions.map(opt => [opt.id, opt]));

    for (const newOption of newOptions) {
        const oldOption = oldOptionsMap.get(newOption.id);
        if (!oldOption) {
            return true; // Option mới được thêm
        }

        if (oldOption.text !== newOption.text ||
            oldOption.is_correct !== newOption.is_correct) {
            return true;
        }
    }

    return false;
}

function hasFillDataChanged(oldData, newData) {
    const oldAnswers = oldData.fill_answers || [];
    const newAnswers = newData.fill_answers || [];

    if (oldAnswers.length !== newAnswers.length) {
        return true;
    }

    const oldAnswersMap = new Map(oldAnswers.map(ans => [ans.id, ans]));

    for (const newAnswer of newAnswers) {
        const oldAnswer = oldAnswersMap.get(newAnswer.id);
        if (!oldAnswer) {
            return true;
        }

        if (oldAnswer.answer !== newAnswer.answer) {
            return true;
        }
    }

    return false;
}

function hasMatchingDataChanged(oldData, newData) {
    const oldOptions = oldData.matching_options || [];
    const newOptions = newData.matching_options || [];

    if (oldOptions.length !== newOptions.length) {
        return true;
    }

    const oldOptionsMap = new Map(oldOptions.map(opt => [opt.id, opt]));

    for (const newOption of newOptions) {
        const oldOption = oldOptionsMap.get(newOption.id);
        if (!oldOption) {
            return true;
        }

        if (oldOption.left !== newOption.left ||
            oldOption.right !== newOption.right) {
            return true;
        }
    }

    return false;
}

/**
 * Chuẩn hóa dữ liệu để so sánh chính xác
 * @param {Object} data - Dữ liệu cần chuẩn hóa
 * @returns {Object} Dữ liệu đã được chuẩn hóa
 */
export function normalizeData(data) {
    if (!data) return null;

    const normalized = {
        title: (data.title || '').trim(),
        description: (data.description || '').trim(),
        question_type: data.question_type
    };

    switch (data.question_type) {
        case 'choice':
            normalized.is_multiple = Boolean(data.is_multiple);
            normalized.choice_options = (data.choice_options || []).map(opt => ({
                id: opt.id,
                text: (opt.text || '').trim(),
                is_correct: Boolean(opt.is_correct)
            }));
            break;

        case 'fill':
            normalized.fill_answers = (data.fill_answers || []).map(ans => ({
                id: ans.id,
                answer: (ans.answer || '').trim()
            }));
            break;

        case 'matching':
            normalized.matching_options = (data.matching_options || []).map(opt => ({
                id: opt.id,
                left: (opt.left || '').trim(),
                right: (opt.right || '').trim()
            }));
            break;
    }

    return normalized;
}
