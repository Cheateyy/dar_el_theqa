import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Navbar.css";

import LogoIcon from "@/assets/icons/DARTHIQA.svg";
import LanguageIcon from "@/assets/icons/language.svg";
import ExploreIcon from "@/assets/icons/explore.svg";
import NotifIcon from "@/assets/icons/notif.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import MenuIcon from "@/assets/icons/Menu.svg";


import MyListingIcon from "@/assets/icons/mylistingsoption.svg";
import MessagesIcon from "@/assets/icons/navmessagesoption.svg";

function Navbar() {
  const navigate = useNavigate();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const langRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setShowMenu(false);

  const handleExploreClick = () => {
    navigate("/explore-properties");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={LogoIcon} alt="Dar El Theqa" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        {/* LANGUAGE MENU */}
        <div className="navbar-lang-wrapper" ref={langRef}>
          <button
            className="navbar-link"
            type="button"
            onClick={() => setShowLangMenu((p) => !p)}
          >
            <img src={LanguageIcon} alt="Language" className="navbar-icon" />
          </button>

          {showLangMenu && (
            <div className="lang-dropdown">
              <button className="lang-item">Arabic</button>
              <button className="lang-item">English</button>
              <button className="lang-item">French</button>
            </div>
          )}
        </div>

        {/* EXPLORE PROPERTIES */}
        <button className="navbar-link" onClick={handleExploreClick}>
          <img src={ExploreIcon} alt="Explore Properties" className="navbar-explore-icon" />
        </button>

        {/* NOTIFICATIONS */}
        <button className="navbar-icon-btn" type="button">
          <img src={NotifIcon} alt="notification" />
        </button>

        {/* PROFILE */}
        <button className="navbar-icon-btn" type="button">
          <img src={ProfileIcon} alt="Profile" />
        </button>

        {/* MAIN MENU */}
        <div className="navbar-menu-wrapper" ref={menuRef}>
          <button
            className="navbar-icon-btn"
            type="button"
            onClick={() => setShowMenu((p) => !p)}
          >
            <img src={MenuIcon} alt="Menu" />
          </button>

          {showMenu && (
            <div className="menu-dropdown">
              {/* ADD LISTING */}
              <button
                className="menu-item"
                onClick={() => {
                  navigate("/forms-tables/add-listing");
                  closeMenu();
                }}
              >
                <span className="menu-icon-text">
                  <span className="menu-plus">+</span>
                  Add a Listing
                </span>
              </button>

              {/* MY LISTINGS */}
              <button
                className="menu-item"
                onClick={() => {
                  navigate("/seller/listings");
                  closeMenu();
                }}
              >
                <span className="menu-icon-text">
                  <img src={MyListingIcon} alt="" className="menu-icon" />
                  My Listings
                </span>
              </button>

              {/* LEAD MESSAGES */}
              <button
                className="menu-item"
                onClick={() => {
                  navigate("/forms-tables/lead-messages");
                  closeMenu();
                }}
              >
                <span className="menu-icon-text">
                  <img src={MessagesIcon} alt="" className="menu-icon" />
                  Lead Messages
                </span>
              </button>

              {/* LOG OUT */}
              <button className="menu-item logout" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
