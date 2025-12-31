// src/pages/AddPartner.jsx
import { API_BASE_URL } from "/src/config/env.js";

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

function AddPartner() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user || user.role == null) return;

    const role = String(user.role).toUpperCase();
    if (!role.includes("ADMIN")) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

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
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/choices/wilayas/`)
      .then((res) => res.json())
      .then((data) => setWilayas(Array.isArray(data) ? data : []))
      .catch(() => setWilayas([]));
  }, []);

  useEffect(() => {
    if (!formData.wilaya) {
      setRegions([]);
      return;
    }

    fetch(`${API_BASE_URL}/api/choices/regions/?wilaya_id=${formData.wilaya}`)
      .then((res) => res.json())
      .then((data) => setRegions(Array.isArray(data) ? data : []))
      .catch(() => setRegions([]));
  }, [formData.wilaya]);

  const validateField = (name, value) => {
    const v = value?.toString().trim();

    switch (name) {
      case "companyName":
        if (!v) return "Required";
        if (v.length < 2 || v.length > 100) return "Must be 2-100 characters";
        return "";

      case "email":
        if (!v) return "Required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
          return "Invalid email format";
        return "";

      case "phoneNumber":
        if (!v) return "Required";
        if (!/^(00213|\+213|0)(5|6|7)[0-9]{8}$/.test(v))
          return "Invalid Algerian phone number";
        return "";

      case "wilaya":
        return v ? "" : "Required";

      case "region":
        return v ? "" : "Required";

      case "address":
        if (!v) return "Required";
        if (v.length < 10 || v.length > 200) return "Must be 10-200 characters";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const err = validateField(name, value);
      if (err) newErrors[name] = err;
    });

    if (!logoFile) newErrors.logo = "Required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "wilaya" ? { region: "" } : {}),
    }));

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setTouched((prev) => ({ ...prev, logo: true }));
    setErrors((prev) => ({ ...prev, logo: "" }));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setErrors((prev) => ({ ...prev, logo: "Required" }));
  };

  useEffect(() => {
    const validationErrors = validateForm();
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formData, logoFile]);

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
  payload.append("logo", logoFile);

  setSubmitting(true);

  const token = localStorage.getItem("auth_token");

  const res = await fetch(`${API_BASE_URL}/api/admin/partners/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  setSubmitting(false);

  if (!res.ok) {
    console.error(await res.text());
    return;
  }

  navigate("/forms-tables/partner-accounts");
};


  if (loading) return null;

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
            <Input
              label="Company Name *"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            {errors.companyName && (
              <span className="error-text">{errors.companyName}</span>
            )}

            <Input
              label="Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <Input
              label="Phone Number *"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <span className="error-text">{errors.phoneNumber}</span>
            )}
          </Section>

          <Section title="Location">
            <Select
              label="Wilaya *"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
            >
              <option value="">Select wilaya</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
            {errors.wilaya && (
              <span className="error-text">{errors.wilaya}</span>
            )}

            <Select
              label="Region *"
              name="region"
              value={formData.region}
              disabled={!formData.wilaya}
              onChange={handleChange}
            >
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
            {errors.region && (
              <span className="error-text">{errors.region}</span>
            )}

            <Input
              label="Listing Address *"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </Section>

          <Section title="">
            <div className="logo-header">
              <span className="section-title">Company Logo *</span>
              <button
                type="button"
                onClick={() => logoInputRef.current.click()}
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
            {errors.logo && <span className="error-text">{errors.logo}</span>}
          </Section>

          <div className="form-footer">
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || submitting}
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
