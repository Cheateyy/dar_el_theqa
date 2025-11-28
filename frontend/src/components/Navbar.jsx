import React from "react";
import "../assets/styles/Navbar.css";
import LogoIcon from "@/assets/icons/DARTHIQA.svg";
import LanguageIcon from "@/assets/icons/language.svg";
import ExploreIcon from "@/assets/icons/explore.svg";
import NotifIcon from "@/assets/icons/notif.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import MenuIcon from "@/assets/icons/Menu.svg";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={LogoIcon} alt="Dar El Theqa" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        <button className="navbar-link" type="button">
          <img src={LanguageIcon} alt="Language" className="navbar-icon" />
        </button>

        <button className="navbar-link" type="button">
          <img src={ExploreIcon} alt="Explore Properties" className="navbar-explore-icon" />
        </button>

        <button className="navbar-icon-btn" type="button">
          <img src={NotifIcon} alt="notification" />
        </button>

        <button className="navbar-icon-btn" type="button">
          <img src={ProfileIcon} alt="Profile" />
        </button>

        <button className="navbar-icon-btn" type="button">
          <img src={MenuIcon} alt="Menu" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
