// src/pages/AddPartner.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Addpartner.css";
import { wilayas, regions } from "../utils/algeria.js";

import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

import removeIcon from "../assets/icons/removeimage.png";
import imageIcon from "../assets/icons/imageicon.svg";

function AddPartner() {
  const navigate = useNavigate();
  const logoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    wilaya: "",
    region: "",
    address: "",
    logo: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Single-field validator (runs on each change)
  const validateField = (name, value) => {
    switch (name) {
      case "companyName": {
        const v = value.trim();
        if (!v) return "Required";
        if (v.length < 2 || v.length > 100) return "Must be 2-100 characters";
        return "";
      }
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "Required";
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";
      }
      case "phoneNumber": {
        // Valid Algerian phone: 00213 / +213 / 0, then 5/6/7, then 8 digits
        const phoneRegex = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
        if (!value) return "Required";
        if (!phoneRegex.test(value)) return "Invalid Algerian phone number";
        return "";
      }
      case "wilaya":
        if (!value) return "Required";
        return "";
      case "region":
        if (!value) return "Required";
        return "";
      case "address": {
        const v = value.trim();
        if (!v) return "Required";
        if (v.length < 10 || v.length > 200) return "Must be 10-200 characters";
        return "";
      }
      case "logo":
        if (!value) return "Required";
        return "";
      default:
        return "";
    }
  };

  // Full-form validator (backup on submit)
  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const fieldError = validateField(name, value);
      if (fieldError) newErrors[name] = fieldError;
    });
    return newErrors;
  };

  // Real-time: validate each field as user types/selects
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const openLogoPicker = () => {
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
      logoInputRef.current.click();
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setFormData((prev) => ({ ...prev, logo: file.name }));
      setTouched((prev) => ({ ...prev, logo: true }));

      const fieldError = validateField("logo", file.name);
      setErrors((prev) => ({ ...prev, logo: fieldError }));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setFormData((prev) => ({ ...prev, logo: "" }));
    setTouched((prev) => ({ ...prev, logo: true }));

    const fieldError = validateField("logo", "");
    setErrors((prev) => ({ ...prev, logo: fieldError }));
  };

  // Derive isFormValid whenever data or errors change (controls Save button)
  useEffect(() => {
    const hasErrors = Object.values(errors).some((msg) => msg);

    const allRequiredFilled =
      formData.companyName &&
      formData.email &&
      formData.phoneNumber &&
      formData.wilaya &&
      formData.region &&
      formData.address &&
      formData.logo;

    setIsFormValid(!hasErrors && !!allRequiredFilled);
  }, [errors, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsFormValid(false);
      return;
    }

    // Build the partner object to store
    const newPartner = {
      id: Date.now(),
      companyName: formData.companyName,
      address: `${formData.address}, ${formData.region}, ${formData.wilaya}`,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
    };

    // Read existing partners, append, and save back
    const stored = localStorage.getItem("partners");
    const partners = stored ? JSON.parse(stored) : [];
    partners.push(newPartner);
    localStorage.setItem("partners", JSON.stringify(partners)); // persists across pages [web:209][web:213][web:218]

    navigate("/partner-accounts");
  };

  return (
    <div className="page-wrapper">
      <div className="add-listing-container">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate(-1)}
        >
          <img
            src="../src/assets/icons/back.svg"
            className="back-icon"
            alt="Back"
          />
          Back
        </button>

        <h1 className="page-title">Add a Partner</h1>

        <form className="add-listing-form" onSubmit={handleSubmit}>
          <Section title="Basics">
            {/* Company Name */}
            <Input
              label="Company Name *"
              name="companyName"
              value={formData.companyName}
              placeholder="Enter company name"
              onChange={handleChange}
            />
            {errors.companyName ? (
              <span className="error-text">{errors.companyName}</span>
            ) : (
              touched.companyName &&
              formData.companyName && (
                <span className="success-text">Valid!</span>
              )
            )}

            {/* Email */}
            <Input
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter company email"
              onChange={handleChange}
            />
            {errors.email ? (
              <span className="error-text">{errors.email}</span>
            ) : (
              touched.email &&
              formData.email && <span className="success-text">Valid!</span>
            )}

            {/* Phone Number */}
            <Input
              label="Phone Number *"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              placeholder="Enter phone number"
              onChange={handleChange}
            />
            {errors.phoneNumber ? (
              <span className="error-text">{errors.phoneNumber}</span>
            ) : (
              touched.phoneNumber &&
              formData.phoneNumber && (
                <span className="success-text">Valid!</span>
              )
            )}
          </Section>

          <Section title="Location">
            {/* Wilaya */}
            <Select
              label="Wilaya *"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
            >
              <option value="">Select wilaya</option>
              {wilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
            {errors.wilaya ? (
              <span className="error-text">{errors.wilaya}</span>
            ) : (
              touched.wilaya &&
              formData.wilaya && <span className="success-text">Valid!</span>
            )}

            {/* Region */}
            <Select
              label="Region *"
              name="region"
              value={formData.region}
              disabled={!formData.wilaya}
              onChange={handleChange}
            >
              <option value="">Select region</option>
              {formData.wilaya &&
                regions[formData.wilaya]?.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </Select>
            {errors.region ? (
              <span className="error-text">{errors.region}</span>
            ) : (
              touched.region &&
              formData.region && <span className="success-text">Valid!</span>
            )}

            {/* Listing Address */}
            <Input
              label="Listing Address *"
              name="address"
              value={formData.address}
              placeholder="Enter street address"
              onChange={handleChange}
            />
            {errors.address ? (
              <span className="error-text">{errors.address}</span>
            ) : (
              touched.address &&
              formData.address && <span className="success-text">Valid!</span>
            )}
          </Section>

          {/* Company Logo */}
          <Section title="">
            <div className="logo-header">
              <span className="section-title">Company Logo *</span>
              <button
                type="button"
                onClick={openLogoPicker}
                className={`add-document-btn ${logoFile ? "added" : ""}`}
                disabled={!!logoFile}
              >
                +
              </button>
            </div>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.svg"
              ref={logoInputRef}
              onChange={handleLogoChange}
              style={{ display: "none" }}
            />

            {logoFile && (
              <div className="document-card">
                <div className="document-file-row">
                  <span className="document-filename">
                    <img
                      src={imageIcon}
                      className="small-pdf-icon"
                      alt="file"
                    />
                    {logoFile.name}
                  </span>
                  <button
                    type="button"
                    className="remove-document-btn"
                    onClick={removeLogo}
                  >
                    <img
                      src={removeIcon}
                      alt="remove"
                      className="remove-icon"
                    />
                  </button>
                </div>
              </div>
            )}
            {errors.logo ? (
              <span className="error-text">{errors.logo}</span>
            ) : (
              touched.logo &&
              formData.logo && <span className="success-text">Valid!</span>
            )}
          </Section>

          <div className="form-footer">
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid}
              className={!isFormValid ? "disabled-btn" : ""}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPartner;
