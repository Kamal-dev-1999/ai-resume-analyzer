import { Link } from "react-router";
import ScoreCircle from "./Score-cricle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link 
            to={`/resume/${id}`}  
            className="group relative flex flex-col w-full h-[580px] 2xl:h-[640px] rounded-[24px] p-1.5 transition-all duration-500 ease-out hover:-translate-y-2 text-left"
            style={{ textDecoration: "none" }}
        >
            {/* Animated Gradient Border Layer */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#ffffff90] via-[#ffffff10] to-[#ffffff60] opacity-100 transition-opacity duration-500 group-hover:opacity-0" style={{ padding: "1px" }}>
                 <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#6366f1] via-[#d8b4fe] to-[#8b5cf6] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Glowing Shadow Layer */}
            <div className="absolute -inset-4 rounded-[32px] bg-[#6366f1] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15 -z-10" />

            {/* Card Content Surface */}
            <div className="relative flex flex-col h-full w-full rounded-[22px] bg-white overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] transition-shadow duration-500">
                
                {/* Header Section */}
                <div className="flex flex-row items-center justify-between p-6 pb-5 min-h-[110px] bg-gradient-to-b from-[#f8fafc] to-white border-b border-[#f1f5f9]">
                    <div className="flex flex-col gap-1.5 pr-4 min-w-0">
                        <h2 className="text-xl font-bold text-[#0f172a] truncate leading-tight tracking-tight">
                            {companyName}
                        </h2>
                        <h3 className="text-[15px] font-medium text-[#64748b] truncate">
                            {jobTitle}
                        </h3>
                    </div>
                    <div className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>

                {/* Resume Image Preview Section */}
                <div className="relative flex-1 bg-[#f8fafc] p-6 flex flex-col items-center justify-center overflow-hidden">
                    {/* Decorative subtle grid background */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iI2U4ZWFmNiIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjciLz48L3N2Zz4=')] opacity-50" />
                    
                    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[#e2e8f0] transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                        <img 
                            src={imagePath} 
                            alt={`${companyName} Resume`} 
                            className="w-full h-full object-cover object-top" 
                        />
                        {/* Inner shadow overlay for image */}
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                        
                        {/* Hover Overlay 'View Analysis' */}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[0_8px_16px_rgba(15,23,42,0.3)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                View Analysis
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2.5 7h9M7 3l4.5 4L7 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;