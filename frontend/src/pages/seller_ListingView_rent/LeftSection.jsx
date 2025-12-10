import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";
import MoreListings from "./MoreListings.jsx";

export default function LeftSection({
  images,
  certifiedIcon,
  documents,
  title,
  description,
  verificationStatus,
  reviews = [],
  moreListings = [],
}) {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const safeMoreListings = Array.isArray(moreListings) ? moreListings : [];

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
        <ReviewsSection reviews={safeReviews} limit={3} allow_Delete={false} />
        <MoreListings listings={safeMoreListings} />
      </div>
    </div>
  );
}
