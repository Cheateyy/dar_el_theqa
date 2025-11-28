// src/pages/AddListingPage3.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/addListing3.css";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";
import removeIcon from "../assets/icons/removeimage.png";

// 🔧 ADDED FOR BACKEND – We load the Step 1 + Step 2 data from localStorage
// Step 1 saved as "listing_step1"
// Step 2 saved as "listing_step2"
const DRAFT_KEY = "createListingDraft"; // same as step 1 & 2

// Load Step 1 + Step 2 + images from shared draft + window memory
const loadStepData = () => {
  const raw = localStorage.getItem(DRAFT_KEY);
  let step1 = {};
  let step2 = {};

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      step1 = parsed.stepData?.step1 || {};
      step2 = parsed.stepData?.step2 || {};
    } catch (e) {
      // ignore parse error; keep empty objects
    }
  }

  // Files are kept only in memory between step 2 and 3
  const images = Array.isArray(window.__CREATE_LISTING_IMAGES)
    ? window.__CREATE_LISTING_IMAGES
    : [];

  return { step1, step2, images };
};

// 🔧 REAL BACKEND DOCUMENT TYPES (UI labels unchanged)
const DOCUMENT_TYPES = [
  { label: "Identity Document", key: "docidentity" },
  { label: "Assurance Document", key: "docassurance" },
  { label: "Ownership Document - Page 1", key: "docownership1" },
  { label: "Ownership Document - Page 2", key: "docownership2" },
  { label: "Ownership Document - Page 3", key: "docownership3" },
  { label: "Ownership Document - Page 4", key: "docownership4" },
  { label: "Ownership Document - Page 5", key: "docownership5" },
  { label: "Register Certificate", key: "docregister" },
  { label: "Silbiya Certificate", key: "docsilbiya" },
];

function AddListingPage3() {
  const navigate = useNavigate();
  const { step1, step2, images } = loadStepData();

  const fileInputRefs = useRef({});

  // Each document has: file + notes
  const [documents, setDocuments] = useState(
    DOCUMENT_TYPES.map(() => ({
      file: null,
      notes: "",
    }))
  );

  // Handles selecting a file
  const handleAddFileClick = (idx) => {
    if (fileInputRefs.current[idx]) {
      fileInputRefs.current[idx].value = "";
      fileInputRefs.current[idx].click();
    }
  };

  const handleFileAdded = (idx, file) => {
    if (file) {
      setDocuments((prev) =>
        prev.map((doc, i) => (i === idx ? { ...doc, file } : doc))
      );
    }
  };

  const handleRemoveFile = (idx) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, file: null } : doc))
    );
  };

  const handleNotesChange = (idx, notes) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, notes } : doc))
    );
  };

  // 🔧 ADDED FUNCTION: Convert wilaya/region NAME → ID using backend endpoints
  const fetchWilayaId = async (name) => {
    const res = await fetch("/api/choices/wilayas/");
    const list = await res.json();
    const found = list.find((w) => w.name === name);
    return found ? found.id : null;
  };

  const fetchRegionId = async (wilayaId, regionName) => {
    const res = await fetch(`/api/choices/regions/?wilayaid=${wilayaId}`);
    const list = await res.json();
    const found = list.find((r) => r.name === regionName);
    return found ? found.id : null;
  };

  // 🔧 ADDED: Build final backend payload
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1) Convert wilaya/region names into IDs
      const wilaya_id = await fetchWilayaId(step1.wilaya);
      const region_id = await fetchRegionId(wilaya_id, step1.region);

      // 2) Build FormData payload
      const payload = new FormData();

      // =============== BASIC INFO (STEP 1) ===============
      payload.append("title", step1.title);
      payload.append("description", step1.description);
      payload.append("price", Number(step1.price));
      payload.append(
        "transactiontype",
        step1.purpose === "sale" ? "BUY" : "RENT"
      );
      if (step1.purpose === "rent") {
        payload.append("rentunit", step1.paymentUnit.toUpperCase());
      }

      payload.append("streetaddress", step1.address);
      payload.append("wilayaid", wilaya_id);
      payload.append("regionid", region_id);

      // =============== ADDITIONAL INFO (STEP 2) ===============
      payload.append("propertytype", step2.propertyTypeBackend);
      payload.append("area", Number(step2.area));
      payload.append("floors", Number(step2.floors || 0));
      payload.append("bedrooms", Number(step2.bedrooms || 0));
      payload.append("bathrooms", Number(step2.bathrooms || 0));

      // =============== IMAGES (STEP 2) ===============
      const labelsObject = {};
      images.forEach((img, index) => {
        // Keys File1, File2, ...
        payload.append(`File${index + 1}`, img.file);
        labelsObject[index] = img.label || "";
      });

      // Contract uses "imagelabels" (no underscore)
      payload.append("imagelabels", JSON.stringify(labelsObject));

      DOCUMENT_TYPES.forEach((docType, idx) => {
        if (documents[idx].file) {
          payload.append(docType.key, documents[idx].file); // 🔧 REAL backend key
        }
      });

      const response = await fetch("/api/listings/create", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Create listing failed:", data);
        alert("Failed to submit listing.");
        return;
      }

      // Clear draft and in-memory images
      localStorage.removeItem("createListingDraft");
      window.__CREATE_LISTING_IMAGES = undefined;
      window.__CREATE_LISTING_IMAGES_PROPERTYTYPE = undefined;
      window.__CREATE_LISTING_IMAGES_META = undefined;

      navigate("/forms-tables/add-listing/confirmation");
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert("Error submitting listing.");
    }
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
            src="../../src/assets/icons/back.svg"
            className="back-icon"
            alt="Back"
          />
          Back
        </button>

        <h1 className="page-title">Add a Listing</h1>

        <Section>
          <h2 className="section-title">Legal Documents</h2>
          <p className="small-hint">
            Add all required documents for verification.
            <br />
            They will be validated by an admin.
          </p>

          <form onSubmit={handleSubmit}>
            {DOCUMENT_TYPES.map((docType, idx) => (
              <div key={docType.key} className="document-row">
                <div className="document-head">
                  <span className="document-title">
                    {docType.label}
                    <span className="info-icon" title={docType.tooltip}>
                      ⓘ
                    </span>
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    ref={(el) => (fileInputRefs.current[idx] = el)}
                    onChange={(e) => handleFileAdded(idx, e.target.files[0])}
                  />

                  <button
                    type="button"
                    className={`add-document-btn ${documents[idx].file ? "added" : ""
                      }`}
                    disabled={!!documents[idx].file}
                    onClick={() => handleAddFileClick(idx)}
                  >
                    +
                  </button>
                </div>

                {documents[idx].file && (
                  <div className="document-card">
                    <div className="document-file-row">
                      <span className="document-filename">
                        <img
                          src="../../src/assets/icons/document.svg"
                          className="small-pdf-icon"
                          alt="file"
                        />
                        {documents[idx].file.name}
                      </span>

                      <button
                        type="button"
                        className="remove-document-btn"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <img
                          src={removeIcon}
                          className="remove-icon"
                          alt="Remove file"
                        />
                      </button>
                    </div>
                  </div>
                )}

                <label htmlFor={`notes-${idx}`} className="notes-label">
                  Notes
                </label>

                <textarea
                  id={`notes-${idx}`}
                  className="notes-input"
                  value={documents[idx].notes}
                  placeholder="Add notes or explain why this document is missing..."
                  maxLength={500}
                  onChange={(e) => handleNotesChange(idx, e.target.value)}
                />
              </div>
            ))}

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
