import { QUESTION_FORM } from "../../../constants/index.js";

export default function EmptyQuestion({addQuestion}) {
    function onAddQuestion() {
        addQuestion(QUESTION_FORM);
    }

    return (
        <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Empty State */}
                <div className="text-center py-20">
                    <div className="w-32 h-32 mx-auto mb-6 bg-[#2A2A2A] rounded-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-[#F5F5F5] text-xl font-medium mb-2">No questions yet</h3>
                    <p className="text-[#888888] mb-6">Start creating your quiz by adding your first question</p>
                    <button
                        onClick={onAddQuestion}
                        className="px-8 py-3 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all"
                    >
                        Add First Question
                    </button>
                </div>
            </div>
        </div>
    )
}
