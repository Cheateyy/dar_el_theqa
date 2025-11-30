import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({ images, certifiedIcon, documents }) {
    return (
        <div className="seller-rent-listingLeft">
            <ImageSection images={images} />
            <DescriptionSection certifiedIcon={certifiedIcon} />
            <LegalDocumentsSection documents={documents} />
            <div className="LeftSectionReviewMoreListings">
                <ReviewsSection />
            </div>
        </div>
    );
}
