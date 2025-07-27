import { useState, useRef, useEffect } from "react";

export default function InfiniteTimeRuler({
                                              value,
                                              onChange,
                                              min = 1,                 // giới hạn dưới 1s
                                              initialPixelsPerSec = 8, // độ zoom ban đầu
                                          }) {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [pps, setPps] = useState(initialPixelsPerSec); // pixels per second
    const [dragging, setDragging] = useState(false);
    const dragRef = useRef({ x: 0, startValue: value });

    // đo width để tính số vạch cần render
    useEffect(() => {
        const update = () => setWidth(containerRef.current?.offsetWidth ?? 0);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    // drag để “đẩy timeline chạy qua kim cố định ở giữa”
    const onMouseDown = (e) => {
        setDragging(true);
        dragRef.current = { x: e.clientX, startValue: value };
    };

    const onMouseMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - dragRef.current.x;
        const secondsDelta = dx / pps; // kéo sang phải => dx > 0 => time giảm (timeline chạy ngược)
        const next = Math.max(min, dragRef.current.startValue - secondsDelta);
        onChange(Math.round(next)); // làm tròn giây cho gọn (có thể bỏ nếu muốn mượt)
    };

    const onMouseUp = () => setDragging(false);

    // zoom bằng wheel (phóng to ở giữa, thu nhỏ 2 bên)
    const onWheel = (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1; // cuộn xuống thu nhỏ, cuộn lên phóng to
        const next = Math.min(120, Math.max(2, pps * factor)); // clamp zoom
        setPps(next);
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const el = containerRef.current;
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [pps]);

    // tạo các vạch hiển thị trong viewport
    const center = width / 2;
    const secondsVisible = Math.ceil(width / pps) + 2;
    const startSec = Math.max(min, Math.floor(value - secondsVisible / 2));
    const endSec = Math.floor(value + secondsVisible / 2);

    const ticks = [];
    for (let s = startSec; s <= endSec; s++) {
        const x = center + (s - value) * pps;

        // độ cao vạch: 10s > 5s > 1s, cộng thêm "phóng to ở giữa"
        let baseHeight = 8;
        if (s % 10 === 0) baseHeight = 28;
        else if (s % 5 === 0) baseHeight = 18;

        // phóng to ở giữa: càng gần center càng cao
        const distance = Math.abs(s - value);
        const maxDist = secondsVisible / 2;
        const amplify = Math.max(0, 1 - distance / maxDist); // 0..1
        const height = baseHeight * (1 + amplify * 0.7);

        ticks.push({ s, x, height, major: s % 5 === 0 });
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-28 select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseUp}
            onMouseUp={onMouseUp}
        >
            {/* nền */}
            <div className="absolute inset-0 bg-[#111]" />

            {/* kim cố định ở giữa */}
            <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#F97316] z-20"
                style={{ left: center }}
            />

            {/* vạch */}
            <svg className="absolute inset-0 w-full h-full z-10">
                {ticks.map((t) => (
                    <g key={t.s}>
                        <line
                            x1={t.x}
                            y1={0}
                            x2={t.x}
                            y2={t.height}
                            stroke={t.major ? "#ffffff" : "#888888"}
                            strokeWidth={t.major ? 2 : 1}
                        />
                        {t.major && (
                            <text
                                x={t.x + 4}
                                y={t.height + 14}
                                fill="#ffffff"
                                fontSize="12"
                            >
                                {t.s}s
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            {/* label ở giữa */}
            <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white text-lg font-semibold"
                style={{ textShadow: "0 0 4px rgba(0,0,0,0.5)" }}
            >
                {value}s
            </div>
        </div>
    );
}
