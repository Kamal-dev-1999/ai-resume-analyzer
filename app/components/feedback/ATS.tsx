import { cn } from "~/lib/utils";
import PointerMark from "./PointerMark";

const getAtsStyle = (score: number) => {
  if (score > 69) return {
    cardBorder: "#bbf7d0",
    cardBg: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    badgeBg: "#dcfce7",
    badgeText: "#15803d",
    badgeBorder: "#86efac",
    titleColor: "#14532d",
  };
  if (score > 49) return {
    cardBorder: "#fde68a",
    cardBg: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
    badgeBg: "#fef9c3",
    badgeText: "#a16207",
    badgeBorder: "#fde047",
    titleColor: "#78350f",
  };
  return {
    cardBorder: "#fecaca",
    cardBg: "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)",
    badgeBg: "#fee2e2",
    badgeText: "#b91c1c",
    badgeBorder: "#fca5a5",
    titleColor: "#7f1d1d",
  };
};

const ATS = ({
  score,
  suggestions,
}: {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}) => {
  const style = getAtsStyle(score);

  return (
    <div
      className="ats-card"
      style={{
        border: `1px solid ${style.cardBorder}`,
        background: style.cardBg,
      }}
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-3 mb-4">
        <div
          className="ats-badge"
          style={{
            background: style.badgeBg,
            color: style.badgeText,
            border: `1px solid ${style.badgeBorder}`,
          }}
        >
          ATS
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: style.titleColor }}>
            ATS Score — {score}/100
          </p>
          <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Applicant Tracking System compatibility
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        How well does your resume pass through Applicant Tracking Systems? Here's how it performed:
      </p>

      {/* Suggestions */}
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex flex-row gap-2.5 items-start"
          >
            <PointerMark tone={suggestion.type} className="mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div
        className="mt-4 pt-4 border-t text-sm"
        style={{ borderColor: style.cardBorder, color: "var(--color-text-muted)" }}
      >
        💡 Want a better score? Apply the suggestions below to improve your ATS compatibility.
      </div>
    </div>
  );
};

export default ATS;