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

  const handleAccept = (docId, fallbackNote = "") => {
    const reason = (Object.prototype.hasOwnProperty.call(notes, docId)
      ? notes[docId]
      : fallbackNote || "").trim();
    onAccept?.(docId, reason);
  };

  return (
    <div id="admin-legal-documents" className="admin-rent-legal-documents">
      <h3>Legal Documents</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.docId} className="admin-rent-legal-doc-item">
            <div className="admin-rent-docHeader">
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
              <button
                type="button"
                onClick={() => handleAccept(doc.docId, doc.reviewComment)}
              >
                <img src={acceptImg} alt="accept" />
              </button>
              <button type="button" onClick={() => handleReject(doc.docId)}>
                <img src={rejectImg} alt="reject" />
              </button>
              <input
                placeholder="Reviewer notes"
                type="text"
                value={
                  Object.prototype.hasOwnProperty.call(notes, doc.docId)
                    ? notes[doc.docId]
                    : (doc.reviewComment || "")
                }
                onChange={(e) => handleNoteChange(doc.docId, e.target.value)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
