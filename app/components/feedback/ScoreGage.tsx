import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  // Animate score counting up
  useEffect(() => {
    if (score === 0) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = score / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [score]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Dynamic gradient colors based on score
  const gradientStart = score > 69 ? "#34d399" : score > 49 ? "#fbbf24" : "#f87171";
  const gradientEnd   = score > 69 ? "#059669" : score > 49 ? "#d97706" : "#dc2626";
  const scoreColor    = score > 69 ? "#059669" : score > 49 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative w-36 h-[72px]">
        <svg viewBox="0 0 100 52" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientStart} />
              <stop offset="100%" stopColor={gradientEnd} />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Progress */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>

        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span
            className="text-2xl font-bold tabular-nums leading-tight"
            style={{ color: scoreColor }}
          >
            {animatedScore}
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            /100
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;