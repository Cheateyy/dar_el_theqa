import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";

export default function RightSection({
    address,
    region,
    price,
    status,
    propertyType,
    area,
    bedrooms,
    bathrooms
}) {
    return (
        <div className="seller-rent-listingRight card">
            <UpperSection address={address} region={region} />
            <PriceSection price={price} status={status} />
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
