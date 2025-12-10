// src/pages/AddListingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/addListing.css";
import { wilayas as wilayaNamesLocal, regions as regionsLocal } from "../utils/algeria.js";

import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import TextArea from "../components/common/TextArea.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

import BackIcon from "@/assets/icons/back.svg";

const DRAFT_KEY = "createListingDraft";

function AddListingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    wilaya: "",
    region: "",
    address: "",
    purpose: "sale",
    price: "",
    paymentUnit: "", // Will store DAY, WEEK, MONTH, SIX_MONTHS, YEAR
  });

  const [wilayasServer, setWilayasServer] = useState([]);
  const [regionsServerCache, setRegionsServerCache] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.stepData && parsed.stepData.step1) {
          setFormData((prev) => ({ ...prev, ...parsed.stepData.step1 }));
        } else if (parsed.stepData) {
          setFormData((prev) => ({ ...prev, ...(parsed.stepData.step1 || parsed.stepData) }));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/choices/wilayas/")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setWilayasServer(Array.isArray(data) ? data : []);
      })
      .catch(() => setWilayasServer([]));
    return () => {
      mounted = false;
    };
  }, []);

  const findWilayaIdByName = (name) => {
    if (!name || !wilayasServer.length) return null;
    const found = wilayasServer.find(
      (w) => String(w.name).trim().toLowerCase() === String(name).trim().toLowerCase()
    );
    return found ? found.id : null;
  };

  const fetchRegionsForWilayaId = (wilayaId) => {
    if (!wilayaId) return;
    if (regionsServerCache[wilayaId]) return;

    fetch(`/api/choices/regions/?wilayaid=${wilayaId}`)
      .then((r) => r.json())
      .then((data) => {
        setRegionsServerCache((prev) => ({
          ...prev,
          [wilayaId]: Array.isArray(data) ? data : [],
        }));
      })
      .catch(() => {
        setRegionsServerCache((prev) => ({ ...prev, [wilayaId]: [] }));
      });
  };

  useEffect(() => {
    const wid = findWilayaIdByName(formData.wilaya);
    if (wid) fetchRegionsForWilayaId(wid);
  }, [formData.wilaya, wilayasServer]);

  const validateField = (name, value) => {
    const trimmed = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "title":
        if (!trimmed) return "Title is required.";
        if (trimmed.length < 5 || trimmed.length > 100) return "Title must be between 5 and 100 characters.";
        return "";

      case "description":
        if (!trimmed) return "Description is required.";
        if (trimmed.length < 50 || trimmed.length > 2000) return "Description must be between 50 and 2000 characters.";
        return "";

      case "wilaya":
        return trimmed ? "" : "Please select a wilaya.";

      case "region":
        return trimmed ? "" : "Please select a region.";

      case "address":
        if (!trimmed) return "Address is required.";
        if (trimmed.length < 10 || trimmed.length > 200)
          return "Address must be between 10 and 200 characters.";
        return "";

      case "price":
        if (!trimmed) return "Price is required.";
        const numeric = parseFloat(trimmed);
        if (isNaN(numeric)) return "Price must be a number.";
        if (numeric <= 0) return "Price must be a positive number.";
        return "";

      case "paymentUnit":
        return formData.purpose === "rent" && !trimmed ? "Select a payment frequency." : "";

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

    return requiredFields.every((field) => validateField(field, formData[field]) === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

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

    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      validationErrors[field] = validateField(field, formData[field]);
    });
    setErrors(validationErrors);

    const allTouched = {};
    Object.keys(formData).forEach((f) => {
      allTouched[f] = true;
    });
    setTouched(allTouched);

    const hasErrors = Object.values(validationErrors).some((err) => err);
    if (!hasErrors) {
      saveDraftStep1(formData);
      navigate("/forms-tables/add-listing/step-2");
    }
  };

  const getRegionsForSelectedWilaya = () => {
    if (!formData.wilaya) return [];

    if (regionsLocal && regionsLocal[formData.wilaya]) return regionsLocal[formData.wilaya];

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
          <img src={BackIcon} alt="back" className="back-icon" />
          Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        <form className="add-listing-form" onSubmit={handleSubmit}>
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
            {!errors.title && touched.title && <p className="valid-text">valid!</p>}

            <TextArea
              label="Listing Description *"
              name="description"
              placeholder="Describe your property..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && <p className="error-text">{errors.description}</p>}
            {!errors.description && touched.description && <p className="valid-text">valid!</p>}
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
              {wilayaNamesLocal.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
            {errors.wilaya && <p className="error-text">{errors.wilaya}</p>}
            {!errors.wilaya && touched.wilaya && <p className="valid-text">valid!</p>}

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
            {!errors.region && touched.region && <p className="valid-text">valid!</p>}

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
            {!errors.address && touched.address && <p className="valid-text">valid!</p>}
          </Section>

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
            {!errors.price && touched.price && <p className="valid-text">valid!</p>}

            {formData.purpose === "rent" && (
              <>
                <Select
                  label="Payment per *"
                  name="paymentUnit"
                  value={formData.paymentUnit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select frequency</option>
                  <option value="DAY">day</option>
                  <option value="WEEK">week</option>
                  <option value="MONTH">month</option>
                  <option value="SIX_MONTHS">6 months</option>
                  <option value="YEAR">year</option>
                </Select>

                {errors.paymentUnit && <p className="error-text">{errors.paymentUnit}</p>}
                {!errors.paymentUnit && touched.paymentUnit && <p className="valid-text">valid!</p>}
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
