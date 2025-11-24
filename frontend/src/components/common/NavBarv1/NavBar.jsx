import derTheqaLogo from "../../../assets/images/dar_el_theqa_logo.png";
import "./NavBar.css";

export default function NavBar({ onLoginClick }) {
    return (
        <div className="navBar">
            <div className="leftSideNav">
                <img src={derTheqaLogo} alt="Dar El Theqa Logo" />
            </div>
            <div className="rightSideNav">
                <button className="loginButton" onClick={onLoginClick}>
                    Log In
                </button>
            </div>
        </div>
    );
}
