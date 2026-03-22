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
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                <img src={backIon} alt="logo" className="w-5 h-5" />
                <span className="">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section
                    className="feedback-section bg-cover bg-center h-100vh sticky top-0 justify-center items-center flex"
                    style={{ backgroundImage: `url(${smallBackground})` }}
                >
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-5">
                            <a href={resumeUrl} target="_blank" rel="noreferrer">
                                <img
                                    src={imageUrl}
                                    alt="Resume"
                                    title="Resume"
                                    className="w-full h-full object-contain rounded-2xl"
                                />
                            </a>
                        </div>
                    )}
                </section>
            <section className="feedback-section">
                <h2 className="text-4xl text-black font-bold">Resume Review</h2>
                {feedback ? (
                    <div className="flex flex-col gap-5 ">
                        <Summary feedback={feedback} />
                        <ATS score={feedback.ATS.score} suggestions={feedback.ATS.tips} />
                        <Details feedback={feedback} />
                    </div>
                ): (
                    <img src={resumeScan} alt="Resume Scan" className="w-full"/>
                )}
            </section>
            </div>
        </main>
    )
}

export default Resume;