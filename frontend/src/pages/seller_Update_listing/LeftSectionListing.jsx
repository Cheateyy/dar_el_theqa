import React from "react";
import ListingImage from "./Listing_image.jsx";
import ListingDescription from "./Listing_description.jsx";
import LegalDocumentsSection from "./LegalDocumentsSection.jsx";

export default function LeftSectionListing({
  images = [],
  setImages,
  descriptionData = {},
  onDescriptionChange,
  documents = [],
  onAddDocument,
}) {
  return (
    <div className="seller-update-leftListingSection">
      <ListingImage images={images} setImages={setImages} />
      <ListingDescription
        descriptionData={descriptionData}
        onChange={onDescriptionChange}
      />
      <LegalDocumentsSection
        documents={documents}
        onAddDocument={onAddDocument}
      />
    </div>
  );
}
