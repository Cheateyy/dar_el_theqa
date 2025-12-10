import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({
    images,
    certifiedIcon,
    description,
    documents,
    status_icon,
    verificationStatus,
    reviews = [],
    onDeleteReview,
}) {
    return (
        <div className="admin-listingLeft">
            <ImageSection images={images} />
            <DescriptionSection
                certifiedIcon={certifiedIcon}
                status_icon={status_icon}
                description={description}
                verificationStatus={verificationStatus}
            />
            <LegalDocumentsSection documents={documents} />
            <div className="LeftSectionReviewMoreListings">
                <ReviewsSection
                    allow_Delete={Boolean(onDeleteReview)}
                    reviews={reviews}
                    onDeleteReview={onDeleteReview}
                />
            </div>
        </div>
    );
}
