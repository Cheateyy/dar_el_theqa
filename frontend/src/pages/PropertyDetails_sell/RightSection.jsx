import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import MoreListings from "./MoreListings.jsx";

export default function RightSection({
    address,
    region,
    price,
    propertyType,
    area,
    bedrooms,
    bathrooms
}) {
    return (
        <div className="sell-listingRight card">
            <UpperSection address={address} region={region} />
            <PriceSection price={price} />
            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
            />
            <div className="phoneMoreList">
                <MoreListings />
            </div>
        </div>
    );
}
