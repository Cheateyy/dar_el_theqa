import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import MoreListings from "./MoreListings.jsx";

export default function RightSection({ property }) {
    return (
        <div className="seller-sell-listingRight card">
            <UpperSection address={property.address} region={property.region} />
            <PriceSection price={property.price} />
            <InfoCards
                propertyType={property.type}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
            />
            <div className="phoneMoreList">
                <MoreListings />
            </div>
        </div>
    );
}
