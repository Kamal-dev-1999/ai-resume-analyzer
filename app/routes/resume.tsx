import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "../lib/puter";
import smallBackground from "../images/bg-small.svg";
import resumeScan from "../images/resume-scan-2.gif";
import { useNavigate } from "react-router";
import Summary from "../components/feedback/Summary";
import ATS from "../components/feedback/ATS";
import Details from "../components/feedback/Details";


export const meta = ()=>(
   [ { title:"ResuMind | Review" },
    { name: "description", content: "Review page for ResuMind" },]
)


const parseFeedback = (value: unknown): Feedback | null => {
    if (!value) return null;

    let parsed: unknown = value;

    // Feedback can be stringified once or twice depending on upstream response shape.
    for (let i = 0; i < 2; i++) {
        if (typeof parsed !== "string") break;
        try {
            parsed = JSON.parse(parsed);
        } catch {
            break;
        }
    }

    if (!parsed || typeof parsed !== "object") return null;

    const candidate = parsed as Partial<Feedback>;
    if (!candidate.ATS || typeof candidate.ATS.score !== "number") return null;

    return candidate as Feedback;
};



const Resume =() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fs, kv,auth, isLoading} = usePuterStore();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);


    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`, { replace: true });
        }
    }, [auth.isAuthenticated, id, isLoading, navigate]);

    useEffect(() => {
        let localImageUrl: string | null = null;
        let localResumeUrl: string | null = null;

        const loadResumeData = async () => {
            if (!id) return;

            const resume = await kv.get(`resume-analysis-${id}`);
            if (!resume) {
                return;
            }

            const data = JSON.parse(resume);
            if (!data?.resumeImagePath || !data?.resumePath) {
                return;
            }

            const [imageBlob, pdfBlob] = await Promise.all([
                fs.read(data.resumeImagePath),
                fs.read(data.resumePath),
            ]);

            if (!imageBlob || !pdfBlob) {
                return;
            }

            localImageUrl = URL.createObjectURL(imageBlob);
            localResumeUrl = URL.createObjectURL(pdfBlob);

            setImageUrl(localImageUrl);
            setResumeUrl(localResumeUrl);
            setFeedback(parseFeedback(data.feedback));
        };

        void loadResumeData();

        return () => {
            if (localImageUrl) URL.revokeObjectURL(localImageUrl);
            if (localResumeUrl) URL.revokeObjectURL(localResumeUrl);
        };
    }, [fs, id, kv]);

    const overallScore = feedback?.overallScore ?? null;
    const scoreColor =
        overallScore === null ? "#94a3b8"
        : overallScore > 69   ? "#10b981"
        : overallScore > 49   ? "#f59e0b"
        :                        "#ef4444";
    const scoreLabel =
        overallScore === null ? "—"
        : overallScore > 69   ? "Strong"
        : overallScore > 49   ? "Good"
        :                        "Needs Work";

    return (
        <main className="!pt-0 flex flex-col min-h-screen" style={{ background: "var(--color-surface-2)" }}>

            {/* ── Navbar ── */}
            <nav className="resume-nav" style={{ position: "relative" }}>

                {/* LEFT — Brand */}
                <Link to="/" className="nav-brand">
                    <div className="nav-brand-dot" aria-hidden="true">
                        {/* Mini "R" icon */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <text x="2" y="13" fontSize="13" fontWeight="700" fill="white" fontFamily="sans-serif">R</text>
                        </svg>
                    </div>
                    <span className="nav-brand-name">ResuMind</span>
                </Link>

                {/* CENTER — Breadcrumb (hidden on small screens) */}
                <div className="nav-breadcrumb">
                    <Link
                        to="/"
                        className="text-sm transition-colors duration-150"
                        style={{ color: "var(--color-text-muted)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
                    >
                        Home
                    </Link>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-30">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Resume Review
                    </span>
                </div>

                {/* RIGHT — Actions */}
                <div className="flex flex-row items-center gap-2 flex-shrink-0">

                    {/* Score chip — shows live score once loaded */}
                    <div
                        className="hidden sm:flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500"
                        style={{
                            background: overallScore === null ? "#f1f5f9" : `${scoreColor}18`,
                            color: scoreColor,
                            border: `1px solid ${scoreColor}30`,
                        }}
                        title="Overall resume score"
                    >
                        <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{
                                background: scoreColor,
                                boxShadow: overallScore !== null ? `0 0 6px ${scoreColor}` : "none",
                            }}
                        />
                        {overallScore !== null ? (
                            <>{overallScore}/100 &middot; {scoreLabel}</>
                        ) : (
                            <>Analyzing…</>
                        )}
                    </div>

                    {/* Download / open PDF button — only when PDF is ready */}
                    {resumeUrl && (
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-row items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                                textDecoration: "none",
                            }}
                            title="Open resume PDF"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-90">
                                <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="hidden sm:inline">Open PDF</span>
                        </a>
                    )}

                    {/* Back button (mobile — shows only icon when breadcrumb is hidden) */}
                    <Link
                        to="/"
                        className="nav-back-button md:hidden"
                        title="Back to home"
                    >
                        <svg className="nav-back-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </nav>

            {/* Two-column layout */}
            <div className="flex flex-row w-full flex-1 max-lg:flex-col-reverse">

                {/* LEFT: Resume preview (sticky) */}
                <section
                    className="w-1/2 max-lg:w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${smallBackground})` }}
                >
                    <div className="resume-preview-panel max-lg:static max-lg:h-auto max-lg:py-8 max-lg:min-h-[300px]">
                        {imageUrl && resumeUrl ? (
                            <div className="animate-in fade-in duration-700 resume-img-wrapper">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Click to open PDF"
                                    className="block group"
                                >
                                    <div
                                        className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.01]"
                                        style={{
                                            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                        }}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt="Your Resume"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p
                                        className="text-center mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        Click to open PDF ↗
                                    </p>
                                </a>
                            </div>
                        ) : (
                            <div className="resume-img-wrapper flex flex-col items-center gap-4">
                                <img src={resumeScan} alt="Scanning resume…" className="scan-loading" />
                                <p className="text-sm font-medium animate-pulse" style={{ color: "var(--color-text-muted)" }}>
                                    Analyzing your resume…
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* RIGHT: Review panel */}
                <section className="w-1/2 max-lg:w-full review-scroll-panel max-lg:h-auto">
                    <div className="px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6 max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col gap-1">
                            <h2 className="review-page-title">Resume Review</h2>
                            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                AI-powered analysis of your resume
                            </p>
                        </div>

                        {/* Feedback content */}
                        {feedback ? (
                            <div className="flex flex-col gap-4 animate-in fade-in duration-500">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS.score} suggestions={feedback.ATS.tips} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 py-12">
                                <img src={resumeScan} alt="Resume Scan" className="scan-loading" />
                                <div className="text-center">
                                    <p className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
                                        Generating your review…
                                    </p>
                                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                                        This usually takes 15–30 seconds
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </main>
    )
}

export default Resume;