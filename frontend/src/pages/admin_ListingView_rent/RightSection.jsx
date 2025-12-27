import UpperSection from "./UpperSection.jsx";
import PriceSection from "./PriceSection.jsx";
import InfoCards from "./InfoCards.jsx";

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
    transactionType,
    onDeleteListing = () => {},
    isDeletingListing = false,
}) {
    return (
        <div className="admin-listingRight card">
            <UpperSection
                address={address}
                region={region}
                onDeleteListing={onDeleteListing}
                isDeleting={isDeletingListing}
            />
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
        </div>
    );
}
