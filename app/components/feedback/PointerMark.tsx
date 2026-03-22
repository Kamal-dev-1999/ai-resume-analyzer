import { cn } from "~/lib/utils";

type PointerTone = "good" | "improve" | "neutral";

const toneClass: Record<PointerTone, string> = {
  good: "text-green-600",
  improve: "text-yellow-500",
  neutral: "text-black",
};

const PointerMark = ({
  tone = "neutral",
  className,
}: {
  tone?: PointerTone;
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-4 shrink-0", toneClass[tone], className)}
      aria-hidden="true"
    >
      <path
        d="M3 22L21 12L3 2L7.5 12L3 22Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PointerMark;
