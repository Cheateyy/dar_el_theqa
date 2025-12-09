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
    bathrooms,
    rentUnit,
    availableDate,
    transactionType
}) {
    return (
        <div className="admin-listingRight card">
            <UpperSection address={address} region={region} />
            <PriceSection
                status={status}
                price={price}
                rentUnit={rentUnit}
                availableDate={availableDate}
                transactionType={transactionType}
            />
            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
            />
            <div className="RightSectionReviewMoreListings">
                <ReviewsSection allow_Delete={true} />
            </div>
        </div>
    );
}
