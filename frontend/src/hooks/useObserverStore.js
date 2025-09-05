import { create } from 'zustand';

export const useObserverStore = create((set) => ({
    dataMap: {},

    updateQuestionPart: (questionId, updates) =>
        set((state) => ({
            dataMap: {
                ...state.dataMap,
                [questionId]: {
                    ...state.dataMap[questionId],
                    ...updates,
                    lastUpdated: Date.now(),
                },
            },
        })),

    getQuestionData: (questionId) => {
        return useObserverStore.getState().dataMap[questionId] || null;
    },

    clearObserverData: () => set({ dataMap: {} }),
}));