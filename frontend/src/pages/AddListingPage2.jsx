// src/pages/AddListingPage2.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/addListing2.css";

import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

const MAX_IMAGES = 20;

function AddListingPage2() {
  const navigate = useNavigate();

  // -------- FORM STATES --------
  const [propertyType, setPropertyType] = useState("");
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [images, setImages] = useState([]);

  const fileInputRef = useRef(null);

  // -------- VALIDATION --------
  const [errors, setErrors] = useState({
    propertyType: "",
    area: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
  });

  const isLandType = ["Urban Land", "Agricultural Land"].includes(propertyType);
  const hideRooms = ["Shop", "Office", "Warehouse", "Urban Land", "Agricultural Land"].includes(propertyType);

  const validateField = (name, value) => {
    if (name === "propertyType") {
      return value === "" ? "Property type is required" : "";
    }

    if (name === "area") {
      return value.trim() === ""
        ? "Area is required"
        : isNaN(value)
        ? "Area must be a number"
        : value <= 0
        ? "Area must be greater than 0"
        : "";
    }

    if (["floors", "bedrooms", "bathrooms"].includes(name)) {
      if ((isLandType && name === "floors") || (hideRooms && (name === "bedrooms" || name === "bathrooms"))) {
        return "";
      }

      return value.trim() === ""
        ? "Required"
        : isNaN(value)
        ? "Must be a number"
        : value < 0
        ? "Cannot be negative"
        : "";
    }

    return "";
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(value);

    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const isFormValid =
    !errors.propertyType &&
    !errors.area &&
    !errors.floors &&
    !errors.bedrooms &&
    !errors.bathrooms &&
    propertyType &&
    area !== "";

  // -------- IMAGES --------
  const handleAddImageClick = () => {
    if (images.length < MAX_IMAGES) fileInputRef.current.click();
  };

  const handleDirectFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages([...images, { file, label: "" }]);
    e.target.value = null;
  };

  const handleLabelChange = (idx, label) => {
    const updated = [...images];
    updated[idx].label = label;
    setImages(updated);
  };

  const handleImageChange = (idx, file) => {
    const updated = [...images];
    updated[idx].file = file;
    setImages(updated);
  };

  const removeImageRow = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    navigate("/add-listing/step-2/step-3");
  };

  // ---------- JSX ----------
  return (
    <div className="page-wrapper">
      <div className="add-listing-container">

        <button className="back-button" type="button" onClick={() => navigate(-1)}>
          <img src="../src/assets/icons/back.svg" className="back-icon" alt="back" />
          Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        {/* PROPERTY DETAILS */}
        <Section>
          <h2 className="section-title">Additional Information</h2>

          <div className="property-details-grid">

            {/* FULL ROW — PROPERTY TYPE */}
            <div
              className={`property-type-field property-type-row ${
                errors.propertyType ? "input-error" : propertyType ? "input-valid" : ""
              }`}
            >
              <label htmlFor="propertyType">Property Type *</label>

              <select
                id="propertyType"
                name="propertyType"
                value={propertyType}
                onChange={(e) => handleInputChange(e, setPropertyType)}
              >
                <option value="">Select property type</option>

                <optgroup label="Buy">
                  <option>Apartment</option>
                  <option>House/Villa</option>
                  <option>Urban Land</option>
                  <option>Agricultural Land</option>
                  <option>Shop</option>
                  <option>Office</option>
                  <option>Warehouse</option>
                </optgroup>

                <optgroup label="Rent">
                  <option>Apartment</option>
                  <option>House/Villa</option>
                  <option>Flat</option>
                  <option>Studio/Room</option>
                  <option>Shop</option>
                  <option>Office</option>
                  <option>Warehouse</option>
                </optgroup>
              </select>

              {/* VALID TEXT */}
              {propertyType && !errors.propertyType && (
                <span className="valid-text">Valid!</span>
              )}

              {errors.propertyType && <p className="error-text">{errors.propertyType}</p>}
            </div>

            {/* AREA */}
            <div
              className={`form-field inside-label ${
                errors.area ? "input-error" : area ? "input-valid" : ""
              }`}
            >
              <label htmlFor="area">Area *</label>
              <input
                id="area"
                name="area"
                type="text"
                placeholder="Enter area (m²)"
                value={area}
                onChange={(e) => handleInputChange(e, setArea)}
              />

              {area && !errors.area && <span className="valid-text">Valid!</span>}

              {errors.area && <p className="error-text">{errors.area}</p>}
            </div>

            {/* FLOORS */}
            {!isLandType && (
              <div
                className={`form-field inside-label ${
                  errors.floors ? "input-error" : floors ? "input-valid" : ""
                }`}
              >
                <label htmlFor="floors">Floors</label>
                <input
                  id="floors"
                  name="floors"
                  type="text"
                  placeholder="Number of floors"
                  value={floors}
                  onChange={(e) => handleInputChange(e, setFloors)}
                />

                {floors && !errors.floors && (
                  <span className="valid-text">Valid!</span>
                )}

                {errors.floors && <p className="error-text">{errors.floors}</p>}
              </div>
            )}

            {/* BEDROOMS */}
            {!hideRooms && (
              <div
                className={`form-field inside-label ${
                  errors.bedrooms ? "input-error" : bedrooms ? "input-valid" : ""
                }`}
              >
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="text"
                  placeholder="Number of bedrooms"
                  value={bedrooms}
                  onChange={(e) => handleInputChange(e, setBedrooms)}
                />

                {bedrooms && !errors.bedrooms && (
                  <span className="valid-text">Valid!</span>
                )}

                {errors.bedrooms && <p className="error-text">{errors.bedrooms}</p>}
              </div>
            )}

            {/* BATHROOMS */}
            {!hideRooms && (
              <div
                className={`form-field inside-label ${
                  errors.bathrooms ? "input-error" : bathrooms ? "input-valid" : ""
                }`}
              >
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="text"
                  placeholder="Number of bathrooms"
                  value={bathrooms}
                  onChange={(e) => handleInputChange(e, setBathrooms)}
                />

                {bathrooms && !errors.bathrooms && (
                  <span className="valid-text">Valid!</span>
                )}

                {errors.bathrooms && <p className="error-text">{errors.bathrooms}</p>}
              </div>
            )}
          </div>
        </Section>

        {/* IMAGES SECTION */}
        <Section>
          <div className="images-header-row">
            <div>
              <h2 className="section-title">Images and Labels</h2>
              <p className="small-hint">Add up to 20 images, labeled optionally</p>
            </div>

            <button
              type="button"
              className="add-image-btn"
              onClick={handleAddImageClick}
              disabled={images.length >= MAX_IMAGES}
            >
              <img src="../src/assets/icons/Addimage.svg" alt="add" />
            </button>
          </div>

          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            ref={fileInputRef}
            onChange={handleDirectFileSelect}
            style={{ display: "none" }}
          />

          <div className="images-section">
            {images.map((img, idx) => (
              <div key={idx} className="image-row">
                <Input
                  label="Label"
                  value={img.label}
                  placeholder="Label"
                  onChange={(e) => handleLabelChange(idx, e.target.value)}
                />

                <div className="image-card">
                  <div className="img-actions-row">
                    {img.file && (
                      <span className="image-filename">
                        <img
                          src="../src/assets/icons/imageicon.svg"
                          className="small-image-icon"
                          alt="file"
                        />
                        {img.file.name}
                      </span>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="img-upload"
                      onChange={(e) => handleImageChange(idx, e.target.files[0])}
                      style={{ display: img.file ? "none" : "block" }}
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImageRow(idx)}
                    >
                      <img src="../src/assets/icons/removeimage.png" alt="Remove" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* FOOTER */}
        <div className="form-footer">
          <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddListingPage2;
