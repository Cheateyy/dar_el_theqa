import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import MoreListings from "./MoreListings.jsx";

export default function RightSection({ property, moreListings = [], ListingId }) {
    return (
        <div className="seller-sell-listingRight card">
            <UpperSection address={property.address} region={property.region} ListingId={ListingId}/>
            <PriceSection price={property.price} status={property.status} />
            <InfoCards
                propertyType={property.type}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
            />
            {moreListings.length > 0 && (
                <MoreListings listings={moreListings} />
            )}
        </div>
    );
}
