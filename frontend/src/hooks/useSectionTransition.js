import { useEffect, useRef } from 'react';
import { getEffectiveQuestionData } from '../utils/observer/getEffectiveQuestionData';

/**
 * Hook xử lý auto-save khi chuyển section
 * @param {string} activeSectionId - ID của section hiện tại
 * @param {function} saveSection - Function để save section
 */
export function useSectionTransition(activeSectionId, saveSection) {
    const previousSectionRef = useRef(null);

    useEffect(() => {
        const previousSection = previousSectionRef.current;

        // Nếu có section trước đó và khác với section hiện tại
        if (previousSection && previousSection !== activeSectionId) {
            console.log("[SectionTransition] Section changed from", previousSection, "to", activeSectionId);

            // Lấy dữ liệu của section trước đó trước khi chuyển
            const previousDataWrapper = getEffectiveQuestionData(previousSection);

            if (previousDataWrapper?.question) {
                console.log("[SectionTransition] Auto-saving previous section:", previousSection);
                // Auto-save section trước đó
                saveSection(previousSection, previousDataWrapper.question).catch(error => {
                    console.error("[SectionTransition] Failed to auto-save section:", previousSection, error);
                });
            }
        }

        // Cập nhật reference cho lần sau
        previousSectionRef.current = activeSectionId;
    }, [activeSectionId, saveSection]);
}
