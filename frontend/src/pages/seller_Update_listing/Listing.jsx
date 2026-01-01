import "./Listing.css";
import NavBar from '../../components/common/NavBarv1/NavBar.jsx';
import LeftSection from './LeftSectionListing.jsx';
import RightSection from './RightSectionListing.jsx';
import ReasonModal from "../../components/common/ReasonModal.jsx";

import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import legalDocIcon from '../../assets/images/legal_doc.png';

import {
  getListingDetails,
  getListingDocuments,
  updateSellerListing,
  pauseSellerListing,
  deleteSellerListing,
  activateSellerListing,
} from "../../lib/api_3.js";

const formatDocumentLabel = (value, fallback) => {
  if (!value || typeof value !== "string") return fallback;
  return value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const mapListingDocuments = (docs = []) => {
  const safeDocs = Array.isArray(docs) ? docs : [];
  return safeDocs.map((doc, index) => ({
    id: doc.id ?? index,
    name:
      doc.name ||
      doc.file_name ||
      formatDocumentLabel(doc.document_type, `Document ${index + 1}`),
    url: doc.url || doc.file_url || doc.file || "",
    icon: legalDocIcon,
    status: (doc.status || "PENDING").toUpperCase(),
    adminNote: doc.admin_note || "",
  }));
};

export default function Listing() {
  const { listingId } = useParams();

  const [images, setImages] = useState([]);
  const [descriptionData, setDescriptionData] = useState({
    title: "",
    description: "",
  });
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    wilaya: "",
    region: "",
    address: "",
    transaction_type: "", // RENT / BUY
    price: "",
    rent_unit: "",        // MONTH / DAY / etc.
    property_type: "",    // apartment / villa / ...
    area: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    available_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState("INACTIVE");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deriveStatusCode = (payload) => {
    const rawStatus =
      payload?.status_label ||
      payload?.status ||
      payload?.rental_status ||
      payload?.verification_status;
    return (rawStatus || "INACTIVE").toUpperCase();
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [
      ...prev,
      {
        name: "NewDocument.pdf",
        url: "",
        icon: legalDocIcon,
        status: "PENDING",
        adminNote: "",
      },
    ]);
  };

  const handleDescriptionChange = (next) => {
    setDescriptionData(next);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch listing details on mount
  useEffect(() => {
    let isCancelled = false;

    async function fetchListing() {
      try {
        setLoading(true);
        const data = await getListingDetails(listingId);
        let docPayload = [];
        try {
          docPayload = await getListingDocuments(listingId);
        } catch (docErr) {
          console.error("Failed to fetch listing documents", docErr);
        }

        if (isCancelled) return;

        // 🔹 DESCRIPTION FIX: actually read description from API
        setDescriptionData({
          title: data.title || "",
          description:
            data.description || // primary
            data.long_description || // fallback
            data.short_description || // another fallback name if you use it
            "", // last resort
        });

        const normalizedDocuments = mapListingDocuments(docPayload);
        setDocuments(normalizedDocuments);

        // Right section fields mapped from API response
        setFormData({
          wilaya: data.wilaya || "",
          region: data.region || "",
          address: data.address || "",
          transaction_type: data.transaction_type || "", // RENT / BUY
          price: data.price ? String(data.price) : "",
          rent_unit: data.rent_unit || "",
          property_type: data.property_type || "",
          area: data.area ? String(data.area) : "",
          floors: data.floors ? String(data.floors) : "",
          bedrooms: data.bedrooms ? String(data.bedrooms) : "",
          bathrooms: data.bathrooms ? String(data.bathrooms) : "",
          available_date: data.available_date || "",
        });

        // Images: leave as empty array so user uploads them manually
        setImages([]);
        setStatusCode(deriveStatusCode(data));

        setError(null);
      } catch (err) {
        console.error("Failed to load listing for edit", err);
        setError("Impossible de charger l'annonce.");
        setDocuments([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    if (listingId) {
      fetchListing();
    } else {
      setLoading(false);
      setError("Invalid listing id.");
    }

    return () => {
      isCancelled = true;
    };
  }, [listingId]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Map formData + descriptionData -> payload expected by backend
      const payload = {
        title: descriptionData.title,
        // 🔹 send description back to backend if supported
        description: descriptionData.description || null,
        transaction_type: formData.transaction_type || null, // RENT / BUY
        wilaya: formData.wilaya || null,
        region: formData.region || null,
        address: formData.address || null,
        price: formData.price ? Number(formData.price) : null,
        rent_unit: formData.rent_unit || null,
        property_type: formData.property_type || null,
        area: formData.area ? Number(formData.area) : null,
        floors: formData.floors ? Number(formData.floors) : null,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        available_date: formData.available_date || null,
        // images/documents upload handled separately
      };

      const response = await updateSellerListing(listingId, payload);
      const nextStatus = response?.status || response?.new_status || response?.listing_status;
      if (nextStatus) {
        setStatusCode(nextStatus.toUpperCase());
      }
      alert(response?.message || "Changes saved. Waiting for Admin approval.");
    } catch (err) {
      console.error("Failed to save listing", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handlePause = async () => {
    try {
      setPausing(true);
      const response = await pauseSellerListing(listingId, { reason: "OTHER" });
      const nextStatus = response?.status || response?.new_status || response?.listing_status;
      if (nextStatus) {
        setStatusCode(nextStatus.toUpperCase());
      }
      alert(response?.message || "Listing paused.");
    } catch (err) {
      console.error("Failed to pause listing", err);
      alert("Failed to pause listing.");
    } finally {
      setPausing(false);
    }
  };

  const handleActivate = async () => {
    try {
      setActivating(true);
      const response = await activateSellerListing(listingId);
      const nextStatus = response?.status || response?.new_status || response?.listing_status;
      if (nextStatus) {
        setStatusCode(nextStatus.toUpperCase());
      }
      alert(response?.message || "Listing activated.");
    } catch (err) {
      console.error("Failed to activate listing", err);
      alert("Failed to activate listing.");
    } finally {
      setActivating(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDelete = async (reason) => {
    try {
      setIsDeleting(true);
      await deleteSellerListing(listingId, reason || "SOLD");
      alert("Listing deleted.");
      setStatusCode("DELETED");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!loading && error) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <nav>
        <NavBar />
      </nav>

      {loading && <p className="listingdetails-loading">Loading...</p>}

      {!loading && !error && (
        <div className="seller-update-Listing">
          <LeftSection
            images={images}
            setImages={setImages}
            descriptionData={descriptionData}
            onDescriptionChange={handleDescriptionChange}
            documents={documents}
            onAddDocument={handleAddDocument}
          />
          <RightSection
            formData={formData}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            onPause={handlePause}
            onActivate={handleActivate}
            onDelete={handleOpenDeleteModal}
            saving={saving}
            statusCode={statusCode}
            isPausing={pausing}
            isActivating={activating}
            isDeleting={isDeleting}
          />
        </div>
      )}

      <ReasonModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onSubmit={handleDelete}
        isSubmitting={isDeleting}
        title="Delete Listing"
        description="Let us know why you are removing this listing so we can keep your account history accurate."
        placeholder="Example: Property sold, duplicate entry, incorrect information, etc."
        confirmLabel="Delete listing"
        requireReason
      />
    </>
  );
}
