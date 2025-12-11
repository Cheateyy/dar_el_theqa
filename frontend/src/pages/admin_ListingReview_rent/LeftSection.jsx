import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";

export default function LeftSection({
  images,
  certifiedIcon,
  description,
  title,
  documents,
  status_icon,
  onRejectDocument,
  onAcceptDocument,
  verificationStatus,
  reviews = [],
  onDeleteReview,
}) {
  return (
    <div className="admin-rent-listingLeft">
      <ImageSection images={images} />
      <DescriptionSection
        status_icon={status_icon}
        certifiedIcon={certifiedIcon}
        title={title}
        description={description}
        verificationStatus={verificationStatus}
      />
      <LegalDocumentsSection
        documents={documents}
        onReject={onRejectDocument}
        onAccept={onAcceptDocument}
      />
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
