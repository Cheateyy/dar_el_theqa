import { useState } from "react";
import acceptImg from "../../assets/images/accept.png";
import rejectImg from "../../assets/images/reject.png";

const formatStatus = (status) => {
  if (!status) return "Pending";
  const normalized = status.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export default function LegalDocumentsSection({ documents = [], onReject, onAccept }) {
  const [notes, setNotes] = useState({});

  const handleNoteChange = (docId, value) => {
    setNotes((prev) => ({ ...prev, [docId]: value }));
  };

  const handleReject = (docId) => {
    const reason = (notes[docId] || "").trim();
    if (!reason) {
      alert("Please provide reviewer notes before rejecting the document.");
      return;
    }
    onReject?.(docId, reason);
  };

  const handleAccept = (docId) => {
    onAccept?.(docId);
  };

  return (
    <div id="admin-legal-documents" className="admin-sell-legal-documents">
      <h3>Legal Documents</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.docId} className="admin-sell-legal-doc-item">
            <div className="admin-sell-docHeader">
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={doc.icon}
                  alt="document icon"
                  style={{ width: "48px", height: "48px", marginRight: "8px" }}
                />
                {doc.name}
              </a>
              <span className={`admin-doc-status ${doc.status?.toLowerCase() || "pending"}`}>
                {formatStatus(doc.status)}
              </span>
            </div>
            <div className="acceptRejectDoc">
              <button type="button" onClick={() => handleAccept(doc.docId)}>
                <img src={acceptImg} alt="accept" />
              </button>
              <button type="button" onClick={() => handleReject(doc.docId)}>
                <img src={rejectImg} alt="reject" />
              </button>
              <input
                placeholder="Reviewer notes"
                type="text"
                value={notes[doc.docId] || ""}
                onChange={(e) => handleNoteChange(doc.docId, e.target.value)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
