import React from "react";
import "../assets/styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="src/assets/icons/DARTHIQA.svg" alt="Dar El Theqa" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        <button className="navbar-link" type="button">
          <img src="src/assets/icons/language.svg" alt="Language" className="navbar-icon" /> 
        </button>
      

        <div className="navbar-right">
        <button className="navbar-link" type="button">
          <img src="src/assets/icons/explore.svg" alt="Explore Properties" className="navbar-explore-icon" /> 
        </button>
        </div>

        <button className="navbar-icon-btn" type="button">
          <img src="src/assets/icons/notif.svg" alt="notification" />
          
        </button>

        <button className="navbar-icon-btn" type="button">
          <img src="src/assets/icons/profile.svg" alt="Profile" />
          
        </button>

        <button className="navbar-icon-btn" type="button">
         <img src="src/assets/icons/Menu.svg" alt="Menu" /> 
        </button>
        </div>
    </header>
  );
}

export default Navbar;
