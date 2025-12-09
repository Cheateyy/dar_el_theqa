import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({
  images,
  certifiedIcon,
  documents,
  title,
  description,
  verificationStatus,
}) {
  const safeDocuments = Array.isArray(documents) ? documents : [];

  return (
    <div className="seller-rent-listingLeft">
      <ImageSection images={images} />

      <DescriptionSection
        status_icon={certifiedIcon}
        title={title}
        description={description}
        verificationStatus={verificationStatus}
      />

      <LegalDocumentsSection documents={safeDocuments} />

      <div className="LeftSectionReviewMoreListings">
        <ReviewsSection />
      </div>
    </div>
  );
}
