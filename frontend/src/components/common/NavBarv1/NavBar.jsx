import derTheqaLogo from "../../../assets/images/dar_el_theqa_logo.png";
import "./NavBar.css";
import { Link } from "react-router-dom";

export default function NavBar({ onLoginClick }) {
    return (
        <div className="navBar">
            <div className="leftSideNav">
                <Link to="/">
                    <img src={derTheqaLogo} alt="Dar El Theqa Logo" />
                </Link>
            </div>
            <div className="rightSideNav">
                <Link to="/">
                <button className="loginButton" onClick={onLoginClick}>
                    Log In
                </button>
                </Link>
            </div>
        </div>
    );
}
