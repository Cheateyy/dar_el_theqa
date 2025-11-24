import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import MoreListings from "./MoreListings.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import AddReview from './AddReview.jsx';

export default function LeftSection({ images, certifiedIcon, description }) {
  return (
      <div className="rent-listingLeft">
          <ImageSection images={images} />
          <DescriptionSection certifiedIcon={certifiedIcon} description={description} />
          <div className="LeftSectionReviewMoreListings">
              <ReviewsSection />
              <AddReview />
              <MoreListings />
          </div>
      </div>
  );
}
