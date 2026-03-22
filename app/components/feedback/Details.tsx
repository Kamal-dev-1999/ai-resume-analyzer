import { cn } from "../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

const getScoreStyle = (score: number) => {
  if (score > 69) return { cls: "good", label: "Strong", color: "#10b981" };
  if (score > 39) return { cls: "mid", label: "Fair", color: "#f59e0b" };
  return { cls: "low", label: "Needs Work", color: "#ef4444" };
};

const ScorePill = ({ score }: { score: number }) => {
  const { cls, color } = getScoreStyle(score);
  return (
    <div className={`score-pill ${cls}`}>
      <span style={{ color }} className="text-xs">●</span>
      {score}/100
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  const { label, cls } = getScoreStyle(categoryScore);
  return (
    <div className="flex flex-row gap-3 items-center">
      <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </p>
      <span className={`status-badge ${cls}`}>{label}</span>
      <ScorePill score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Tip chips summary grid */}
      <div className="tip-chips">
        {tips.map((tip, index) => (
          <div key={index} className={`tip-chip ${tip.type}`}>
            <span className="text-base leading-none">{tip.type === "good" ? "✓" : "→"}</span>
            <span className="text-sm font-medium leading-snug">{tip.tip}</span>
          </div>
        ))}
      </div>

      {/* Detailed explanations */}
      <div className="flex flex-col gap-3">
        {tips.map((tip, index) => (
          <div key={index + tip.tip} className={`tip-explanation ${tip.type}`}>
            <div className="tip-explanation-title">
              <span className="text-base">{tip.type === "good" ? "✅" : "⚠️"}</span>
              {tip.tip}
            </div>
            <p className="text-sm leading-relaxed opacity-90">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback | null }) => {
  if (!feedback) {
    return null;
  }
  return (
    <div className="flex flex-col gap-3 w-full">
      <Accordion allowMultiple>
        <AccordionItem id="tone-style" className="accordion-item">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content" className="accordion-item">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure" className="accordion-item">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills" className="accordion-item">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score ?? 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;