import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

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
}) {
  return (
    <div className="admin-sell-listingLeft">
      <ImageSection images={images} />
      <DescriptionSection
        status_icon={status_icon}
        title={title}
        description={description}
        verificationStatus={verificationStatus}
      />
      <LegalDocumentsSection
        documents={documents}
        onReject={onRejectDocument}
        onAccept={onAcceptDocument}
      />
    </div>
  );
}
