import ScoreGauge from "./ScoreGage";

const getScoreLabel = (score: number) => {
  if (score > 69) return { label: "Strong", cls: "good" };
  if (score > 49) return { label: "Good Start", cls: "mid" };
  return { label: "Needs Work", cls: "low" };
};

const getScoreColor = (score: number) => {
  if (score > 69) return "#10b981";
  if (score > 49) return "#f59e0b";
  return "#ef4444";
};

const CategoryRow = ({ title, score }: { title: string; score: number }) => {
  const { label, cls } = getScoreLabel(score);
  const scoreColor = getScoreColor(score);

  return (
    <div className="category-row">
      <div className="flex flex-row items-center gap-3">
        <p className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
          {title}
        </p>
        <span className={`status-badge ${cls}`}>{label}</span>
      </div>
      <p className="text-base font-bold tabular-nums" style={{ color: scoreColor }}>
        {score}
        <span className="text-sm font-normal" style={{ color: "var(--color-text-muted)" }}>
          /100
        </span>
      </p>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback | null }) => {
  const overallScore = feedback?.overallScore || 0;
  const toneAndStyleScore = feedback?.toneAndStyle?.score || 0;
  const contentScore = feedback?.content?.score || 0;
  const structureScore = feedback?.structure?.score || 0;
  const skillsScore = feedback?.skills?.score || 0;
  const { label, cls } = getScoreLabel(overallScore);

  return (
    <div className="resume-score-card">
      {/* Score header */}
      <div className="flex flex-row max-sm:flex-col items-center gap-5 pb-5 border-b" style={{ borderColor: "var(--color-border)" }}>
        <ScoreGauge score={overallScore} />
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
              Your Resume Score
            </h2>
            <span className={`status-badge ${cls}`}>{label}</span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Score calculated across tone, content, structure & skills.
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="flex flex-col gap-3 pt-4">
        <CategoryRow title="Tone & Style" score={toneAndStyleScore} />
        <CategoryRow title="Content"      score={contentScore} />
        <CategoryRow title="Structure"    score={structureScore} />
        <CategoryRow title="Skills"       score={skillsScore} />
      </div>
    </div>
  );
};

export default Summary;