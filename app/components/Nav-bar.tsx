import React from "react";
import { Link } from "react-router";

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
        <Link to="/">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">RESUMIND</p>
        </Link>
        <Link className="primary-btn" to="/upload">
            <p>Upload Resume</p>
        </Link>
        </nav>
    )
}

export default NavBar;