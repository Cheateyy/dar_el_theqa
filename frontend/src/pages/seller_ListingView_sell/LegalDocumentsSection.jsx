export default function LegalDocumentsSection({ documents }) {
  return (
    <div className="seller-rent-legal-documents">
      <h3>Legal Documents</h3>
      <ul>
        {documents.map((doc, index) => (
          <li key={index} className="seller-rent-legal-doc-item">
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <img 
                src={doc.icon} 
                alt="document icon" 
                style={{ width: "48px", height:"48px", marginRight: "8px" }} 
              />
              {doc.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
