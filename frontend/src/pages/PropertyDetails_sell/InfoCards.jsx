import { useState } from "react";
import ShowInterestModal from "../../components/common/showInterestModal/ShowInterestModal";

export default function InfoCards({
    propertyType,
    area,
    bedrooms,
    bathrooms,
    onShowInterest,
    isSendingInterest = false,
}) {
    const [showModal, setShowModal] = useState(false);

    const handleSendInterest = async (message) => {
        if (!onShowInterest) {
            return;
        }
        try {
            await onShowInterest(message);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to send interest", error);
        }
    };

    return (
        <div className="sell-listingInfoCards">
            <div className="sell-infoCard">
                <p>Property Type</p>
                <h2>{propertyType}</h2>
            </div>

            <div className="sell-infoCard">
                <p>Area</p>
                <h2>{area} m²</h2>
            </div>

            <div className="sell-infoCard">
                <p>Bedrooms</p>
                <h2>{bedrooms}</h2>
            </div>

            <div className="sell-infoCard">
                <p>Bathrooms</p>
                <h2>{bathrooms}</h2>
            </div>

            <div className="sell-showInterest">
                <button className="sell-interestButton" onClick={() => setShowModal(true)}>
                    Show Interest →
                </button>
            </div>

            {showModal && (
                <ShowInterestModal
                    onClose={() => setShowModal(false)}
                    onSend={handleSendInterest}
                    isSending={isSendingInterest}
                />
            )}
        </div>
    );
}
