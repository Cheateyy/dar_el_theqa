import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
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
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const handleShowInterestClick = () => {
        if (!isAuthenticated) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                },
            });
            return;
        }
        setShowModal(true);
    };

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
                <button className="rent-interestButton" onClick={handleShowInterestClick}>
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
