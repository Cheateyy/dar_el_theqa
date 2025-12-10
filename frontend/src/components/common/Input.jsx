// src/components/common/Input.jsx
import React from "react";

function Input({ label, className = "", ...props }) {
  return (
    <div className={`form-field ${className}`}>
      {label && <span className="field-label-inside">{label}</span>}
      <input {...props} />
    </div>
  );
}

export default Input;
