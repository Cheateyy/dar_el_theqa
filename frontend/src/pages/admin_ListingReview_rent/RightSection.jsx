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
    onApprove,
    onReject,
    onDelete,
    isApproving,
    isRejecting,
    isDeleting,
}) {
    return (
        <div className="admin-rent-listingRight card">

            <UpperSection address={address} region={region} onDelete={onDelete} isDeleting={isDeleting} />

            <PriceSection status={status} price={price} rentUnit={rentUnit} />

            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                onApprove={onApprove}
                onReject={onReject}
                isApproving={isApproving}
                isRejecting={isRejecting}
            />
        </div>
    );
}
