import "./Listing.css";
import NavBar from '../../components/common/NavBarv1/NavBar.jsx';
import LeftSection from './LeftSectionListing.jsx';
import RightSection from './RightSectionListing.jsx';

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import legalDocIcon from '../../assets/images/legal_doc.png';

import {
  getListingDetails,
  updateSellerListing,
  pauseSellerListing,
  deleteSellerListing,
  activateSellerListing,
} from "../../lib/api_3.js";

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
    street_address: "",
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
      { name: "NewDocument.pdf", url: "", icon: legalDocIcon },
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

        // Documents – backend doesn’t send them in your sample; keep placeholders
        setDocuments([
          { name: "Document.pdf", url: "", icon: legalDocIcon },
          { name: "Document.pdf", url: "", icon: legalDocIcon },
        ]);

        // Right section fields mapped from API response
        setFormData({
          wilaya: data.wilaya || "",
          region: data.region || "",
          street_address: data.street_address || "",
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
        street_address: formData.street_address || null,
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
      if (response?.new_status) {
        setStatusCode(response.new_status.toUpperCase());
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
      if (response?.new_status) {
        setStatusCode(response.new_status.toUpperCase());
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
      if (response?.new_status) {
        setStatusCode(response.new_status.toUpperCase());
      }
      alert(response?.message || "Listing activated.");
    } catch (err) {
      console.error("Failed to activate listing", err);
      alert("Failed to activate listing.");
    } finally {
      setActivating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    try {
      await deleteSellerListing(listingId, "SOLD");
      alert("Listing deleted.");
      setStatusCode("DELETED");
      // optional: navigate away
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing.");
    }
  };

  return (
    <>
      <nav>
        <NavBar />
      </nav>

      {loading && <p className="listingdetails-loading">Loading...</p>}
      {error && !loading && (
        <p className="listingdetails-error">{error}</p>
      )}

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
            onDelete={handleDelete}
            saving={saving}
            statusCode={statusCode}
            isPausing={pausing}
            isActivating={activating}
          />
        </div>
      )}
    </>
  );
}
