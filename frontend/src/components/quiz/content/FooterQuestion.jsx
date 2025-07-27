import { useState } from "react";
import { Button } from "../../ui/button.jsx";
import InfiniteTimeRuler from "./InfiniteTimeRuler.jsx";

export default function FooterQuestion({ neverStarted, hideQuestion }) {
    const [timeLimit, setTimeLimit] = useState(30);

    return (
        <div className="flex flex-col items-center gap-4 mx-auto">
            {/* Timeline Slider */}
            <div className="w-full max-w-2xl mb-6">
                <InfiniteTimeRuler
                    value={timeLimit}
                    onChange={(val) => setTimeLimit(val)}
                    min={1}
                />
                <p className="text-white text-center font-semibold mt-2">{timeLimit}s</p>
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