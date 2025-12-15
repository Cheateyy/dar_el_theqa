const statusColors = {
  APPROVED: { bg: "#d1fae5", color: "#065f46" },
  REJECTED: { bg: "#fee2e2", color: "#991b1b" },
  PENDING: { bg: "#fef3c7", color: "#92400e" },
  DEFAULT: { bg: "#e5e7eb", color: "#374151" },
};

const formatStatus = (status) => {
  if (!status) return "Pending";
  const normalized = status.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const resolveStatusStyle = (status) => {
  const key = typeof status === "string" ? status.toUpperCase() : "DEFAULT";
  return statusColors[key] || statusColors.DEFAULT;
};

const renderAdminNote = (note) => {
  if (note && String(note).trim().length > 0) return note;
  return "No admin note provided.";
};

export default function LegalDocumentsSection({ documents }) {
  const safeDocuments = Array.isArray(documents) ? documents : [];

  return (
    <div className="seller-rent-legal-documents">
      <h3>Legal Documents</h3>

      {safeDocuments.length === 0 ? (
        <p>No legal documents available.</p>
      ) : (
        <ul>
          {safeDocuments.map((doc, index) => (
            <li key={index} className="seller-rent-legal-doc-item">
              <a
                href={doc.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.icon && (
                  <img
                    src={doc.icon}
                    alt="document icon"
                    style={{ width: "48px", height: "48px", marginRight: "8px" }}
                  />
                )}
                {doc.name}
              </a>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "6px",
                  flexWrap: "wrap",
                  fontSize: "0.8rem",
                }}
              >
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    backgroundColor: resolveStatusStyle(doc.status).bg,
                    color: resolveStatusStyle(doc.status).color,
                  }}
                >
                  {formatStatus(doc.status)}
                </span>
                <span style={{ color: "#4b5563" }}>
                  {renderAdminNote(doc.adminNote ?? doc.admin_note)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
