import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import MoreListings from "./MoreListings.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import AddReview from "./AddReview.jsx";

export default function LeftSection({
  images,
  status_icon,
  title,
  description,
  reviews,
  verificationStatus,
}) {
  return (
    <div className="rent-listingLeft">
      <ImageSection images={images} />
      <DescriptionSection
        status_icon={status_icon}
        title={title}
        description={description}
        verificationStatus={verificationStatus}
      />
      <div className="LeftSectionReviewMoreListings">
        <ReviewsSection reviews={reviews} limit={3} allow_Delete={false} /> 
        <AddReview />
        <MoreListings />
      </div>
    </div>
  );
}
