// src/pages/AddPartner.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "../assets/styles/Addpartner.css";

import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

import BackIcon from "@/assets/icons/back.svg";
import removeIcon from "../assets/icons/removeimage.png";
import imageIcon from "../assets/icons/imageicon.svg";

const USE_MOCK_PARTNERS = false;

function AddPartner() {
  const navigate = useNavigate();
 const { user, isAuthenticated, loading } = useAuth();



  /* =======================
     STATE
  ======================== */
  const logoInputRef = useRef(null);

  const [wilayas, setWilayas] = useState([]);
  const [regions, setRegions] = useState([]);

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
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     FETCH WILAYAS
  ======================== */
  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        const res = await fetch("/api/choices/wilayas/", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch wilayas");
        const data = await res.json();
        setWilayas(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWilayas();
  }, []);

  /* =======================
     FETCH REGIONS BY WILAYA
  ======================== */
  useEffect(() => {
    if (!formData.wilaya) {
      setRegions([]);
      return;
    }

    const fetchRegions = async () => {
      try {
        const res = await fetch(
          `/api/choices/regions/?wilaya=${formData.wilaya}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch regions");
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegions();
  }, [formData.wilaya]);

  /* =======================
     VALIDATION
  ======================== */
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
        const phoneRegex = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
        if (!value) return "Required";
        if (!phoneRegex.test(value))
          return "Invalid Algerian phone number";
        return "";
      }
      case "wilaya":
        return value ? "" : "Required";
      case "region":
        return value ? "" : "Required";
      case "address": {
        const v = value.trim();
        if (!v) return "Required";
        if (v.length < 10 || v.length > 200)
          return "Must be 10-200 characters";
        return "";
      }
      case "logo":
        return value ? "" : "Required";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const fieldError = validateField(name, value);
      if (fieldError) newErrors[name] = fieldError;
    });
    return newErrors;
  };

  /* =======================
     HANDLERS
  ======================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "wilaya" ? { region: "" } : {}),
    }));

    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const openLogoPicker = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setFormData((prev) => ({ ...prev, logo: file.name }));
    setTouched((prev) => ({ ...prev, logo: true }));
    setErrors((prev) => ({ ...prev, logo: "" }));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setFormData((prev) => ({ ...prev, logo: "" }));
    setTouched((prev) => ({ ...prev, logo: true }));
    setErrors((prev) => ({ ...prev, logo: "Required" }));
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some(Boolean);
    const allFilled =
      formData.companyName &&
      formData.email &&
      formData.phoneNumber &&
      formData.wilaya &&
      formData.region &&
      formData.address &&
      formData.logo;

    setIsFormValid(!hasErrors && allFilled);
  }, [errors, formData]);

  /* =======================
     SUBMIT
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = new FormData();
    payload.append("name", formData.companyName);
    payload.append("email", formData.email);
    payload.append("phone_number", formData.phoneNumber);
    payload.append("wilaya", formData.wilaya);
    payload.append("region", formData.region);
    payload.append("address", formData.address);
    if (logoFile) payload.append("logo", logoFile);

    setSubmitting(true);
    const res = await fetch("/api/admin/partners/", {
      method: "POST",
      body: payload,
      credentials: "include",
    });
    setSubmitting(false);

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    navigate("/forms-tables/partner-accounts");
  };

  /* =======================
     UI (UNCHANGED)
  ======================== */
  return (
    <div className="page-wrapper">
      <div className="add-listing-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={BackIcon} className="back-icon" alt="Back" />
          Back
        </button>

        <h1 className="page-title">Add a Partner</h1>

        <form className="add-listing-form" onSubmit={handleSubmit}>
          <Section title="Basics">
            <Input label="Company Name *" name="companyName" value={formData.companyName} onChange={handleChange} />
            {errors.companyName && <span className="error-text">{errors.companyName}</span>}

            <Input label="Email *" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <Input label="Phone Number *" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
          </Section>

          <Section title="Location">
            <Select label="Wilaya *" name="wilaya" value={formData.wilaya} onChange={handleChange}>
              <option value="">Select wilaya</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </Select>

            <Select label="Region *" name="region" value={formData.region} disabled={!formData.wilaya} onChange={handleChange}>
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </Select>
          </Section>

          <Section title="">
            <div className="logo-header">
              <span className="section-title">Company Logo *</span>
              <button
                type="button"
                onClick={openLogoPicker}
                className={`add-logo-btn ${logoFile ? "added" : ""}`}
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
              <div className="logo-card">
                <div className="logo-file-row">
                  <span className="logo-filename">
                    <img
                      src={imageIcon}
                      className="small-pdf-icon"
                      alt="file"
                    />
                    {logoFile.name}
                  </span>
                  <button
                    type="button"
                    className="remove-logo-btn"
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
              disabled={!isFormValid || submitting}
              className={!isFormValid ? "disabled-btn" : ""}
            >
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPartner;
