import type { Route } from "./+types/home";
import NavBar from "~/components/Nav-bar";
import ResumeCard from "~/components/Resume-card";
import { resumes } from "../../constants";
import bgMain from "~/images/bg-main.svg";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMind" },
    { name: "description", content: "AI-powered resume analysis and tracking." },
  ];
}

export default function Home() {
  const { isLoading, auth } = usePuterStore();

  return (
    <main
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      <NavBar />

      {/* Hero section */}
      <section className="main-section">
        <div className="page-heading">
          <h1>Track your Application &amp; Resume analysis</h1>
          <h2>Get AI-Powered Resume Analysis</h2>
        </div>

        {/* Auth-aware CTA */}
        <div className="flex flex-row flex-wrap gap-3 justify-center">
          {isLoading ? (
            /* Loading skeleton for CTA */
            <div
              className="h-14 w-56 rounded-full animate-pulse"
              style={{ background: "rgba(255,255,255,0.3)" }}
            />
          ) : auth.isAuthenticated ? (
            /* Logged-in: Upload CTA */
            <Link
              to="/upload"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 12V2M5 6l4-4 4 4M2 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload New Resume
            </Link>
          ) : (
            /* Guest: Sign in prompt */
            <>
              <button
                onClick={() => auth.signIn()}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                  border: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M12 2a4 4 0 110 8 4 4 0 010-8zM2 16c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign In to Get Started
              </button>
            </>
          )}
        </div>

        {/* Logged-in user badge */}
        {!isLoading && auth.isAuthenticated && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium animate-in fade-in duration-500"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              color: "var(--color-text-secondary)",
            }}
          >
            <span
              className="flex items-center justify-center rounded-full text-xs font-bold"
              style={{
                width: 22,
                height: 22,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {((auth.user as { username?: string })?.username || "U").slice(0, 1).toUpperCase()}
            </span>
            <span>
              Welcome back,{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                {(auth.user as { username?: string })?.username || "there"}
              </strong>
            </span>
          </div>
        )}
      </section>

      {/* Resumes grid — shown only when authenticated */}
      {!isLoading && auth.isAuthenticated && resumes.length > 0 && (
        <section className="resumes-container">
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </section>
      )}

      {/* Guest prompt card — shown when not authenticated */}
      {!isLoading && !auth.isAuthenticated && (
        <section className="resumes-container">
          <div
            className="mx-auto max-w-lg rounded-2xl px-8 py-10 text-center"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(99,102,241,0.15)",
              boxShadow: "0 8px 32px rgba(99,102,241,0.10)",
            }}
          >
            <div
              className="mx-auto mb-4 flex items-center justify-center rounded-2xl"
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 3a5 5 0 110 10A5 5 0 0113 3zM3 23c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Sign in to see your resumes
            </h3>
            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Your resume history and AI analysis results are saved to your account. Sign in to access them.
            </p>
            <button
              onClick={() => auth.signIn()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                border: "none",
                boxShadow: "0 3px 12px rgba(99,102,241,0.35)",
              }}
            >
              Sign In with Puter
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
