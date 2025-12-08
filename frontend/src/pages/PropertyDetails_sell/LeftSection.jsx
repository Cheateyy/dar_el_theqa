import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import MoreListings from "./MoreListings.jsx";

export default function LeftSection({
    images,
    status_icon,
    title,
    description,
    verificationStatus,
}) {
    return (
        <div className="sell-listingLeft">
            <ImageSection images={images} />
            <DescriptionSection
                status_icon={status_icon} // pass the certified icon
                title={title}
                description={description}
                verificationStatus={verificationStatus}
            />
            <div className="LeftSectionReviewMoreListings">
                <MoreListings />
            </div>
        </div>
    );
}
