export default function InfoCards({
    propertyType,
    area,
    bedrooms,
    bathrooms,
    onApprove,
    onReject,
    isApproving,
    isRejecting,
}) {
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
                <button
                    className="admin-sell-interestButton"
                    type="button"
                    onClick={() => onApprove?.()}
                    disabled={isApproving}
                >
                    {isApproving ? "Sending..." : "Approve Listing"}
                </button>
                <button
                    className="admin-sell-interestButton Reject"
                    type="button"
                    onClick={() => onReject?.()}
                    disabled={isRejecting}
                >
                    {isRejecting ? "Rejecting..." : "Reject Anyways"}
                </button>
            </div>
        </div>
    );
}
