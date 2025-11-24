import { useState } from "react";

export default function InfoCards({ propertyType, area, bedrooms, bathrooms }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="admin-sell-listingInfo">
            <div className="admin-sell-infoCard">
                <p>Property Type</p>
                <h2>{propertyType}</h2>
            </div>

            <div className="admin-sell-infoCard">
                <p>Area</p>
                <h2>{area} m²</h2>
            </div>

            <div className="admin-sell-infoCard">
                <p>Bedrooms</p>
                <h2>{bedrooms}</h2>
            </div>

            <div className="admin-sell-infoCard">
                <p>Bathrooms</p>
                <h2>{bathrooms}</h2>
            </div>

            <div className="admin-sell-showInterest">
                <button className="admin-sell-interestButton" onClick={() => setShowModal(true)}>Send Review</button>
                <button className="admin-sell-interestButton Reject" onClick={() => setShowModal(true)}>Reject Anyway</button>
            </div>
        </div>
    );
}
