import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";
import MoreListings from "./MoreListings.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import AddReview from './AddReview.jsx';

export default function RightSection({
    address,
    region,
    price,
    status,
    propertyType,
    area,
    bedrooms,
    bathrooms,
    reviews = [],
    rentUnit,
    availableDate,
}) {
    return (
        <div className="rent-listingRight card">
            <UpperSection address={address} region={region} />
            <PriceSection
                status={status}
                price={price}
                rentUnit={rentUnit}
                availableDate={availableDate}
            />
            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
            />
            <div className="RightSectionReviewMoreListings">
                <ReviewsSection reviews={reviews} limit={3} allow_Delete={false} /> 
                <AddReview />
                <MoreListings />
            </div>
        </div>
    );
}
