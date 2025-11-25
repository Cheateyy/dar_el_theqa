import { useState } from "react";
import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";

import img1 from "../../assets/images/dummyPropertyImages/image1.jpg";
import img2 from "../../assets/images/dummyPropertyImages/image2.jpg";
import img3 from "../../assets/images/dummyPropertyImages/image3.jpg";
import img4 from "../../assets/images/dummyPropertyImages/image4.jpg";
import img5 from "../../assets/images/dummyPropertyImages/image5.jpg";
import img6 from "../../assets/images/dummyPropertyImages/image6.jpg";
import certifiedIcon from "../../assets/icons/certified_button.png";

import "./ListingDetails.css";

export default function ListingDetails_rent() {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

    // 🟦 Static variables (replace with backend later)
    const listing = {
        images: [img1, img2, img3, img4, img5, img6],
        certifiedIcon: certifiedIcon,
        address: "21 street Down town, next to the hospital .",
        region: "Region, Wilaya",
        price: 40000,
        status: "Inactive",
        propertyType: "Apartment",
        area: 120,
        bedrooms: 3,
        bathrooms: 2,
        documents: [
            { name: "Document.pdf", url: "", icon: certifiedIcon },
            { name: "Document.pdf", url: "", icon: certifiedIcon },
            { name: "Document.pdf", url: "", icon: certifiedIcon },
        ],
    };

    return (
        <>
            <nav>
                <NavBar onLoginClick={handleLoginClick} />
            </nav>
            <div className="seller-rent-ListingDetails">
                <LeftSection
                    images={listing.images}
                    certifiedIcon={listing.certifiedIcon}
                    documents={listing.documents}
                />
                <RightSection
                    address={listing.address}
                    region={listing.region}
                    price={listing.price}
                    status={listing.status}
                    propertyType={listing.propertyType}
                    area={listing.area}
                    bedrooms={listing.bedrooms}
                    bathrooms={listing.bathrooms}
                />
            </div>
            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
