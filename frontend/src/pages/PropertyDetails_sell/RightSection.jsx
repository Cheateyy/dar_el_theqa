import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import MoreListings from "./MoreListings.jsx";

export default function RightSection({
    property,
    similarListings = [],
    liked = false,
    onToggleLike,
    onShowInterest,
    isSendingInterest = false,
}) {
    if (!property) {
        return null;
    }

    return (
        <div className="sell-listingRight card">
            <UpperSection
                address={property.address}
                region={property.region}
                liked={liked}
                onToggleLike={onToggleLike}
            />
            <PriceSection price={property.price} />
            <InfoCards
                propertyType={property.type}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                onShowInterest={onShowInterest}
                isSendingInterest={isSendingInterest}
            />
            <div className="phoneMoreList">
                <MoreListings listings={similarListings} />
            </div>
        </div>
    );
}
