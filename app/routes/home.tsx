import type { Route } from "./+types/home";
import NavBar from "~/components/Nav-bar";
import ResumeCard from "~/components/Resume-card";
import { resumes as mockResumes } from "../../constants";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { useEffect, useState } from "react";

// Feedback Parsing Helper from resume.tsx
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

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResuMind" },
    { name: "description", content: "AI-powered resume analysis and tracking." },
  ];
}

export default function Home() {
  const { fs, kv, isLoading, auth } = usePuterStore();
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [isFetchingResumes, setIsFetchingResumes] = useState(false);

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

  // Use real user resumes if available, otherwise fallback to mock data
  const resumesToDisplay = userResumes.length > 0 ? userResumes : mockResumes;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#e0e7ff] to-[#f3e8ff] opacity-60 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-[#ede9fe] to-[#f5f3ff] opacity-60 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iI2U4ZWFmNiIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-70" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center pt-24 pb-20 px-6 sm:px-10 text-center mx-auto max-w-5xl">
          
          {/* Subtle Label Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-white/60 border border-[#e2e8f0] shadow-sm backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]"></span>
            </span>
            <span className="text-xs font-semibold text-[#475569] tracking-wide uppercase">AI-Powered Analysis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0f172a] mb-6 leading-[1.15] animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
            Perfect your resume with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef]">
              intelligent insights
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#64748b] max-w-2xl mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
            Track your applications and get incredibly detailed, actionable feedback designed to beat Applicant Tracking Systems.
          </p>

          {/* Auth-aware CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300">
            {isLoading ? (
              <div className="h-16 w-60 rounded-full bg-slate-200/50 animate-pulse" />
            ) : auth.isAuthenticated ? (
              <Link
                to="/upload"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-[#0f172a] rounded-full hover:bg-[#1e293b] hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] hover:-translate-y-1"
                style={{ textDecoration: "none" }}
              >
                Upload New Resume
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => auth.signIn()}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.6)] hover:-translate-y-1 border-none cursor-pointer"
              >
                Sign In to Get Started
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>

          {/* Logged-in user greeting */}
          {!isLoading && auth.isAuthenticated && (
            <div className="mt-8 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] animate-in fade-in duration-700 delay-500">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white font-bold text-sm shadow-sm ring-2 ring-white">
                {((auth.user as { username?: string })?.username || "U").slice(0, 1).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#475569]">
                Welcome back, <strong className="text-[#0f172a] font-semibold">{(auth.user as { username?: string })?.username || "there"}</strong>
              </span>
            </div>
          )}
        </section>

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
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      </div>
    </main>
  );
}
