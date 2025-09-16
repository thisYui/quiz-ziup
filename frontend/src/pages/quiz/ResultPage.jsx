export default function ResultPage() {
    return (
        <div className="min-h-screen p-6 text-white" style={{ backgroundColor: '#0D0D0D' }}>
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Your Results</h1>
                <div className="rounded-lg bg-gray-800/60 border border-gray-700 p-4 space-y-2">
                    <div className="flex justify-between"><span>Correct</span><span>8</span></div>
                    <div className="flex justify-between"><span>Incorrect</span><span>2</span></div>
                    <div className="flex justify-between"><span>Score</span><span>8000</span></div>
                </div>
                <div className="flex gap-3">
                    <a href="/quiz/123/final" className="btn">View Final Standings</a>
                    <a href="/" className="btn">Back Home</a>
                </div>
            </div>
        </div>
    );
}