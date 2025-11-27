import React from "react";
import "../../assets/styles/button.css";
import nextIcon from "../../assets/icons/next.svg";
import sendforapproval from "../../assets/icons/Tick.svg";

function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  icon = "next", // NEW PROP
}) {
  const iconToUse = icon === "approval" ? sendforapproval : nextIcon;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variant} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="spinner"></span>
      ) : (
        <>
          <span className="button-label">{children}</span>
          {variant !== "secondary" && (
            <img
              src={iconToUse}
              alt="icon"
              className="button-icon"
            />
          )}
        </>
      )}
    </button>
  );
}

export default Button;
