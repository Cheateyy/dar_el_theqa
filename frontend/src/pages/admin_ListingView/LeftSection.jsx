import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import ReviewsSection from "../../components/common/ReviewSection/ReviewSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({ images, certifiedIcon, description, documents }) {
    return (
        <div className="admin-listingLeft">
            <ImageSection images={images} />
            <DescriptionSection certifiedIcon={certifiedIcon} description={description} />
            <LegalDocumentsSection documents={documents} />
            <div className="LeftSectionReviewMoreListings">
                <ReviewsSection allow_Delete={true} />
            </div>
        </div>
    );
}
