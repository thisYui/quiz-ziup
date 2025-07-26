import { useState } from "react";
import { Button } from "../../ui/button.jsx";

export default function FooterQuestion({neverStarted, hideQuestion, onHideQuestion}) {
    const [timeLimit, setTimeLimit] = useState(30)
  return (
      <div className="flex flex-col items-center gap-4 mx-auto">
      {/* Time Slider */}
          <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <input
                                type="range"
                                min="10"
                                max="300"
                                step="5"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                                className="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-[#888888] text-sm mt-2">
                                <span>10s</span>
                                <span className="text-[#F5F5F5] font-bold">{timeLimit}s</span>
                                <span>300s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
                { neverStarted && (
                    <Button className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-lg text-white font-medium hover:shadow-lg transition-all">
                    Xóa
                    </Button>
                )}
                {hideQuestion && (
                    <Button
                        className="px-8 py-3 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all"
                        //onClick={() => {hideQuestion = false}}
                    >
                        Hiện
                    </Button>
                )}
                  {!hideQuestion && (
                      <Button
                          className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all"
                          //onClick={() => {hideQuestion = true}}
                      >
                          Ẩn
                      </Button>
                  )}
            </div>
      </div>
  )
}