export default function InfoCards({ propertyType, area, bedrooms, bathrooms }) {
    return (
        <div className="seller-rent-listingInfo">
            <div className="seller-rent-infoCard">
                <p>Property Type</p>
                <h2>{propertyType}</h2>
            </div>

            <div className="seller-rent-infoCard">
                <p>Area</p>
                <h2>{area} m²</h2>
            </div>

            <div className="seller-rent-infoCard">
                <p>Bedrooms</p>
                <h2>{bedrooms}</h2>
            </div>

            <div className="seller-rent-infoCard">
                <p>Bathrooms</p>
                <h2>{bathrooms}</h2>
            </div>
        </div>
    );
}
