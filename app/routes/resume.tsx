import { Link, useParams } from "react-router";
import backIon from "../assets/icons/back.png";
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

    return (
        <main className="!pt-0 flex flex-col min-h-screen" style={{ background: "var(--color-surface-2)" }}>
            {/* Sticky Navbar */}
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src={backIon} alt="back" className="w-4 h-4 opacity-60" />
                    <span>Back to Homepage</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span
                        className="text-sm font-semibold tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        ResuMind
                    </span>
                    <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--color-accent-blue-light)", color: "var(--color-accent-blue)" }}
                    >
                        Review
                    </span>
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
                    <div className="px-6 lg:px-10 py-8 flex flex-col gap-6 max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col gap-1">
                            <h2 className="review-page-title">Resume Review</h2>
                            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                AI-powered analysis of your resume
                            </p>
                        </div>

                        {/* Feedback content */}
                        {feedback ? (
                            <div className="flex flex-col gap-5 animate-in fade-in duration-500">
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