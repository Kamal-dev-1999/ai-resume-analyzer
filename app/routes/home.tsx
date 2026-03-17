import type { Route } from "./+types/home";
import NavBar from "~/components/Nav-bar";
import ResumeCard from "~/components/Resume-card";
import { resumes } from "../../constants";
import bgMain from "~/images/bg-main.svg";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMind" },
    { name: "description", content: "Welcome to ResuMind!" },
  ];
}

export default function Home() {
   const {isLoading, auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() =>{
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/home", { replace: true });
        }
  },[auth.isAuthenticated, isLoading, navigate]

    )
  return (
    <main
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      <NavBar />
      {/* {window.puter.ai.chat()} */}
      <section className="main-section">
        <div className="page-heading">
          <h1>Track your Application & Resume analysis</h1>
          <h2>Get AI-Powered Resume Analysis</h2>
        </div>
      </section>

      {resumes.length > 0 && (
        <section className="resumes-container">
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </section>
      )}
    </main>

  );
}
