import dangerCircle from '../../assets/images/danger_circle.png';
import addIcon from '../../assets/images/add_icon.png';

export default function LegalDocumentsSection({ documents = [], onAddDocument }) {
  return (
    <div className="seller-update-listing-legal-documents">
      <div className="seller-update-upperLegalDoc">
        <h3>Legal Documents</h3>
        <button className='seller-update-addDocument' onClick={onAddDocument}>
          <img src={addIcon} alt="" />
        </button>
      </div>
      <ul>
        {documents.map((doc, index) => (
          <li key={index} className="seller-update-listing-legal-doc-item">
            <div className="seller-update-docHeader">
            <h2>Document Name 
            </h2>
              <button className='seller-update-infoBtn'><img src={dangerCircle} alt="" /></button>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <img src={doc.icon} alt="document icon" style={{ width: "48px", height:"48px", marginRight:"8px" }} />
              {doc.name}
            </a>
            <p>Notes about the document :</p>
            <input
              type="text"
              className="seller-update-listing-doc-note-input"
              placeholder="Add notes about this document..."
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
