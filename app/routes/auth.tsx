import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import bgMain from "~/images/bg-main.svg";
import  {usePuterStore}  from "~/lib/puter";

export const meta = ()=>(
   [ { title:"ResuMind | Auth" },
    { name: "description", content: "Authentication page for ResuMind" },]
)

const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get("next") || "/home";
    const navigate = useNavigate();

    useEffect(() =>{
        if(auth.isAuthenticated){
            navigate(next, { replace: true });
        }
    },[auth.isAuthenticated, navigate, next]

    )

    return (
        <main
    className="flex items-center justify-center bg-cover bg-center min-h-screen"
    style={{ backgroundImage: `url(${bgMain})` }}
    >
    <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue</h2>
        </div>
        <div>
            {isLoading ? (
            <button className="auth-button animate-pulse">Signing you in....</button>
            ) : (
           <>
           {auth.isAuthenticated ? (
            <button className="auth-button" onClick={auth.signOut}><p>LogOut</p></button>
           ) : (
            <button className="auth-button btn-primary w-full" onClick={auth.signIn}><p>Log In</p></button>
           )}
           </>
            )}
        </div>
        </section>
    </div>
    </main>
    )
}
export default Auth;