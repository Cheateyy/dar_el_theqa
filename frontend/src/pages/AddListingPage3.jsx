import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/addListing3.css";
import Button from "../components/common/Button.jsx";
import Section from "../components/common/Section.jsx";
import removeIcon from "../assets/icons/removeimage.png";
import "../../src/components/common/Input.jsx";

const DOCUMENT_TYPES = [
  {
    key: "doc1",
    label: "Ownership Document",
    tooltip:
      "Upload proof of property ownership (e.g., title deed). Contact your local land registry if you do not have this document yet.",
  },
  {
    key: "doc2",
    label: "Energy Performance Certificate",
    tooltip:
      "Upload the latest energy performance certificate. You can request it from an authorized energy assessor.",
  },
  {
    key: "doc3",
    label: "Compliance / Safety Certificate",
    tooltip:
      "Upload relevant safety or compliance certificates as required by your local regulations.",
  },
];

function AddListingPage3() {
  const navigate = useNavigate();
  const fileInputRefs = useRef({});

  const [documents, setDocuments] = useState(
    DOCUMENT_TYPES.map(() => ({
      file: null,
      // Notes are optional; start empty
      notes: "",
    }))
  );

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
    // No required validation; just cap length via maxLength on the textarea
    setDocuments((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, notes } : doc))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: submit data to backend / context, then navigate as needed
    // navigate("/add-listing/confirmation");
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
            Add all the documents you are asked for for maximum reachability.
            <br />
            The documents will be validated by an admin.
          </p>

          <form onSubmit={handleSubmit}>
            {DOCUMENT_TYPES.map((docType, idx) => (
              <div key={docType.key} className="document-row">
                {/* Title and + button */}
                <div className="document-head">
                  <span className="document-title">
                    {docType.label}
                    <span
                      className="info-icon"
                      title={docType.tooltip}
                    >
                      ⓘ
                    </span>
                  </span>

                  <input
                    type="file"
                    // Accept PDF, JPG, PNG
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    ref={(el) => (fileInputRefs.current[idx] = el)}
                    onChange={(e) => handleFileAdded(idx, e.target.files[0])}
                  />

                  <button
                    type="button"
                    className={`add-document-btn ${
                      documents[idx].file ? "added" : ""
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
                          alt="file type"
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

                {/* Notes field (always visible, optional, max 500 chars) */}
                <label htmlFor={`notes-${idx}`} className="notes-label">
                  Notes about the document
                </label>

                <textarea
                  id={`notes-${idx}`}
                  className="notes-input"
                  value={documents[idx].notes}
                  placeholder="Add notes or explain why document is not provided..."
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
