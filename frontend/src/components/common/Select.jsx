import React from "react";
import DownIcon from "@/assets/icons/Down.svg";

function Select({ label, name, value, onChange, children }) {
  const selectClass = `select-control ${value ? "has-value" : "is-placeholder"}`;

  return (
    <div className="form-field select-inside">
      <div className="select-inner">
        {/* visually placed label inside the select field */}
        {label && <span className="select-inside-label">{label}</span>}
        <select id={name} name={name} value={value} onChange={onChange} className={selectClass} data-value={value}>
          {children}
        </select>
        <span className="custom-select-arrow">
          <img src={DownIcon} alt="dropdown arrow" />
        </span>
      </div>
    </div>
  );
}

export default Select;
