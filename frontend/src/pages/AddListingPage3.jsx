// src/pages/AddListingPage3.jsx
import { API_BASE_URL } from "/src/config/env.js";
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
  let partner_id = null;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      step1 = parsed.stepData?.step1 || {};
      step2 = parsed.stepData?.step2 || {};
      partner_id = parsed.partner_id || null; // ✅ SAFE HERE
    } catch {
      // ignore parsing errors
    }
  }

  const images = Array.isArray(window.__CREATE_LISTING_IMAGES)
    ? window.__CREATE_LISTING_IMAGES
    : [];

  return { step1, step2, images, partner_id };
};


function AddListingPage3() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const { step1, step2, images, partner_id } = loadStepData();
  const ownershipInputRef = useRef(null);

  const [identity, setIdentity] = useState({ file: null, notes: "" });
  const [register, setRegister] = useState({ file: null, notes: "" });
  const [assurance, setAssurance] = useState({ file: null, notes: "" });
  const [ownershipFiles, setOwnershipFiles] = useState([]);
  const [ownershipNotes, setOwnershipNotes] = useState("");
  const [silbiya, setSilbiya] = useState({ file: null, notes: "" });

  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState({
    identity: false,
    register: false,
    assurance: false,
    ownership: false,
    silbiya: false,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const validateDocuments = () => {
    const newErrors = {
      identity: !identity.file && !identity.notes.trim(),
      register: !register.file && !register.notes.trim(),
      assurance: !assurance.file && !assurance.notes.trim(),
      ownership: ownershipFiles.length === 0 && !ownershipNotes.trim(),
      silbiya: !silbiya.file && !silbiya.notes.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleAddOwnership = (e) => {
    const file = e.target.files?.[0];
    if (!file || ownershipFiles.length >= 2) return;
    setOwnershipFiles((prev) => [...prev, file]);
  };

  const removeOwnershipFile = (idx) => {
    setOwnershipFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSingleUpload = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) setter((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDocuments()) return;

    try {
      console.log("IDENTITY NOTES:", identity.notes);
      console.log("REGISTER NOTES:", register.notes);
      console.log("ASSURANCE NOTES:", assurance.notes);
      console.log("OWNERSHIP NOTES:", ownershipNotes);

      const payload = new FormData();
      const token = localStorage.getItem("auth_token");

      payload.append("title", step1.title);
      payload.append("description", step1.description);
      payload.append("price", Number(step1.price));
      payload.append(
        "transaction_type",
        step1.purpose === "sale" ? "BUY" : "RENT"
      );
      if (step1.purpose === "rent")
        payload.append("rent_unit", step1.paymentUnit);
      payload.append("address", step1.address);
      payload.append("wilaya", step1.wilaya);
      payload.append("region", step1.region);
      if (partner_id) {
      payload.append("partner", partner_id);
    }

      payload.append("property_type", step2.propertyTypeBackend);
      payload.append("area", Number(step2.area));
      payload.append("floors", Number(step2.floors || 0));
      payload.append("bedrooms", Number(step2.bedrooms || 0));
      payload.append("bathrooms", Number(step2.bathrooms || 0));
      

      const labels = {};
      images.forEach((img, i) => {
        if (img.file) {
          payload.append("images", img.file);
          labels[i] = img.label || "";
        }
      });
      payload.append("image_labels", JSON.stringify(labels));

      if (identity.file) payload.append("doc_identity", identity.file);
      if (identity.notes.trim())
        payload.append("doc_identity_note", identity.notes.trim());

      if (register.file) payload.append("doc_register", register.file);
      if (register.notes.trim())
        payload.append("doc_register_note", register.notes.trim());

      if (assurance.file) payload.append("doc_assurance", assurance.file);
      if (assurance.notes.trim())
        payload.append("doc_assurance_note", assurance.notes.trim());

      ownershipFiles.forEach((file, i) => {
        payload.append(`doc_ownership_${i + 1}`, file);
      });
      if (ownershipNotes.trim())
        payload.append("doc_ownership_note", ownershipNotes.trim());

      if (silbiya.file) payload.append("doc_silbiya", silbiya.file);
      if (silbiya.notes.trim())
        payload.append("doc_silbiya_note", silbiya.notes.trim());

      const res = await fetch(`${API_BASE_URL}/api/listings/create/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!res.ok) throw new Error("Submission failed");

      localStorage.removeItem(DRAFT_KEY);
      window.__CREATE_LISTING_IMAGES = undefined;
      setShowSuccess(true);
    } catch (err) {
      alert("Error submitting listing");
    }
  
  };

  if (loading) return null;

  return (
    <div className="page-wrapper">
      <div className="add-listing-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={BackIcon} className="back-icon" /> Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        <Section>
          <h2 className="section-title">Legal Documents</h2>

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
                  onClick={() =>
                    document.getElementById("identity-file").click()
                  }
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
                onChange={(e) =>
                  setIdentity({ ...identity, notes: e.target.value })
                }
                placeholder="Write explanation if no document provided..."
              />
            </div>

            {/* ---------------- Ownership ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">
                  Property Ownership Contract (up to 2 pages)
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
                  disabled={ownershipFiles.length >= 2}
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

            {/* ---------------- register ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">Property Registration Document</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="register-file"
                  style={{ display: "none" }}
                  onChange={(e) => handleSingleUpload(e, setRegister)}
                />
                <button
                  className="add-document-btn"
                  type="button"
                  onClick={() =>
                    document.getElementById("register-file").click()
                  }
                  disabled={!!register.file}
                >
                  +
                </button>
              </div>

              {errors.register && (
                <p className="error-text">Upload a file OR provide notes.</p>
              )}

              {register.file && (
                <div className="document-card">
                  <div className="document-file-row">
                    <span className="document-filename">
                      <img src={DocumentIcon} className="small-pdf-icon" />
                      {register.file.name}
                    </span>
                    <button
                      className="remove-document-btn"
                      type="button"
                      onClick={() =>
                        setRegister({ ...register, file: null })
                      }
                    >
                      <img src={removeIcon} className="remove-icon" />
                    </button>
                  </div>
                </div>
              )}

              <label className="notes-label">notes</label>
              <textarea
                className="notes-input"
                value={register.notes}
                onChange={(e) =>
                  setRegister({ ...register, notes: e.target.value })
                }
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
                  onClick={() =>
                    document.getElementById("assurance-file").click()
                  }
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
                onChange={(e) =>
                  setAssurance({ ...assurance, notes: e.target.value })
                }
                placeholder="Explain if the document is missing..."
              />
            </div>
            {/* ---------------- Silbiya ---------------- */}
            <div className="document-row">
              <div className="document-title-row">
                <h3 className="document-title">Silbiya Document</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="silbiya-file"
                  style={{ display: "none" }}
                  onChange={(e) => handleSingleUpload(e, setSilbiya)}
                />
                <button
                  className="add-document-btn"
                  type="button"
                  onClick={() =>
                    document.getElementById("silbiya-file").click()
                  }
                  disabled={!!silbiya.file}
                >
                  +
                </button>
              </div>

              {errors.silbiya && (
                <p className="error-text">Upload a file OR provide notes.</p>
              )}

              {silbiya.file && (
                <div className="document-card">
                  <div className="document-file-row">
                    <span className="document-filename">
                      <img src={DocumentIcon} className="small-pdf-icon" />
                      {silbiya.file.name}
                    </span>
                    <button
                      className="remove-document-btn"
                      type="button"
                      onClick={() => setSilbiya({ ...silbiya, file: null })}
                    >
                      <img src={removeIcon} className="remove-icon" />
                    </button>
                  </div>
                </div>
              )}

              <label className="notes-label">notes</label>
              <textarea
                className="notes-input"
                value={silbiya.notes}
                onChange={(e) =>
                  setSilbiya({ ...silbiya, notes: e.target.value })
                }
                placeholder="Explain if the document is missing..."
              />
            </div>

            {/* ---------------- Submit ---------------- */}
            <div className="form-footer">
              <Button type="submit" variant="primary">
                Send For Approval
              </Button>
            </div>
          </form>
        </Section>
      </div>

      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <h2>✅ Listing Submitted</h2>
            <p>Your listing was sent successfully for approval.</p>

            <button
              className="success-btn primary"
              onClick={() => {
                setShowSuccess(false);
                navigate("/");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddListingPage3;
