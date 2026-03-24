import React from "react";
import { useState, useEffect } from "react";
import { usePuterStore } from "../lib/puter";
// import  { resume }  from "../../constants";
import ResumeCard from "~/components/Resume-card";
import NavBar from "~/components/Nav-bar";


const parseFeedback = (value: unknown): any | null => {
  if (!value) return null;
  let parsed: unknown = value;
  for (let i = 0; i < 2; i++) {
    if (typeof parsed !== "string") break;
    try { parsed = JSON.parse(parsed); } catch { break; }
  }
  if (!parsed || typeof parsed !== "object") return null;
  const candidate = parsed as any;
  if (!candidate.ATS || typeof candidate.ATS.score !== "number") return null;
  return candidate;
};

const MyResume = () => {
  const { fs, kv, auth, isLoading } = usePuterStore();
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [isFetchingResumes, setIsFetchingResumes] = useState(false);
  const resumesToDisplay = userResumes.length > 0 ? userResumes : [];

  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!auth.isAuthenticated || !kv) return;
      setIsFetchingResumes(true);
      try {
        const keys = await kv.list("resume-analysis-*");
        if (keys && Array.isArray(keys)) {
          const items = await Promise.all(keys.map(k => kv.get(k as string)));
          const parsedResumes = items.map(item => {
            if (!item) return null;
            try {
              const data = JSON.parse(item as string);
              return {
                id: data.id,
                companyName: data.companyName || "Unknown Company",
                jobTitle: data.jobTitle || "Unknown Role",
                imagePath: data.resumeImagePath || "",
                resumePath: data.resumePath || "",
                feedback: parseFeedback(data.feedback)
              };
            } catch (e) {
              return null;
            }
          }).filter(r => r !== null && r.feedback !== null);
          
          setUserResumes(parsedResumes);
        }
      } catch (err) {
        console.error("Failed to fetch user resumes", err);
      } finally {
        setIsFetchingResumes(false);
      }
    };

    fetchUserResumes();
  }, [auth.isAuthenticated, kv]);
  return (
    <>
      <main>
        <NavBar />
        <br />
        <h1>My Resumes</h1>
        {/* Resumes Grid / Guest Empty State */}
        <div className="flex-1 w-full max-w-[1500px] mx-auto xl:px-8 px-6 pb-24">
          {!isLoading && auth.isAuthenticated ? (
            <div className="flex flex-col gap-6 animate-in fade-in duration-1000 delay-300">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4 mb-4 mt-8">
                <h3 className="text-2xl font-bold text-[#0f172a] flex items-center gap-3">
                  Your Resumes
                  {userResumes.length === 0 && <span className="text-sm font-medium text-[#f59e0b] bg-[#fef3c7] px-2.5 py-0.5 rounded-full border border-[#fcd34d]">Demo Data</span>}
                </h3>
                <span className="text-sm font-medium text-[#64748b] bg-[#f1f5f9] px-3 py-1 rounded-full">{resumesToDisplay.length} saved</span>
              </div>

              {isFetchingResumes ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
                  {resumesToDisplay.map((resume: any) => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))}
                </div>
              )}
            </div>
          ) : !isLoading && !auth.isAuthenticated ? (
            <div className="flex justify-center max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-400">
              <div className="w-full relative group">
                {/* Decorative background glow for empty state */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#6366f1] to-[#d946ef] opacity-20 blur-xl group-hover:opacity-30 transition duration-1000"></div>

                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-10 sm:p-14 text-center border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] text-[#0f172a]">
                  <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] shadow-inner border border-[#e2e8f0]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#6366f1]">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
                    Sign in to view history
                  </h3>
                  <p className="text-[#64748b] text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    Your previous AI analysis results, parsed ATS scores, and resume versions are securely saved to your account.
                  </p>
                  <button
                    onClick={() => auth.signIn()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e2e8f0] transition-colors duration-200 cursor-pointer border-none"
                  >
                    Authenticate with Puter
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}

export default MyResume;