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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
