import acceptImg from "../../assets/images/accept.png";
import rejectImg from "../../assets/images/reject.png";

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
                style={{ width: "48px",height:"48", marginRight: "8px" }} 
              />
              {doc.name}
            </a>
             <div className="acceptRejectDoc">
              <button><img src={acceptImg} alt="accept" /></button>
              <button><img src={rejectImg} alt="reject" /></button>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
