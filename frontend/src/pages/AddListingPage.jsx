import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/addListing.css";
import { wilayas, regions } from "../utils/algeria.js";

import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import TextArea from "../components/common/TextArea.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

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
    paymentUnit: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation: validate as user types
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));

    // Mark as touched so success messages can show
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
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

    // If no errors, navigate
    const hasErrors = Object.values(validationErrors).some((err) => err);
    if (!hasErrors) {
      navigate("/add-listing/step-2");
    }
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
            src="../src/assets/icons/back.svg"
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
              <p class="valid-text">valid!</p>
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
              <p class="valid-text">valid!</p>
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
              {wilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
            {errors.wilaya && <p className="error-text">{errors.wilaya}</p>}
            {!errors.wilaya && touched.wilaya && (
              <p class="valid-text">valid!</p>
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
              {formData.wilaya &&
                regions[formData.wilaya]?.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </Select>
            {errors.region && <p className="error-text">{errors.region}</p>}
            {!errors.region && touched.region && (
              <p class="valid-text">valid!</p>
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
              <p class="valid-text">valid!</p>
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
              <p class="valid-text">valid!</p>
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
                  <p class="valid-text">valid!</p>
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
