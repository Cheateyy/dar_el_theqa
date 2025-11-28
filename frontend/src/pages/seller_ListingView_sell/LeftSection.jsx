import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import MoreListings from "./MoreListings.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({ images, certifiedIcon, documents, description }) {
  return (
    <div className="seller-sell-listingLeft">
      <ImageSection images={images} />
      <DescriptionSection certifiedIcon={certifiedIcon} description={description} />
      <LegalDocumentsSection documents={documents} />
      <div className="LeftSectMoreListings">
        <MoreListings />
      </div>
    </div>
  );
}
