import { Link, useParams } from "react-router";
import backIon from "../assets/icons/back.png";
import { useEffect, useState } from "react";
import { usePuterStore } from "../lib/puter";
import smallBackground from "../images/bg-small.svg";



export const meta = ()=>(
   [ { title:"ResuMind | Review" },
    { name: "description", content: "Review page for ResuMind" },]
)

const Resume =() => {
    const { id } = useParams();
    const { fs, kv } = usePuterStore();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

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
            setFeedback(data.feedback ?? null);
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
            <section className="feedback-section bg-cover bg-center h-100vh sticky top-0 justify-center items-center flex" style={{ backgroundImage: `url(${smallBackground})` }}>
                            {imageUrl && resumeUrl && (
                                <div className="animate-in fade-in duration-1000 gradient-border max-sm:5m">
                                <a href={resumeUrl} target="_blank" rel="noreferrer">
                    <img src={imageUrl} alt="Resume" title="Resume" className="w-full h-full object-contain rounded-2xl"/>
                </a>
                </div>
              )
            }
            </section>
            </div>
        </main>
    )
}

export default Resume;