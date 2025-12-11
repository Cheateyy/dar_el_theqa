import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";

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
    ListingId,
    onToggleStatus,
    statusActionLabel,
    isStatusLoading,
    onDeleteListing,
    isDeletingListing,
}) {
    return (
        <div className="seller-rent-listingRight card">
            <UpperSection
                address={address}
                region={region}
                ListingId={ListingId}
                onToggleStatus={onToggleStatus}
                statusActionLabel={statusActionLabel}
                isStatusLoading={isStatusLoading}
                onDeleteListing={onDeleteListing}
                isDeletingListing={isDeletingListing}
            />
            <PriceSection price={price} status={status} rentUnit={rentUnit} />
            <InfoCards
                propertyType={propertyType}
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
            />
        </div>
    );
}
