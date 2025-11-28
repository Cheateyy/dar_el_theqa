// src/pages/AddListingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/addListing.css";
// 🔧 FIX: import local wilaya names and local regions map so dropdowns never disappear
import { wilayas as wilayaNamesLocal, regions as regionsLocal } from "../utils/algeria.js";

import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import TextArea from "../components/common/TextArea.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

// import icons via alias (use @)
import BackIcon from "@/assets/icons/back.svg";

const DRAFT_KEY = "createListingDraft"; // 🔧 ADDED FOR BACKEND: local draft storage key

function AddListingPage() {
  const navigate = useNavigate();

  // Form state (UI) - unchanged UI fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    wilaya: "",
    region: "",
    address: "",
    purpose: "sale",
    price: "",
    paymentUnit: "",
  });

  // 🔧 ADDED FOR BACKEND: server-side choice lists (used only for resolving ids)
  const [wilayasServer, setWilayasServer] = useState([]); // expected {id, name}
  const [regionsServerCache, setRegionsServerCache] = useState({}); // map wilaya_id -> [{id,name},...]

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Load draft if exists (so user can navigate back and forth)
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.stepData && parsed.stepData.step1) {
          setFormData((prev) => ({ ...prev, ...parsed.stepData.step1 }));
        } else if (parsed.stepData) {
          // tolerant: merge whatever step1-like data exists
          setFormData((prev) => ({ ...prev, ...(parsed.stepData.step1 || parsed.stepData) }));
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  // 🔧 ADDED FOR BACKEND: fetch server wilayas so we can resolve name -> id at final submit
  useEffect(() => {
    let mounted = true;
    fetch("/api/choices/wilayas/")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        // expected array of { id, name }
        setWilayasServer(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // no server available yet — keep empty and fallback to local names at submit time
        setWilayasServer([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // helper: find wilaya id by name (using server list)
  const findWilayaIdByName = (name) => {
    if (!name || !wilayasServer.length) return null;
    const found = wilayasServer.find((w) => String(w.name).trim().toLowerCase() === String(name).trim().toLowerCase());
    return found ? found.id : null;
  };

  // 🔧 ADDED FOR BACKEND: fetch regions for a wilaya id and cache them
  const fetchRegionsForWilayaId = (wilayaId) => {
    if (!wilayaId) return;
    if (regionsServerCache[wilayaId]) return; // already cached
    fetch(`/api/choices/regions/?wilayaid=${wilayaId}`)
      .then((r) => r.json())
      .then((data) => {
        setRegionsServerCache((prev) => ({ ...prev, [wilayaId]: Array.isArray(data) ? data : [] }));
      })
      .catch(() => {
        setRegionsServerCache((prev) => ({ ...prev, [wilayaId]: [] }));
      });
  };

  // When user selects a wilaya name (UI uses local names), attempt to fetch server regions for it
  useEffect(() => {
    const wid = findWilayaIdByName(formData.wilaya);
    if (wid) fetchRegionsForWilayaId(wid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.wilaya, wilayasServer]);

  // Validate single field
  const validateField = (name, value) => {
    const trimmed = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "title": {
        if (!trimmed) return "Title is required.";
        if (trimmed.length < 5 || trimmed.length > 100) {
          return "Title must be between 5 and 100 characters.";
        }
        return "";
      }
      case "description": {
        if (!trimmed) return "Description is required.";
        if (trimmed.length < 50 || trimmed.length > 2000) {
          return "Description must be between 50 and 2000 characters.";
        }
        return "";
      }
      case "wilaya":
        return trimmed ? "" : "Please select a wilaya.";
      case "region":
        return trimmed ? "" : "Please select a region.";
      case "address": {
        if (!trimmed) return "Address is required.";
        if (trimmed.length < 10 || trimmed.length > 200) {
          return "Address must be between 10 and 200 characters.";
        }
        return "";
      }
      case "price": {
        if (trimmed === "" || trimmed === null || trimmed === undefined) {
          return "Price is required.";
        }

        const numeric = parseFloat(trimmed);

        if (isNaN(numeric)) {
          return "Price must be a number.";
        }

        if (numeric <= 0) {
          return "Price must be a positive number.";
        }

        return "";
      }

      case "paymentUnit":
        return formData.purpose === "rent" && !trimmed
          ? "Select a payment unit for rent."
          : "";
      default:
        return "";
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "title",
      "description",
      "wilaya",
      "region",
      "address",
      "price",
    ];
    if (formData.purpose === "rent") {
      requiredFields.push("paymentUnit");
    }

    return requiredFields.every(
      (field) => validateField(field, formData[field]) === ""
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data (UI)
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // 🔧 ADDED FOR BACKEND: save step1 draft to localStorage
  const saveDraftStep1 = (data) => {
    const existing = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    const merged = {
      ...existing,
      step: 1,
      stepData: {
        ...(existing.stepData || {}),
        step1: {
          ...(existing.stepData?.step1 || {}),
          ...data,
        },
      },
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      validationErrors[field] = validateField(field, formData[field]);
    });

    setErrors(validationErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((f) => {
      allTouched[f] = true;
    });
    setTouched(allTouched);

    // If no errors, save draft and navigate
    const hasErrors = Object.values(validationErrors).some((err) => err);
    if (!hasErrors) {
      // 🔧 ADDED FOR BACKEND: save the UI values (we map to backend on final submit)
      saveDraftStep1(formData);
      navigate("/forms-tables/add-listing/step-2");
    }
  };

  // 🔧 FIXED: returns local regions for UI (prevent disappearance). If local not found, try server cached regions.
  const getRegionsForSelectedWilaya = () => {
    if (!formData.wilaya) return [];
    // Prefer local JSON regions (keeps UI unchanged)
    if (regionsLocal && regionsLocal[formData.wilaya]) return regionsLocal[formData.wilaya];

    // Fallback: use cached server regions (array of {id,name}) -> map to names
    const wid = findWilayaIdByName(formData.wilaya);
    if (wid && regionsServerCache[wid]) {
      return regionsServerCache[wid].map((r) => r.name);
    }
    return [];
  };

  return (
    <div className="page-wrapper">
      <div className="add-listing-container">
        <button
          className="back-button"
          type="button"
          onClick={() => window.history.back()}
        >
          <img
            src={BackIcon}
            alt="back"
            className="back-icon"
          />
          Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        <form className="add-listing-form" onSubmit={handleSubmit}>
          {/* BASICS */}
          <Section title="Basics">
            <Input
              label="Listing Title *"
              name="title"
              type="text"
              value={formData.title}
              placeholder="Enter property title"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
            {!errors.title && touched.title && (
              <p className="valid-text">valid!</p>
            )}

            <TextArea
              label="Listing Description *"
              name="description"
              placeholder="Describe your property..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && (
              <p className="error-text">{errors.description}</p>
            )}
            {!errors.description && touched.description && (
              <p className="valid-text">valid!</p>
            )}
          </Section>

          {/* LOCATION */}
          <Section title="Location">
            <Select
              label="Wilaya *"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select wilaya</option>
              {/* Keep UI names from local file; backend mapping is done separately */}
              {wilayaNamesLocal.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
            {errors.wilaya && <p className="error-text">{errors.wilaya}</p>}
            {!errors.wilaya && touched.wilaya && (
              <p className="valid-text">valid!</p>
            )}

            <Select
              label="Region *"
              name="region"
              value={formData.region}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!formData.wilaya}
            >
              <option value="">Select region</option>
              {getRegionsForSelectedWilaya().map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
            {errors.region && <p className="error-text">{errors.region}</p>}
            {!errors.region && touched.region && (
              <p className="valid-text">valid!</p>
            )}

            <Input
              label="Listing Address *"
              name="address"
              type="text"
              placeholder="Enter street address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
            {!errors.address && touched.address && (
              <p className="valid-text">valid!</p>
            )}
          </Section>

          {/* PURPOSE & PRICE */}
          <Section title="Purpose and Price">
            <Select
              label="Property For *"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </Select>

            <Input
              label="Price *"
              name="price"
              type="text"
              min={1}
              step="any"
              placeholder="Enter price (DZD)"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
            {!errors.price && touched.price && (
              <p className="valid-text">valid!</p>
            )}

            {formData.purpose === "rent" && (
              <>
                <Select
                  label="Payment Per Unit of Time *"
                  name="paymentUnit"
                  value={formData.paymentUnit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select payment frequency</option>
                  <option value="day">Per day</option>
                  <option value="week">Per week</option>
                  <option value="month">Per month</option>
                  <option value="6months">Per 6 months</option>
                  <option value="year">Per year</option>
                </Select>
                {errors.paymentUnit && (
                  <p className="error-text">{errors.paymentUnit}</p>
                )}
                {!errors.paymentUnit && touched.paymentUnit && (
                  <p className="valid-text">valid!</p>
                )}
              </>
            )}
          </Section>

          <div className="form-footer">
            <Button type="submit" variant="primary" disabled={!isFormValid()}>
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListingPage;
