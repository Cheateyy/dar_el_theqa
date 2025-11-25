import { useState } from "react";
import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "./LoginModal.jsx";
import img1 from "../../assets/images/dummyPropertyImages/image1.jpg";
import img2 from "../../assets/images/dummyPropertyImages/image2.jpg";
import img3 from "../../assets/images/dummyPropertyImages/image3.jpg";
import img4 from "../../assets/images/dummyPropertyImages/image4.jpg";
import img5 from "../../assets/images/dummyPropertyImages/image5.jpg";
import img6 from "../../assets/images/dummyPropertyImages/image6.jpg";
import img7 from "../../assets/images/dummyPropertyImages/image7.png";
import certifiedIcon from "../../assets/icons/certified_button.png";
import legalDocIcon from '../../assets/images/legal_doc.png';
import "./ListingDetails.css";

export default function ListingDetails_sell() {
    const [showLogin, setShowLogin] = useState(false);
    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

    const property = {
        type: "Apartment",
        area: "120 m²",
        bedrooms: 3,
        bathrooms: 2,
        price: "500,000",
        address: "21 street Down town, next to the hospital",
        region: "Region, Wilaya",
        description: "Beautiful apartment in downtown with modern amenities.",
        images: [img1, img2, img3, img4, img5, img6, img7],
        documents: [
            { name: "Document.pdf", url: "#", icon: legalDocIcon },
            { name: "Document.pdf", url: "#", icon: legalDocIcon },
            { name: "Document.pdf", url: "#", icon: legalDocIcon },
        ]
    };

    return (
        <>
            <nav>
                <NavBar onLoginClick={handleLoginClick} />
            </nav>
            <div className="seller-sell-ListingDetails">
                <LeftSection
                    certifiedIcon={certifiedIcon}
                    images={property.images}
                    description={property.description}
                    documents={property.documents}
                />
                <RightSection property={property} />
            </div>
            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
