import { useCallback } from 'react';

/**
 * Hook để lấy dữ liệu trực tiếp từ DOM của một section
 * Sử dụng querySelector để tìm các input/textarea trong section
 */
export const useDOMDataExtractor = () => {

    const extractSectionData = useCallback((sectionId) => {
        if (!sectionId) return null;

        try {
            // Tìm container của section dựa vào data-id
            const sectionElement = document.querySelector(`[data-id="${sectionId}"]`);
            if (!sectionElement) {
                console.warn(`[DOMExtractor] Section element not found for ID: ${sectionId}`);
                return null;
            }

            // Lấy content từ textarea chính (question content)
            const contentTextarea = sectionElement.querySelector('textarea[placeholder*="Nhập câu hỏi"], textarea[placeholder*="question"], .question-content textarea, [data-field="content"] textarea');
            const content = contentTextarea ? contentTextarea.value.trim() : '';

            // Lấy thời gian từ input time
            const timeInput = sectionElement.querySelector('input[type="number"][placeholder*="phút"], input[type="number"][placeholder*="minute"], [data-field="time"] input, input[name*="time"]');
            const time = timeInput ? parseInt(timeInput.value) || 0 : 0;

            // Lấy level từ select hoặc input
            const levelSelect = sectionElement.querySelector('select[name*="level"], [data-field="level"] select, select[name*="difficulty"]');
            const levelInput = sectionElement.querySelector('input[name*="level"], [data-field="level"] input');
            let level = 0;
            if (levelSelect) {
                level = parseInt(levelSelect.value) || 0;
            } else if (levelInput) {
                level = parseInt(levelInput.value) || 0;
            }

            // Lấy score từ input
            const scoreInput = sectionElement.querySelector('input[type="number"][placeholder*="điểm"], input[type="number"][placeholder*="score"], [data-field="score"] input, input[name*="score"]');
            const score = scoreInput ? parseInt(scoreInput.value) || 0 : 0;

            // Lấy type từ data attribute hoặc hidden input
            const typeElement = sectionElement.querySelector('[data-question-type], input[name*="type"]');
            let type = '';
            if (typeElement) {
                type = typeElement.getAttribute('data-question-type') || typeElement.value || '';
            }

            // Lấy options (cho câu hỏi trắc nghiệm)
            const options = [];
            const optionInputs = sectionElement.querySelectorAll('.option-input input, [data-field="option"] input, .choice-option input');
            optionInputs.forEach((input, index) => {
                const value = input.value.trim();
                if (value) {
                    options.push({
                        id: index + 1,
                        content: value
                    });
                }
            });

            // Lấy results (đáp án đúng)
            const results = [];
            const resultCheckboxes = sectionElement.querySelectorAll('input[type="checkbox"][name*="correct"], input[type="checkbox"][data-field="correct"]');
            const resultRadios = sectionElement.querySelectorAll('input[type="radio"][name*="correct"]:checked, input[type="radio"][data-field="correct"]:checked');

            // Xử lý checkbox (multiple choice)
            resultCheckboxes.forEach((checkbox, index) => {
                if (checkbox.checked) {
                    results.push(index + 1);
                }
            });

            // Xử lý radio (single choice)
            resultRadios.forEach((radio) => {
                const value = parseInt(radio.value);
                if (value && !results.includes(value)) {
                    results.push(value);
                }
            });

            // Lấy fill-in-the-blank results
            const fillInputs = sectionElement.querySelectorAll('.fill-answer input, [data-field="fill-answer"] input');
            fillInputs.forEach((input) => {
                const value = input.value.trim();
                if (value) {
                    results.push(value);
                }
            });

            // Lấy matching results
            const matchingSelects = sectionElement.querySelectorAll('.matching-select select, [data-field="matching"] select');
            matchingSelects.forEach((select) => {
                const value = select.value;
                if (value) {
                    results.push(value);
                }
            });

            const extractedData = {
                content,
                time,
                level,
                score,
                type,
                options,
                results,
                extractedAt: Date.now()
            };

            console.log(`[DOMExtractor] Extracted data for section ${sectionId}:`, extractedData);
            return extractedData;

        } catch (error) {
            console.error(`[DOMExtractor] Error extracting data for section ${sectionId}:`, error);
            return null;
        }
    }, []);

    return {
        extractSectionData
    };
};
