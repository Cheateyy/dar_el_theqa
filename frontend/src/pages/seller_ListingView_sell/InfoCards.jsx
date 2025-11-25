export default function InfoCards({ propertyType, area, bedrooms, bathrooms }) {
    return (
        <div className="seller-sell-listingInfo">
            <div className="seller-sell-infoCard">
                <p>Property Type</p>
                <h2>{propertyType}</h2>
            </div>

            <div className="seller-sell-infoCard">
                <p>Area</p>
                <h2>{area}</h2>
            </div>

            <div className="seller-sell-infoCard">
                <p>Bedrooms</p>
                <h2>{bedrooms}</h2>
            </div>

            <div className="seller-sell-infoCard">
                <p>Bathrooms</p>
                <h2>{bathrooms}</h2>
            </div>
        </div>
    );
}
