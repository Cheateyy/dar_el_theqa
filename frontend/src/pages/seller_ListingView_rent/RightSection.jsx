import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";

export default function RightSection({
    address,
    region,
    price,
    status,
    rentUnit,
    propertyType,
    area,
    bedrooms,
    bathrooms,
    ListingId
}) {
    return (
        <div className="seller-rent-listingRight card">
            <UpperSection address={address} region={region} ListingId={ListingId} />
            <PriceSection price={price} status={status} rentUnit={rentUnit} />
            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
            />
            <div className="RightSectionReviewMoreListings">
                <ReviewsSection />
            </div>
        </div>
    );
}
