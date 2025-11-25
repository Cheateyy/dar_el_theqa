import { useState } from "react";
import ShowInterestModal from "../../components/common/showInterestModal/ShowInterestModal";

export default function InfoCards({ propertyType, area, bedrooms, bathrooms }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="rent-listingInfo">
            <div className="rent-infoCard">
                <p>Property Type</p>
                <h2>{propertyType}</h2>
            </div>

            <div className="rent-infoCard">
                <p>Area</p>
                <h2>{area} m²</h2>
            </div>

            <div className="rent-infoCard">
                <p>Bedrooms</p>
                <h2>{bedrooms}</h2>
            </div>

            <div className="rent-infoCard">
                <p>Bathrooms</p>
                <h2>{bathrooms}</h2>
            </div>

            <div className="rent-showInterest">
                <button className="rent-interestButton" onClick={() => setShowModal(true)}>
                    Show Interest →
                </button>
            </div>

            {showModal && (
                <ShowInterestModal
                    onClose={() => setShowModal(false)}
                    onSend={() => {
                        alert("Message sent!");
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
}
