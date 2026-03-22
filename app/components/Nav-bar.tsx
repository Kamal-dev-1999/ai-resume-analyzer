import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const NavBar: React.FC = () => {
  const { auth, isLoading } = usePuterStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await auth.signOut();
    navigate("/");
  };

  // Avatar initials from username
  const user = auth.user as { username?: string; email?: string } | null;
  const displayName = user?.username || user?.email || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
        <div className="nav-brand-dot" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <text x="2" y="13" fontSize="13" fontWeight="700" fill="white" fontFamily="sans-serif">R</text>
          </svg>
        </div>
        <span className="nav-brand-name">ResuMind</span>
      </Link>

      {/* Right zone */}
      <div className="flex flex-row items-center gap-3">
        {isLoading ? (
          /* Loading skeleton */
          <div
            className="h-9 w-24 rounded-full animate-pulse"
            style={{ background: "#e2e8f0" }}
          />
        ) : auth.isAuthenticated ? (
          /* ── Authenticated state ── */
          <>
            {/* Upload Resume CTA */}
            <Link
              to="/upload"
              className="hidden sm:flex flex-row items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 9V1M4 4l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload Resume
            </Link>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex flex-row items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 cursor-pointer"
                style={{
                  border: "1px solid var(--color-border)",
                  background: dropdownOpen ? "var(--color-surface-2)" : "transparent",
                }}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {/* Avatar circle */}
                <div
                  className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                  style={{
                    width: 30,
                    height: 30,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff",
                    letterSpacing: "0.5px",
                  }}
                >
                  {initials}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block max-w-[120px] truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {displayName}
                </span>
                {/* Chevron */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="hidden sm:block"
                  style={{
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
                  style={{
                    minWidth: 200,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                    animation: "fadeInDown 0.15s ease",
                  }}
                >
                  {/* User info header */}
                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                      Signed in as
                    </p>
                    <p
                      className="text-sm font-semibold mt-0.5 truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {displayName}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <Link
                      to="/upload"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                      style={{ color: "var(--color-text-secondary)", textDecoration: "none", display: "flex" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M7.5 9.5V1.5M4 5l3.5-3.5L11 5M1.5 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload New Resume
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                      style={{ color: "var(--color-text-secondary)", textDecoration: "none", display: "flex" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1.5 5.5l6-4 6 4M2.5 5.5V13h4V9.5h2V13h4V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      My Resumes
                    </Link>
                  </div>

                  {/* Divider + Sign out */}
                  <div className="border-t py-1.5" style={{ borderColor: "var(--color-border)" }}>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors duration-150 cursor-pointer"
                      style={{ color: "#dc2626", background: "transparent", border: "none", display: "flex" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fff1f2")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M5.5 13H2.5a1 1 0 01-1-1V3a1 1 0 011-1h3M10 10l3-2.5L10 5M13 7.5H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ── Guest state ── */
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() => auth.signIn()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
                background: "transparent",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-surface-2)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              }}
            >
              Sign In
            </button>
            <Link
              to="/upload"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                textDecoration: "none",
              }}
            >
              Get Started
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7.5 3l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;