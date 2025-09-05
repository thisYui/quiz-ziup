import { useEffect, useRef, useCallback } from 'react';
import { getEffectiveQuestionData } from '../utils/observer/getEffectiveQuestionData';
import { hasDataChanged, normalizeData } from '../utils/observer/dataComparer';

/**
 * Hook theo dõi section và gọi callback khi dữ liệu ổn định sau 5 giây
 * @param {string} activeSectionId - ID của section hiện tại
 * @param {function} onStable - Callback được gọi khi dữ liệu ổn định
 */
export function useStableObserver(activeSectionId, onStable) {
    const timeoutRef = useRef(null);
    const lastDataRef = useRef(null);
    const savedDataRef = useRef(new Map()); // Lưu dữ liệu đã save của từng section
    const intervalRef = useRef(null);

    const checkDataStability = useCallback(() => {
        if (!activeSectionId) return;

        // Lấy dữ liệu hiện tại từ DOM (không cần fallback data ở đây)
        const currentDataWrapper = getEffectiveQuestionData(activeSectionId);
        if (!currentDataWrapper?.question) return;

        const currentData = currentDataWrapper.question;

        // Chuẩn hóa dữ liệu để so sánh chính xác
        const normalizedCurrentData = normalizeData(currentData);
        const normalizedLastData = normalizeData(lastDataRef.current);

        // So sánh với dữ liệu lần trước
        const hasCurrentChanged = hasDataChanged(normalizedLastData, normalizedCurrentData);

        if (hasCurrentChanged) {
            // Dữ liệu có thay đổi, reset timer
            console.log("[StableObserver] Data changed, resetting timer for section:", activeSectionId);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Lưu dữ liệu mới
            lastDataRef.current = normalizedCurrentData;

            // Đặt timer mới 5 giây
            timeoutRef.current = setTimeout(() => {
                console.log("[StableObserver] Data stable for 5s, checking if save is needed");

                // Kiểm tra xem có cần save không bằng cách so sánh với dữ liệu đã save
                const savedData = savedDataRef.current.get(activeSectionId);
                const needSave = hasDataChanged(normalizeData(savedData), normalizedCurrentData);

                if (needSave) {
                    console.log("[StableObserver] Data changed from saved version, triggering save");
                    onStable(normalizedCurrentData);
                    // Cập nhật dữ liệu đã save
                    savedDataRef.current.set(activeSectionId, normalizedCurrentData);
                } else {
                    console.log("[StableObserver] No changes from saved version, skipping save");
                }
            }, 5000);
        }
    }, [activeSectionId, onStable]);

    // Bắt đầu theo dõi khi section thay đổi
    useEffect(() => {
        if (!activeSectionId) {
            // Clear timers khi không có active section
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            lastDataRef.current = null;
            return;
        }

        console.log("[StableObserver] Starting observation for section:", activeSectionId);

        // Lấy dữ liệu ban đầu
        const initialDataWrapper = getEffectiveQuestionData(activeSectionId);
        if (initialDataWrapper?.question) {
            lastDataRef.current = normalizeData(initialDataWrapper.question);
        }

        // Kiểm tra mỗi giây để phát hiện thay đổi
        intervalRef.current = setInterval(checkDataStability, 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [activeSectionId, checkDataStability]);

    // Method để cập nhật dữ liệu đã save từ bên ngoài
    const updateSavedData = useCallback((sectionId, data) => {
        if (sectionId && data) {
            savedDataRef.current.set(sectionId, normalizeData(data));
            console.log("[StableObserver] Updated saved data for section:", sectionId);
        }
    }, []);

    // Method để xóa dữ liệu đã save khi section bị xóa
    const clearSavedData = useCallback((sectionId) => {
        if (sectionId) {
            savedDataRef.current.delete(sectionId);
            console.log("[StableObserver] Cleared saved data for section:", sectionId);
        }
    }, []);

    return { updateSavedData, clearSavedData };
}
