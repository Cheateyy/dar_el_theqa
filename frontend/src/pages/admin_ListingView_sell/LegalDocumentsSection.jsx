const STATUS_TONES = {
  ACCEPTED: { label: "Accepted", tone: "success" },
  APPROVED: { label: "Approved", tone: "success" },
  VERIFIED: { label: "Verified", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  PENDING: { label: "Pending", tone: "warning" },
};

const formatStatus = (status = "") => {
  const key = status.toUpperCase();
  return STATUS_TONES[key] || { label: status || "Unknown", tone: "default" };
};

export default function LegalDocumentsSection({ documents = [] }) {
  return (
    <div className="admin-legal-documents">
      <div className="admin-docHeader">
        <h3>Legal Documents</h3>
        <p className="admin-docSyncHint">Latest uploaded package</p>
      </div>
      <ul>
        {documents.length === 0 && (
          <li className="admin-legal-doc-item admin-docEmpty">No documents uploaded yet.</li>
        )}
        {documents.map((doc) => {
          const { label, tone } = formatStatus(doc.status);
          return (
            <li key={doc.docId || doc.name} className="admin-legal-doc-item">
              <div className="admin-docMeta">
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={doc.icon}
                    alt="document icon"
                    className="admin-docIcon"
                  />
                  <span>{doc.name}</span>
                </a>
                <span className={`admin-docStatus admin-statusBadge status-${tone}`}>
                  {label}
                </span>
              </div>
              {doc.reviewComment && (
                <p className="admin-docNote">Reviewer note: {doc.reviewComment}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
