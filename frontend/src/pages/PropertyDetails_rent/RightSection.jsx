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
    liked = false,
    onToggleLike,
    similarListings = [],
    onSubmitReview,
    isSubmittingReview = false,
    onShowInterest,
    isSendingInterest = false,
}) {
    return (
        <div className="rent-listingRight card">
            <UpperSection
                address={address}
                region={region}
                liked={liked}
                onToggleLike={onToggleLike}
            />
            <PriceSection price={price} status={status} rentUnit={rentUnit} availableDate={availableDate} />
            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                onShowInterest={onShowInterest}
                isSendingInterest={isSendingInterest}
            />
            <div className="RightSectionReviewMoreListings">
                <ReviewsSection reviews={reviews} limit={3} allow_Delete={false} />
                <AddReview onSubmit={onSubmitReview} isSubmitting={isSubmittingReview} />
                <MoreListings listings={similarListings} />
            </div>
        </div>
    );
}
