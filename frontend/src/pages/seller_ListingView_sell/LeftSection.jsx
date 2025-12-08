import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import MoreListings from "./MoreListings.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSection({
  images,
  certifiedIcon,
  documents,
  description,
  title,
  verificationStatus,
}) {
  const safeDocuments = Array.isArray(documents) ? documents : [];

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

    </div>
  );
}
