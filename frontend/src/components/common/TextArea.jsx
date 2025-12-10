import React from "react";

function TextArea({ label, name, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export default TextArea;
