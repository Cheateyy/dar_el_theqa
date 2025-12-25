import { useState } from "react";
import NavBar from "../components/common/NavBarv1/NavBar.jsx";
import LoginModal from "../components/common/LoginPopUp/LoginModal.jsx";
import "./NotFound.css";

export default function NotFound() {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

    return (
        <>
            <nav>
                <NavBar onLoginClick={handleLoginClick} />
            </nav>
            <section className="notfound-container">
                <p className="notfound-message">Page not found</p>
            </section>
            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
