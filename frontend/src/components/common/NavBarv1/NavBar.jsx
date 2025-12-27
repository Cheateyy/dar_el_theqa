import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import derTheqaLogo from "../../../assets/images/dar_el_theqa_logo.png";
import { useAuth } from "../../../contexts/AuthContext";

import "./NavBar.css";

export default function NavBar({ onLoginClick }) {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to logout", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="navBar">
            <div className="leftSideNav">
                <Link to="/">
                    <img src={derTheqaLogo} alt="Dar El Theqa Logo" />
                </Link>
            </div>

            <div className="rightSideNav">
                {isAuthenticated ? (
                    <>
                        {/* Use same button UI as old navbar */}
                        <button
                            className="loginButton"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? "Logging out..." : "Log Out"}
                        </button>
                    </>
                ) : (
                    <Link to="/">
                        <button className="loginButton" onClick={onLoginClick}>
                            Log In
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
