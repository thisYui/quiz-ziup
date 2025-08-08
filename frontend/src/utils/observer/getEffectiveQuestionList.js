import { useObserverStore } from '../../hooks/useObserverStore';

export function getEffectiveQuestionList(originalList = []) {
    const { dataMap } = useObserverStore.getState();

    return originalList.map((item) => {
        const observer = dataMap[item.question.id];
        if (!observer) return item;

        return {
            ...item,
            question: {
                ...item.question,
                content: observer.content ?? item.question.content,
                level: observer.level ?? item.question.level,
                score: observer.score ?? item.question.score,
                question_type: observer.type ?? item.question.question_type,
                time: observer.time ?? item.question.time,
            },
            options: observer.options ?? item.options,
            results: observer.results ?? item.results,
        };
    });
}
