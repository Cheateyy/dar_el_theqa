import "./Listing.css";
import NavBar from '../../components/common/NavBarv1/NavBar.jsx';
import LeftSection from './LeftSectionListing.jsx';
import RightSection from './RightSectionListing.jsx';
import { useState } from "react";
import legalDocIcon from '../../assets/images/legal_doc.png';

export default function Listing() {
    const [images, setImages] = useState([]);
    const [descriptionData, setDescriptionData] = useState({ title: '', description: '' });
    const [documents, setDocuments] = useState([
        { name: "Document.pdf", url: "", icon: legalDocIcon },
        { name: "Document.pdf", url: "", icon: legalDocIcon },
        { name: "Document.pdf", url: "", icon: legalDocIcon },
        { name: "Document.pdf", url: "", icon: legalDocIcon },
        { name: "Document.pdf", url: "", icon: legalDocIcon },
    ]);

    const handleAddDocument = () => {
        setDocuments([...documents, { name: "NewDocument.pdf", url: "", icon: legalDocIcon }]);
    };

    return (
        <>
            <nav>
                <NavBar />
            </nav>
            <div className="seller-update-Listing">
                <LeftSection 
                    images={images} 
                    setImages={setImages} 
                    descriptionData={descriptionData} 
                    documents={documents} 
                    onAddDocument={handleAddDocument} 
                />
                <RightSection />
            </div>
        </>
    );
}
