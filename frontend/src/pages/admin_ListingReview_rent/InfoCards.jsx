export default function InfoCards({ propertyType, area, bedrooms, bathrooms }) {
    return (
        <div className="admin-rent-listingInfo">
            <div className="admin-rent-infoCard">
                <p>Property Type</p>
                <h2>{propertyType}</h2>
            </div>

            <div className="admin-rent-infoCard">
                <p>Area</p>
                <h2>{area} m²</h2>
            </div>

            <div className="admin-rent-infoCard">
                <p>Bedrooms</p>
                <h2>{bedrooms}</h2>
            </div>

            <div className="admin-rent-infoCard">
                <p>Bathrooms</p>
                <h2>{bathrooms}</h2>
            </div>

            <div className="admin-sell-showInterest">
                <button className="admin-sell-interestButton">
                    Send Review
                </button>
                <button className="admin-sell-interestButton Reject">
                    Reject Anyway
                </button>
            </div>
        </div>
    );
}
