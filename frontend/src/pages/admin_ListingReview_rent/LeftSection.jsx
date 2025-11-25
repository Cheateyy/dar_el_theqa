import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({ images, certifiedIcon, description, documents }) {
  return (
    <div className="admin-rent-listingLeft">
      <ImageSection images={images} />
      <DescriptionSection certifiedIcon={certifiedIcon} description={description} />
      <LegalDocumentsSection documents={documents} />
    </div>
  );
}
