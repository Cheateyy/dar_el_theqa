// src/pages/AddListingPage3.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "../assets/styles/addListing3.css";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";

import BackIcon from "@/assets/icons/back.svg";
import DocumentIcon from "@/assets/icons/document.svg";
import removeIcon from "../assets/icons/removeimage.png";

const DRAFT_KEY = "createListingDraft";

const loadStepData = () => {
  const raw = localStorage.getItem(DRAFT_KEY);
  let step1 = {};
  let step2 = {};

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      step1 = parsed.stepData?.step1 || {};
      step2 = parsed.stepData?.step2 || {};
    } catch (e) {}
  }

  const images = Array.isArray(window.__CREATE_LISTING_IMAGES)
    ? window.__CREATE_LISTING_IMAGES
    : [];

  return { step1, step2, images };
};

function AddListingPage3() {
  const navigate = useNavigate();
const { isAuthenticated, loading } = useAuth();
    
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate("/login");
      }
    }, [loading, isAuthenticated, navigate]);

  const { step1, step2, images } = loadStepData();
  const ownershipInputRef = useRef(null);

  // Each document structure: { file: File | null, notes: "" }
  const [identity, setIdentity] = useState({ file: null, notes: "" });
  const [certificate, setCertificate] = useState({ file: null, notes: "" });
  const [assurance, setAssurance] = useState({ file: null, notes: "" });

  // Ownership: up to 5 files + notes
  const [ownershipFiles, setOwnershipFiles] = useState([]);
  const [ownershipNotes, setOwnershipNotes] = useState("");

  const [errors, setErrors] = useState({
    identity: false,
    certificate: false,
    assurance: false,
    ownership: false,
  });

  // -------------------------------
  // Validation Rule:
  // Valid if: file exists OR notes entered
  // -------------------------------
  const validateDocuments = () => {
    const newErrors = {
      identity: !identity.file && identity.notes.trim().length === 0,
      certificate: !certificate.file && certificate.notes.trim().length === 0,
      assurance: !assurance.file && assurance.notes.trim().length === 0,
      ownership:
        ownershipFiles.length === 0 &&
        ownershipNotes.trim().length === 0,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e === true);
  };

  // -------------------------------
  // Ownership file upload handler (max 5)
  // -------------------------------
  const handleAddOwnership = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (ownershipFiles.length >= 5) {
      alert("You can upload up to 5 ownership documents.");
      return;
    }

    setOwnershipFiles((prev) => [...prev, file]);
  };

  const removeOwnershipFile = (idx) => {
    setOwnershipFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // -------------------------------
  // Handle Identity / Certificate / Assurance Upload
  // -------------------------------
  const handleSingleUpload = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) setter((prev) => ({ ...prev, file }));
  };

  // -------------------------------
  // Submit Form
  // -------------------------------
  console.log("STEP1:", step1);
  console.log("STEP2:", step2);
  console.log("IMAGES:", images);
  console.log("auth_token:", localStorage.getItem("auth_token"));
console.log("refresh_token:", localStorage.getItem("refresh_token"));
console.log("auth_user:", localStorage.getItem("auth_user"));

 


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateDocuments()) {
    alert("Please upload all required documents OR provide notes.");
    return;
  }

  try {
    const accessToken = localStorage.getItem("auth_token");
    const payload = new FormData();

    /* ---------------- STEP 1 ---------------- */
    payload.append("title", step1.title);
    payload.append("description", step1.description);
    payload.append("price", Number(step1.price));

    payload.append(
      "transaction_type",
      step1.purpose === "sale" ? "BUY" : "RENT"
    );

    if (step1.purpose === "rent") {
      payload.append("rent_unit", step1.paymentUnit);
    }

    payload.append("address", step1.address);
    payload.append("wilaya", step1.wilaya);
    payload.append("region", step1.region);

    /* ---------------- STEP 2 ---------------- */
    payload.append("property_type", step2.propertyTypeBackend);
    payload.append("area", Number(step2.area));
    payload.append("floors", Number(step2.floors || 0));
    payload.append("bedrooms", Number(step2.bedrooms || 0));
    payload.append("bathrooms", Number(step2.bathrooms || 0));

    /* ---------------- IMAGES ---------------- */
    const labelsObject = {};
    images.forEach((img, index) => {
      if (img.file) {
        payload.append("images", img.file);
        labelsObject[index] = img.label || "";
      }
    });
    payload.append("image_labels", JSON.stringify(labelsObject));

    /* ---------------- DOCUMENTS (IMPORTANT) ---------------- */
    if (identity.file) {
      payload.append("doc_identity", identity.file);
    }

    if (assurance.file) {
      payload.append("doc_assurance", assurance.file);
    }

    if (certificate.file) {
      payload.append("doc_register", certificate.file);
    }

    ownershipFiles.forEach((file, index) => {
      if (index === 0) payload.append("doc_ownership_1", file);
      if (index === 1) payload.append("doc_ownership_2", file);
    });

    /* ---------------- SEND ---------------- */
    const response = await fetch(
      "http://127.0.0.1:8000/api/listings/create/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Create listing failed:", err);
      alert("Failed to submit listing.");
      return;
    }

    localStorage.removeItem("createListingDraft");
    window.__CREATE_LISTING_IMAGES = undefined;

    navigate("/forms-tables/add-listing/confirmation");
  } catch (error) {
    console.error("Error submitting listing:", error);
    alert("Error submitting listing.");
  }
};

  // -------------------------------
  // RENDER
  // -------------------------------
   if (loading) return null;
  return (
    <div className="page-wrapper">
      <div className="add-listing-container">
        <button className="back-button" type="button" onClick={() => navigate(-1)}>
          <img src={BackIcon} className="back-icon" alt="Back" />
          Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        <Section>
          <h2 className="section-title">Legal Documents</h2>
          <p className="small-hint">Upload required documents or provide a note explaining missing ones.</p>

          <form onSubmit={handleSubmit}>

            {/* ---------------- Identity ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">Identity Document</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={(e) => handleSingleUpload(e, setIdentity)}
                  id="identity-file"
                />
                <button
                  type="button"
                  className="add-document-btn"
                  onClick={() => document.getElementById("identity-file").click()}
                  disabled={!!identity.file}
                >
                  +
                </button>
              </div>

              {errors.identity && (
                <p className="error-text">Upload a file or provide notes.</p>
              )}

              {identity.file && (
                <div className="document-card">
                  <div className="document-file-row">
                    <span className="document-filename">
                      <img src={DocumentIcon} className="small-pdf-icon" />
                      {identity.file.name}
                    </span>
                    <button
                      type="button"
                      className="remove-document-btn"
                      onClick={() => setIdentity({ ...identity, file: null })}
                    >
                      <img src={removeIcon} className="remove-icon" />
                    </button>
                  </div>
                </div>
              )}

              <label className="notes-label">notes</label>
              <textarea
                className="notes-input"
                value={identity.notes}
                onChange={(e) => setIdentity({ ...identity, notes: e.target.value })}
                placeholder="Write explanation if no document provided..."
              />
            </div>

            {/* ---------------- Ownership ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">
                  Property Ownership Contract (up to 5 pages)
                </h3>
                <input
                  type="file"
                  ref={ownershipInputRef}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={handleAddOwnership}
                />
                <button
                  type="button"
                  className="add-document-btn"
                  onClick={() => ownershipInputRef.current.click()}
                  disabled={ownershipFiles.length >= 5}
                >
                  +
                </button>
              </div>

              {errors.ownership && (
                <p className="error-text">
                  Upload at least one file OR provide notes.
                </p>
              )}

              {ownershipFiles.map((file, idx) => (
                <div key={idx} className="document-card">
                  <div className="document-file-row">
                    <span className="document-filename">
                      <img src={DocumentIcon} className="small-pdf-icon" />
                      {file.name}
                    </span>
                    <button
                      type="button"
                      className="remove-document-btn"
                      onClick={() => removeOwnershipFile(idx)}
                    >
                      <img src={removeIcon} className="remove-icon" />
                    </button>
                  </div>
                </div>
              ))}

              <label className="notes-label">notes</label>
              <textarea
                className="notes-input"
                value={ownershipNotes}
                onChange={(e) => setOwnershipNotes(e.target.value)}
                placeholder="Write explanation if no ownership document provided..."
              />
            </div>

            {/* ---------------- Certificate ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">Certificate of Non-Existence</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="certificate-file"
                  style={{ display: "none" }}
                  onChange={(e) => handleSingleUpload(e, setCertificate)}
                />
                <button
                  className="add-document-btn"
                  type="button"
                  onClick={() => document.getElementById("certificate-file").click()}
                  disabled={!!certificate.file}
                >
                  +
                </button>
              </div>

              {errors.certificate && (
                <p className="error-text">Upload a file OR provide notes.</p>
              )}

              {certificate.file && (
                <div className="document-card">
                  <div className="document-file-row">
                    <span className="document-filename">
                      <img src={DocumentIcon} className="small-pdf-icon" />
                      {certificate.file.name}
                    </span>
                    <button
                      className="remove-document-btn"
                      type="button"
                      onClick={() => setCertificate({ ...certificate, file: null })}
                    >
                      <img src={removeIcon} className="remove-icon" />
                    </button>
                  </div>
                </div>
              )}

              <label className="notes-label">notes</label>
              <textarea
                className="notes-input"
                value={certificate.notes}
                onChange={(e) => setCertificate({ ...certificate, notes: e.target.value })}
                placeholder="Explain if the document is missing..."
              />
            </div>

            {/* ---------------- Assurance ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">Assurance Policy</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="assurance-file"
                  style={{ display: "none" }}
                  onChange={(e) => handleSingleUpload(e, setAssurance)}
                />
                <button
                  className="add-document-btn"
                  type="button"
                  onClick={() => document.getElementById("assurance-file").click()}
                  disabled={!!assurance.file}
                >
                  +
                </button>
              </div>

              {errors.assurance && (
                <p className="error-text">Upload a file OR provide notes.</p>
              )}

              {assurance.file && (
                <div className="document-card">
                  <div className="document-file-row">
                    <span className="document-filename">
                      <img src={DocumentIcon} className="small-pdf-icon" />
                      {assurance.file.name}
                    </span>
                    <button
                      className="remove-document-btn"
                      type="button"
                      onClick={() => setAssurance({ ...assurance, file: null })}
                    >
                      <img src={removeIcon} className="remove-icon" />
                    </button>
                  </div>
                </div>
              )}

              <label className="notes-label">notes</label>
              <textarea
                className="notes-input"
                value={assurance.notes}
                onChange={(e) => setAssurance({ ...assurance, notes: e.target.value })}
                placeholder="Explain if the document is missing..."
              />
            </div>

            {/* ---------------- Submit ---------------- */}
            <div className="form-footer">
              <Button type="submit" variant="primary" icon="approval">
                Send For Approval
              </Button>
            </div>
          </form>
        </Section>
      </div>
    </div>
  );
}

export default AddListingPage3;
