import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({
  images,
  certifiedIcon,
  documents,
  description,
  title,
  verificationStatus,
  reviews = [],
}) {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="seller-sell-listingLeft">
      <ImageSection images={images} />

      {/* match DescriptionSection props: status_icon, description, title */}
      <DescriptionSection
        status_icon={certifiedIcon}
        description={description}
        title={title}
        verificationStatus={verificationStatus}
      />

      <LegalDocumentsSection documents={safeDocuments} />

      <div className="LeftSectionReviewMoreListings">
        <ReviewsSection reviews={safeReviews} limit={3} allow_Delete={false} />
      </div>

    </div>
  );
}
