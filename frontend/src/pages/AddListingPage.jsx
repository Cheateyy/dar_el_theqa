// src/pages/AddListingPage.jsx
import { API_BASE_URL } from "/src/config/env.js";
import { useSearchParams } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/addListing.css";
import { useAuth } from "../contexts/AuthContext";

import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import TextArea from "../components/common/TextArea.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

import BackIcon from "@/assets/icons/back.svg";

const DRAFT_KEY = "createListingDraft";

function AddListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get("partner_id");
  const { isAuthenticated, loading } = useAuth();

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    wilaya: "",   // ✅ stores ID
    region: "",   // ✅ stores ID
    address: "",
    purpose: "sale",
    price: "",
    paymentUnit: "",
  });

  /* Reset region when wilaya changes */
  useEffect(() => {
    setFormData((prev) => ({ ...prev, region: "" }));
  }, [formData.wilaya]);

  const [wilayas, setWilayas] = useState([]);
  const [regionsCache, setRegionsCache] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ================= LOAD DRAFT ================= */
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;

    try {
      const parsed = JSON.parse(draft);
      if (parsed?.stepData?.step1) {
        setFormData((prev) => ({
          ...prev,
          ...parsed.stepData.step1,
        }));
      }
    } catch {}
  }, []);

  /* ================= FETCH WILAYAS ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/choices/wilayas/`)
      .then((res) => res.json())
      .then((data) => {
        setWilayas(Array.isArray(data) ? data : []);
      })
      .catch(() => setWilayas([]));
  }, []);

  /* ================= FETCH REGIONS ================= */
  const fetchRegions = (wilayaId) => {
    if (!wilayaId || regionsCache[wilayaId]) return;

    fetch(`${API_BASE_URL}/api/choices/regions/?wilaya_id=${wilayaId}`)
      .then((res) => res.json())
      .then((data) => {
        setRegionsCache((prev) => ({
          ...prev,
          [wilayaId]: Array.isArray(data) ? data : [],
        }));
      })
      .catch(() => {
        setRegionsCache((prev) => ({ ...prev, [wilayaId]: [] }));
      });
  };

  useEffect(() => {
    if (formData.wilaya) fetchRegions(formData.wilaya);
  }, [formData.wilaya]);

  const getRegionsForSelectedWilaya = () => {
    return regionsCache[formData.wilaya] || [];
  };

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    const v = value?.toString().trim();

    switch (name) {
      case "title":
        if (!v) return "Title is required.";
        if (v.length < 5 || v.length > 100)
          return "Title must be between 5 and 100 characters.";
        return "";

      case "description":
        if (!v) return "Description is required.";
        if (v.length < 50 || v.length > 2000)
          return "Description must be between 50 and 2000 characters.";
        return "";

      case "wilaya":
        return v ? "" : "Please select a wilaya.";

      case "region":
        return v ? "" : "Please select a region.";

      case "address":
        if (!v) return "Address is required.";
        if (v.length < 10 || v.length > 200)
          return "Address must be between 10 and 200 characters.";
        return "";

      case "price":
        if (!v) return "Price is required.";
        if (isNaN(v) || Number(v) <= 0)
          return "Price must be a positive number.";
        return "";

      case "paymentUnit":
        return formData.purpose === "rent" && !v
          ? "Select a payment frequency."
          : "";

      default:
        return "";
    }
  };

  const isFormValid = () => {
    const fields = ["title", "description", "wilaya", "region", "address", "price"];
    if (formData.purpose === "rent") fields.push("paymentUnit");
    return fields.every((f) => !validateField(f, formData[f]));
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const saveDraftStep1 = (data) => {
  const existing = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");

  const nextDraft = {
    ...existing,
    step: 1,
    stepData: {
      ...(existing.stepData || {}),
      step1: data,
    },
  };

  
  if (partnerId) {
    nextDraft.partner_id = partnerId;
  }

  localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    saveDraftStep1(formData);
    navigate("/forms-tables/add-listing/step-2");
  };

  if (loading) return null;

  /* ================= RENDER (UI UNCHANGED) ================= */
  return (
    <div className="page-wrapper">
      <div className="add-listing-container">
        <button className="back-button" onClick={() => window.history.back()}>
          <img src={BackIcon} alt="back" className="back-icon" />
          Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        <form className="add-listing-form" onSubmit={handleSubmit}>
          <Section title="Basics">
            <Input
              label="Listing Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter a title for your listing"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}

            <TextArea
              label="Listing Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Provide a detailed description of the property"
            />
            {errors.description && <p className="error-text">{errors.description}</p>}
          </Section>

          <Section title="Location">
            <Select
              label="Wilaya *"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              onBlur={handleBlur}
              
            >
              <option value="">Select wilaya</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
            {errors.wilaya && <p className="error-text">{errors.wilaya}</p>}

            <Select
              label="Region *"
              name="region"
              value={formData.region}
              disabled={!formData.wilaya}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select region</option>
              {getRegionsForSelectedWilaya().map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
            {errors.region && <p className="error-text">{errors.region}</p>}

            <Input
              label="Listing Address *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter the full address of the property"
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </Section>

          <Section title="Purpose & Price">
            <Select
              label="Property For *"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </Select>

            <Input
              label="Price *"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter the price of the property"
            />
            {errors.price && <p className="error-text">{errors.price}</p>}

            {formData.purpose === "rent" && (
              <Select
                label="Payment per *"
                name="paymentUnit"
                value={formData.paymentUnit}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select frequency</option>
                <option value="DAY">Day</option>
                <option value="WEEK">Week</option>
                <option value="MONTH">Month</option>
                <option value="SIX_MONTHS">6 Months</option>
                <option value="YEAR">Year</option>
              </Select>
            )}
          </Section>

          <div className="form-footer">
            <Button type="submit" disabled={!isFormValid()}>
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListingPage;
