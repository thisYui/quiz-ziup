import { useCallback, useRef } from 'react';
import { questionApi } from '../services/apiService';
import { hasDataChanged, normalizeData } from '../utils/observer/dataComparer';

/**
 * Hook xử lý việc lưu questions với cơ chế so sánh dữ liệu
 */
export function useQuestionSaver() {
    const savedDataRef = useRef(new Map()); // Lưu dữ liệu đã save của từng section
    const savingRef = useRef(new Set()); // Track các section đang được save

    /**
     * Lưu section với kiểm tra thay đổi dữ liệu
     */
    const saveSection = useCallback(async (sectionId, currentData) => {
        if (!sectionId || !currentData) {
            console.log("[QuestionSaver] Invalid parameters:", { sectionId, currentData });
            return false;
        }

        // Kiểm tra xem section có đang được save không
        if (savingRef.current.has(sectionId)) {
            console.log("[QuestionSaver] Section is already being saved:", sectionId);
            return false;
        }

        try {
            // Chuẩn hóa dữ liệu hiện tại
            const normalizedCurrentData = normalizeData(currentData);

            // Lấy dữ liệu đã save trước đó
            const savedData = savedDataRef.current.get(sectionId);
            const normalizedSavedData = normalizeData(savedData);

            // So sánh để kiểm tra có thay đổi thực sự không
            const hasChanges = hasDataChanged(normalizedSavedData, normalizedCurrentData);

            if (!hasChanges) {
                console.log("[QuestionSaver] No changes detected, skipping save for section:", sectionId);
                return false;
            }

            console.log("[QuestionSaver] Changes detected, saving section:", sectionId);
            console.log("[QuestionSaver] Old data:", normalizedSavedData);
            console.log("[QuestionSaver] New data:", normalizedCurrentData);

            // Đánh dấu đang save
            savingRef.current.add(sectionId);

            // Chuẩn bị payload cho API
            const payload = prepareApiPayload(normalizedCurrentData);

            // Gọi API để save
            const response = await questionApi.updateQuestion(sectionId, payload);

            if (response.success) {
                // Lưu dữ liệu đã save thành công
                savedDataRef.current.set(sectionId, normalizedCurrentData);
                console.log("[QuestionSaver] Successfully saved section:", sectionId);
                return true;
            } else {
                console.error("[QuestionSaver] Failed to save section:", sectionId, response.error);
                return false;
            }

        } catch (error) {
            console.error("[QuestionSaver] Error saving section:", sectionId, error);
            return false;
        } finally {
            // Xóa khỏi danh sách đang save
            savingRef.current.delete(sectionId);
        }
    }, []);

    /**
     * Cập nhật dữ liệu đã save từ bên ngoài (ví dụ: sau khi load từ server)
     */
    const updateSavedData = useCallback((sectionId, data) => {
        if (sectionId && data) {
            const normalizedData = normalizeData(data);
            savedDataRef.current.set(sectionId, normalizedData);
            console.log("[QuestionSaver] Updated saved data for section:", sectionId);
        }
    }, []);

    /**
     * Xóa dữ liệu đã save khi section bị xóa
     */
    const cleanupSection = useCallback((sectionId) => {
        if (sectionId) {
            savedDataRef.current.delete(sectionId);
            savingRef.current.delete(sectionId);
            console.log("[QuestionSaver] Cleaned up section:", sectionId);
        }
    }, []);

    /**
     * Kiểm tra xem section có thay đổi so với dữ liệu đã save không
     */
    const hasUnsavedChanges = useCallback((sectionId, currentData) => {
        if (!sectionId || !currentData) return false;

        const normalizedCurrentData = normalizeData(currentData);
        const savedData = savedDataRef.current.get(sectionId);
        const normalizedSavedData = normalizeData(savedData);

        return hasDataChanged(normalizedSavedData, normalizedCurrentData);
    }, []);

    /**
     * Lấy dữ liệu đã save của một section
     */
    const getSavedData = useCallback((sectionId) => {
        return savedDataRef.current.get(sectionId) || null;
    }, []);

    return {
        saveSection,
        updateSavedData,
        cleanupSection,
        hasUnsavedChanges,
        getSavedData
    };
}

/**
 * Chuẩn bị payload cho API dựa trên loại câu hỏi
 */
function prepareApiPayload(data) {
    const basePayload = {
        title: data.title,
        description: data.description,
        question_type: data.question_type
    };

    switch (data.question_type) {
        case 'choice':
            return {
                ...basePayload,
                is_multiple: data.is_multiple,
                choice_options_attributes: data.choice_options.map(option => ({
                    id: option.id,
                    text: option.text,
                    is_correct: option.is_correct
                }))
            };

        case 'fill':
            return {
                ...basePayload,
                fill_answers_attributes: data.fill_answers.map(answer => ({
                    id: answer.id,
                    answer: answer.answer
                }))
            };

        case 'matching':
            return {
                ...basePayload,
                matching_options_attributes: data.matching_options.map(option => ({
                    id: option.id,
                    left: option.left,
                    right: option.right
                }))
            };

        default:
            return basePayload;
    }
}
