export default function FinalPage() {
    return (
        <div className="min-h-screen p-6 text-white" style={{ backgroundColor: '#0D0D0D' }}>
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Quiz Finished</h1>
                <p className="text-gray-300">Thanks for playing. Here are the final standings.</p>

                <div className="rounded-lg bg-gray-800/60 border border-gray-700 divide-y divide-gray-700">
                    {[1,2,3,4,5].map((rank) => (
                        <div key={rank} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold w-8 text-center">{rank}</span>
                                <span className="font-medium">Player {rank}</span>
                            </div>
                            <span className="text-sm text-gray-300">{(6-rank)*1000} pts</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <a href="/quiz/123/result" className="btn">View Result</a>
                    <a href="/" className="btn">Back Home</a>
                </div>
            </div>
        </div>
    );
}